import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { hashPassword } from "./auth";

export async function seedAdminFromEnvironment(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email && !password) return;
  if (!email || !password || password.length < 12) {
    throw new Error("Set both ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters), or leave both unset.");
  }
  const [existing] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing) return;
  await db.insert(usersTable).values({ email, name: process.env.ADMIN_NAME?.trim() || "مدير سَنَد", passwordHash: await hashPassword(password), role: "admin" });
  console.info(`Initial admin account created for ${email}`);
}
