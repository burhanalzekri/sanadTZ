import { Router, type IRouter } from "express";
import { count, desc, eq, inArray, asc } from "drizzle-orm";
import {
  CreatePathwayBody,
  CreatePathwayResponse,
  CreateResourceBody,
  CreateResourceResponse,
  DeletePathwayParams,
  DeleteResourceParams,
  GetAdminSummaryResponse,
  ListAdminPathwaysResponse,
  ListAdminResourcesResponse,
  ListPublicPathwaysResponse,
  ListPublicResourcesResponse,
  UpdatePathwayBody,
  UpdatePathwayParams,
  UpdatePathwayResponse,
  UpdateResourceBody,
  UpdateResourceParams,
  UpdateResourceResponse,
  GetHelpNowResponse,
  CreateEmergencyContactBody,
  UpdateEmergencyContactBody,
  CreateOrganizationBody,
  UpdateOrganizationBody,
  UpdateSiteSettingBody,
} from "@workspace/api-zod";
import {
  activityLogsTable,
  bookingsTable,
  contentItemsTable,
  db,
  pathwaysTable,
  emergencyContactsTable,
  organizationsTable,
  siteSettingsTable, sanadExercises} from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();


// جلب تمارين مسار معين
router.get("/public/exercises/:pathwaySlug", async (req, res): Promise<void> => {
  try {
    const { pathwaySlug } = req.params;
    const result = await db.select().from(sanadExercises)
      .where(eq(sanadExercises.pathwaySlug, pathwaySlug))
      .orderBy(sanadExercises.stepIndex);
    res.json(result || []);
  } catch (err) {
    console.error('❌ EXERCISES API ERROR:', err);
    res.status(500).json({ error: 'تعذّر تحميل التمارين.' });
  }
});

router.get("/public/pathways", async (_req, res): Promise<void> => {
  const pathways = await db
    .select()
    .from(pathwaysTable)
    .where(eq(pathwaysTable.published, true))
    .orderBy(pathwaysTable.createdAt);
  res.json(ListPublicPathwaysResponse.parse(pathways));
});

router.get("/public/resources", async (_req, res): Promise<void> => {
  const resources = await db
    .select()
    .from(contentItemsTable)
    .where(eq(contentItemsTable.published, true))
    .orderBy(desc(contentItemsTable.createdAt));
  res.json(resources); // إرسال البيانات الخام بما فيها cover_image
});

router.get("/admin/summary", requireAdmin, async (_req, res): Promise<void> => {
  const [[bookingCount], [pathwayCount], [resourceCount], [newBookingCount]] =
    await Promise.all([
      db.select({ value: count() }).from(bookingsTable),
      db.select({ value: count() }).from(pathwaysTable),
      db.select({ value: count() }).from(contentItemsTable),
      db
        .select({ value: count() })
        .from(bookingsTable)
        .where(eq(bookingsTable.status, "new")),
    ]);

  res.json(
    GetAdminSummaryResponse.parse({
      bookings: Number(bookingCount?.value ?? 0),
      pathways: Number(pathwayCount?.value ?? 0),
      resources: Number(resourceCount?.value ?? 0),
      newBookings: Number(newBookingCount?.value ?? 0),
    }),
  );
});

router.get("/admin/pathways", requireAdmin, async (_req, res): Promise<void> => {
  const pathways = await db
    .select()
    .from(pathwaysTable)
    .orderBy(pathwaysTable.createdAt);
  res.json(ListAdminPathwaysResponse.parse(pathways));
});

router.post("/admin/pathways", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreatePathwayBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid pathway details" });
    return;
  }

  const [pathway] = await db
    .insert(pathwaysTable)
    .values(parsed.data as any)
    .returning();

  await db.insert(activityLogsTable).values({
    actorId: req.adminUserId!,
    action: "pathway.created",
    entityType: "pathway",
    entityId: pathway.id,
  });

  res.status(201).json(CreatePathwayResponse.parse(pathway));
});

router.patch(
  "/admin/pathways/:pathwayId",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = UpdatePathwayParams.safeParse(req.params);
    const body = UpdatePathwayBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Invalid pathway details" });
      return;
    }

    const [pathway] = await db
      .update(pathwaysTable)
      .set({ ...(body.data as any), updatedAt: new Date() })
      .where(eq(pathwaysTable.id, params.data.pathwayId))
      .returning();

    if (!pathway) {
      res.status(404).json({ error: "Pathway not found" });
      return;
    }

    await db.insert(activityLogsTable).values({
      actorId: req.adminUserId!,
      action: "pathway.updated",
      entityType: "pathway",
      entityId: pathway.id,
    });

    res.json(UpdatePathwayResponse.parse(pathway));
  },
);

router.delete(
  "/admin/pathways/:pathwayId",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = DeletePathwayParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid pathway id" });
      return;
    }

    const [pathway] = await db
      .delete(pathwaysTable)
      .where(eq(pathwaysTable.id, params.data.pathwayId))
      .returning({ id: pathwaysTable.id });

    if (!pathway) {
      res.status(404).json({ error: "Pathway not found" });
      return;
    }

    await db.insert(activityLogsTable).values({
      actorId: req.adminUserId!,
      action: "pathway.deleted",
      entityType: "pathway",
      entityId: pathway.id,
    });

    res.sendStatus(204);
  },
);

router.get("/admin/resources", requireAdmin, async (_req, res): Promise<void> => {
  const resources = await db
    .select()
    .from(contentItemsTable)
    .orderBy(desc(contentItemsTable.createdAt));
  res.json(ListAdminResourcesResponse.parse(resources));
});

router.post("/admin/resources", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateResourceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid resource details" });
    return;
  }

  const [resource] = await db
    .insert(contentItemsTable)
    .values({
      ...parsed.data,
      body: parsed.data.body ?? null,
      mediaUrl: parsed.data.mediaUrl ?? null,
      coverImage: parsed.data.coverImage ?? null,
      author: parsed.data.author ?? null,
      duration: parsed.data.duration ?? null,
    })
    .returning();

  await db.insert(activityLogsTable).values({
    actorId: req.adminUserId!,
    action: "resource.created",
    entityType: "resource",
    entityId: resource.id,
  });

  res.status(201).json(CreateResourceResponse.parse(resource));
});

router.patch(
  "/admin/resources/:resourceId",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = UpdateResourceParams.safeParse(req.params);
    const body = UpdateResourceBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Invalid resource details" });
      return;
    }

    const [resource] = await db
      .update(contentItemsTable)
      .set({
        ...body.data,
        body: body.data.body ?? null,
        mediaUrl: body.data.mediaUrl ?? null,
        coverImage: body.data.coverImage ?? null,
        author: body.data.author ?? null,
        duration: body.data.duration ?? null,
        updatedAt: new Date(),
      })
      .where(eq(contentItemsTable.id, params.data.resourceId))
      .returning();

    if (!resource) {
      res.status(404).json({ error: "Resource not found" });
      return;
    }

    await db.insert(activityLogsTable).values({
      actorId: req.adminUserId!,
      action: "resource.updated",
      entityType: "resource",
      entityId: resource.id,
    });

    res.json(UpdateResourceResponse.parse(resource));
  },
);

router.delete(
  "/admin/resources/:resourceId",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = DeleteResourceParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid resource id" });
      return;
    }

    const [resource] = await db
      .delete(contentItemsTable)
      .where(eq(contentItemsTable.id, params.data.resourceId))
      .returning({ id: contentItemsTable.id });

    if (!resource) {
      res.status(404).json({ error: "Resource not found" });
      return;
    }

    await db.insert(activityLogsTable).values({
      actorId: req.adminUserId!,
      action: "resource.deleted",
      entityType: "resource",
      entityId: resource.id,
    });

    res.sendStatus(204);
  },
);


// ============================================================
// 🆘 Help-Now: Settings Helper + Public Endpoint
// ============================================================

async function getHelpNowData() {
  const contacts = await db
    .select()
    .from(emergencyContactsTable)
    .where(eq(emergencyContactsTable.published, true))
    .orderBy(asc(emergencyContactsTable.sortOrder), asc(emergencyContactsTable.createdAt));

  const orgs = await db
    .select()
    .from(organizationsTable)
    .where(eq(organizationsTable.published, true))
    .orderBy(asc(organizationsTable.sortOrder), asc(organizationsTable.createdAt));

  const settingKeys = ["whatsapp_name", "whatsapp_number", "whatsapp_note"];
  const settings = await db
    .select()
    .from(siteSettingsTable)
    .where(inArray(siteSettingsTable.key, settingKeys));

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return {
    contacts,
    organizations: orgs,
    personalContact: {
      name: settingsMap.whatsapp_name || "سَنَد تعز",
      whatsapp: settingsMap.whatsapp_number || null,
      note: settingsMap.whatsapp_note || null,
    },
  };
}

router.get("/public/help-now", async (_req, res): Promise<void> => {
  try {
    const data = await getHelpNowData();
    res.json(GetHelpNowResponse.parse(data));
  } catch (err) {
    console.error("help-now error:", err);
    res.status(500).json({ error: "Failed to load help-now data" });
  }
});

// ============================================================
// 🆘 Admin: Emergency Contacts
// ============================================================

router.post("/admin/emergency-contacts", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateEmergencyContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid contact details" });
    return;
  }

  const [contact] = await db
    .insert(emergencyContactsTable)
    .values({
      label: parsed.data.label,
      number: parsed.data.number,
      description: parsed.data.description ?? null,
      sortOrder: parsed.data.sortOrder ?? "0",
      published: parsed.data.published ?? true,
    })
    .returning();

  await db.insert(activityLogsTable).values({
    actorId: req.adminUserId!,
    action: "contact.created",
    entityType: "emergency_contact",
    entityId: contact.id,
  });

  res.status(201).json(contact);
});

router.patch("/admin/emergency-contacts/:contactId", requireAdmin, async (req, res): Promise<void> => {
  const body = UpdateEmergencyContactBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid contact details" });
    return;
  }

  const [contact] = await db
    .update(emergencyContactsTable)
    .set({
      label: body.data.label,
      number: body.data.number,
      description: body.data.description ?? null,
      sortOrder: body.data.sortOrder,
      published: body.data.published,
      updatedAt: new Date(),
    })
    .where(eq(emergencyContactsTable.id, String(req.params.contactId)))
    .returning();

  if (!contact) {
    res.status(404).json({ error: "Contact not found" });
    return;
  }

  await db.insert(activityLogsTable).values({
    actorId: req.adminUserId!,
    action: "contact.updated",
    entityType: "emergency_contact",
    entityId: contact.id,
  });

  res.json(contact);
});

router.delete("/admin/emergency-contacts/:contactId", requireAdmin, async (req, res): Promise<void> => {
  const [contact] = await db
    .delete(emergencyContactsTable)
    .where(eq(emergencyContactsTable.id, String(req.params.contactId)))
    .returning();

  if (!contact) {
    res.status(404).json({ error: "Contact not found" });
    return;
  }

  await db.insert(activityLogsTable).values({
    actorId: req.adminUserId!,
    action: "contact.deleted",
    entityType: "emergency_contact",
    entityId: contact.id,
  });

  res.sendStatus(204);
});

// ============================================================
// 🏥 Admin: Organizations
// ============================================================

router.post("/admin/organizations", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateOrganizationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid organization details" });
    return;
  }

  const [org] = await db
    .insert(organizationsTable)
    .values({
      name: parsed.data.name,
      description: parsed.data.description,
      phone: parsed.data.phone ?? null,
      url: parsed.data.url ?? null,
      sortOrder: parsed.data.sortOrder ?? "0",
      published: parsed.data.published ?? true,
    })
    .returning();

  await db.insert(activityLogsTable).values({
    actorId: req.adminUserId!,
    action: "organization.created",
    entityType: "organization",
    entityId: org.id,
  });

  res.status(201).json(org);
});

router.patch("/admin/organizations/:orgId", requireAdmin, async (req, res): Promise<void> => {
  const body = UpdateOrganizationBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid organization details" });
    return;
  }

  const [org] = await db
    .update(organizationsTable)
    .set({
      name: body.data.name,
      description: body.data.description,
      phone: body.data.phone ?? null,
      url: body.data.url ?? null,
      sortOrder: body.data.sortOrder,
      published: body.data.published,
      updatedAt: new Date(),
    })
    .where(eq(organizationsTable.id, String(req.params.orgId)))
    .returning();

  if (!org) {
    res.status(404).json({ error: "Organization not found" });
    return;
  }

  await db.insert(activityLogsTable).values({
    actorId: req.adminUserId!,
    action: "organization.updated",
    entityType: "organization",
    entityId: org.id,
  });

  res.json(org);
});

router.delete("/admin/organizations/:orgId", requireAdmin, async (req, res): Promise<void> => {
  const [org] = await db
    .delete(organizationsTable)
    .where(eq(organizationsTable.id, String(req.params.orgId)))
    .returning();

  if (!org) {
    res.status(404).json({ error: "Organization not found" });
    return;
  }

  await db.insert(activityLogsTable).values({
    actorId: req.adminUserId!,
    action: "organization.deleted",
    entityType: "organization",
    entityId: org.id,
  });

  res.sendStatus(204);
});

// ============================================================
// ⚙️ Admin: Site Settings
// ============================================================

router.patch("/admin/settings/:key", requireAdmin, async (req, res): Promise<void> => {
  const body = UpdateSiteSettingBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid setting value" });
    return;
  }

  const [setting] = await db
    .insert(siteSettingsTable)
    .values({
      key: String(req.params.key),
      value: body.data.value,
    })
    .onConflictDoUpdate({
      target: siteSettingsTable.key,
      set: {
        value: body.data.value,
        updatedAt: new Date(),
      },
    })
    .returning();

  await db.insert(activityLogsTable).values({
    actorId: req.adminUserId!,
    action: "setting.updated",
    entityType: "site_setting",
    entityId: setting.key,
  });

  res.json({ key: setting.key, value: setting.value });
});
export default router;
