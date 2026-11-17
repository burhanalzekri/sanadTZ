import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { and, eq, gt } from "drizzle-orm";
import { authSessionsTable, db, usersTable } from "@workspace/db";
import { createSessionToken, hashSessionToken, SESSION_COOKIE, SESSION_TTL_MS, verifyPassword } from "../lib/auth";

const router: IRouter = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: "draft-8", legacyHeaders: false, message: { error: "محاولات كثيرة. حاول بعد قليل." } });
// إعداد صريح مستقل عن NODE_ENV وreq.secure، لأن HTTPS في المتصفح قد يصل داخليًا عبر HTTP.
const secureCookies = process.env.COOKIE_SECURE !== "false";
if (!secureCookies && process.env.NODE_ENV !== "development") {
  throw new Error("COOKIE_SECURE=false is permitted only in NODE_ENV=development.");
}
const cookieOptions = {
  httpOnly: true,
  secure: secureCookies,
  sameSite: secureCookies ? ("none" as const) : ("lax" as const),
  path: "/",
};

router.post("/auth/login", loginLimiter, async (req, res): Promise<void> => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 200) {
    res.status(400).json({ error: "أدخل البريد الإلكتروني وكلمة المرور بشكل صحيح." }); return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) {
    res.status(401).json({ error: "بيانات الدخول غير صحيحة." }); return;
  }
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(authSessionsTable).values({ userId: user.id, tokenHash: hashSessionToken(token), expiresAt });
  res.cookie(SESSION_COOKIE, token, { ...cookieOptions, maxAge: SESSION_TTL_MS });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) { res.status(401).json({ error: "غير مسجل الدخول." }); return; }
  const [row] = await db.select({ id: usersTable.id, name: usersTable.name, email: usersTable.email, role: usersTable.role })
    .from(authSessionsTable).innerJoin(usersTable, eq(authSessionsTable.userId, usersTable.id))
    .where(and(eq(authSessionsTable.tokenHash, hashSessionToken(token)), gt(authSessionsTable.expiresAt, new Date()), eq(usersTable.active, true))).limit(1);
  if (!row) { res.clearCookie(SESSION_COOKIE, cookieOptions); res.status(401).json({ error: "انتهت الجلسة. سجّل الدخول مجدداً." }); return; }
  res.json({ user: row });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) await db.delete(authSessionsTable).where(eq(authSessionsTable.tokenHash, hashSessionToken(token)));
  res.clearCookie(SESSION_COOKIE, cookieOptions);
  res.json({ success: true });
});

export default router;
