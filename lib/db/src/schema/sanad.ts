import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";


export const usersTable = pgTable("sanad_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const authSessionsTable = pgTable("sanad_auth_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pathwaysTable = pgTable("sanad_pathways", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  steps: jsonb("steps").$type<string[]>().notNull().default([]),
  activities: jsonb("activities").$type<string[]>().notNull().default([]),
  coverImage: text("cover_image"),
  definition: text("definition"),
  forms: jsonb("forms").$type<Array<{name: string; desc: string}>>().default([]),
  causes: jsonb("causes").$type<string[]>().default([]),
  symptoms: jsonb("symptoms").$type<string[]>().default([]),
  helpSources: jsonb("help_sources").$type<string[]>().default([]),
  audioUrl: text("audio_url"),
  videoUrl: text("video_url"),
  heroImage: text("hero_image"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const contentItemsTable = pgTable("sanad_content_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  seedKey: text("seed_key").unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  kind: text("kind").notNull(),
  category: text("category").notNull(),
  body: text("body"),
  mediaUrl: text("media_url"),
  coverImage: text("cover_image"),
  author: text("author"),
  duration: text("duration"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const bookingsTable = pgTable("sanad_bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  encryptedContactData: text("encrypted_contact_data").notNull(),
  preferredDate: date("preferred_date", { mode: "string" }).notNull(),
  preferredTime: text("preferred_time").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const activityLogsTable = pgTable("sanad_activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: text("actor_id").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================================
// 🆘 Emergency & Help-Now Tables (CMS)
// ============================================================

export const emergencyContactsTable = pgTable("sanad_emergency_contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  number: text("number").notNull(),
  description: text("description"),
  sortOrder: text("sort_order").notNull().default("0"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const organizationsTable = pgTable("sanad_organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  phone: text("phone"),
  url: text("url"),
  sortOrder: text("sort_order").notNull().default("0"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const siteSettingsTable = pgTable("sanad_site_settings", {
  key: text("key").primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});


// جدول التمارين التفاعلية
export const sanadExercises = pgTable("sanad_exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  pathwaySlug: text("pathway_slug").notNull(),
  stepIndex: integer("step_index").notNull().default(0),
  type: text("type").notNull().default('exercise'),
  title: text("title").notNull(),
  fields: jsonb("fields").notNull().default([]),
  mediaType: text("media_type").default('text'),
  mediaUrl: text("media_url"),
  content: text("content"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
