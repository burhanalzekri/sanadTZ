import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { desc, eq } from "drizzle-orm";
import {
  CreateBookingBody,
  CreateBookingResponse,
  ListAdminBookingsResponse,
  UpdateBookingStatusBody,
  UpdateBookingStatusParams,
  UpdateBookingStatusResponse,
} from "@workspace/api-zod";
import {
  activityLogsTable,
  bookingsTable,
  db,
} from "@workspace/db";
import { decryptBookingContact, encryptBookingContact } from "../lib/booking-privacy";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "تم استلام عدة طلبات. يرجى المحاولة لاحقًا." },
});

router.post("/bookings", bookingLimiter, async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "يرجى مراجعة بيانات الحجز والموافقة على التواصل." });
    return;
  }

  const contactValue = parsed.data.contactValue.trim();
  const validContact =
    parsed.data.contactMethod === "email"
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue)
      : contactValue.replace(/\D/g, "").length >= 6 &&
        contactValue.replace(/\D/g, "").length <= 18;
  const preferredDate = parsed.data.preferredDate.toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  if (!validContact || preferredDate < today) {
    res.status(400).json({ error: "يرجى إدخال وسيلة تواصل صحيحة واختيار يوم غير ماضٍ." });
    return;
  }

  const contact = {
    nickname: parsed.data.nickname.trim(),
    contactMethod: parsed.data.contactMethod,
    contactValue,
  };
  const [booking] = await db
    .insert(bookingsTable)
    .values({
      encryptedContactData: encryptBookingContact(contact),
      preferredDate,
      preferredTime: parsed.data.preferredTime,
    })
    .returning({ id: bookingsTable.id, status: bookingsTable.status });

  res.status(201).json(CreateBookingResponse.parse(booking));
});

router.get("/admin/bookings", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(bookingsTable)
    .orderBy(desc(bookingsTable.createdAt));

  const bookings = rows.map((booking) => ({
    id: booking.id,
    ...decryptBookingContact(booking.encryptedContactData),
    preferredDate: booking.preferredDate,
    preferredTime: booking.preferredTime,
    status: booking.status,
    createdAt: booking.createdAt,
  }));

  res.json(ListAdminBookingsResponse.parse(bookings));
});

router.patch(
  "/admin/bookings/:bookingId",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = UpdateBookingStatusParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid booking id" });
      return;
    }

    const body = UpdateBookingStatusBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid booking status" });
      return;
    }

    const [booking] = await db
      .update(bookingsTable)
      .set({ status: body.data.status, updatedAt: new Date() })
      .where(eq(bookingsTable.id, params.data.bookingId))
      .returning();

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    await db.insert(activityLogsTable).values({
      actorId: req.adminUserId!,
      action: `booking.status.${body.data.status}`,
      entityType: "booking",
      entityId: booking.id,
    });

    res.json(
      UpdateBookingStatusResponse.parse({
        id: booking.id,
        ...decryptBookingContact(booking.encryptedContactData),
        preferredDate: booking.preferredDate,
        preferredTime: booking.preferredTime,
        status: booking.status,
        createdAt: booking.createdAt,
      }),
    );
  },
);

export default router;
