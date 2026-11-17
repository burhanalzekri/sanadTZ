import { and, eq, gt } from "drizzle-orm";
import type { RequestHandler } from "express";
import { authSessionsTable, db, usersTable } from "@workspace/db";
import { hashSessionToken, SESSION_COOKIE } from "../lib/auth";

declare global { namespace Express { interface Request { adminUserId?: string; } } }

export const requireAdmin: RequestHandler = async (req, res, next) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) { res.status(401).json({ error: "Authentication required" }); return; }
  try {
    const [user] = await db.select({ id: usersTable.id, role: usersTable.role })
      .from(authSessionsTable).innerJoin(usersTable, eq(authSessionsTable.userId, usersTable.id))
      .where(and(eq(authSessionsTable.tokenHash, hashSessionToken(token)), gt(authSessionsTable.expiresAt, new Date()), eq(usersTable.active, true))).limit(1);
    if (!user) { res.status(401).json({ error: "Session expired" }); return; }
    if (user.role !== "admin") { res.status(403).json({ error: "Admin role required" }); return; }
    req.adminUserId = user.id;
    next();
  } catch (error) {
    req.log.error({ err: error }, "Admin authorization failed");
    res.status(503).json({ error: "Authorization is temporarily unavailable" });
  }
};
