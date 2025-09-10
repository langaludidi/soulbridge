import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("public"), // public, contributor, admin, partner
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Memorials table
export const memorials = pgTable("memorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  dateOfPassing: timestamp("date_of_passing").notNull(),
  province: varchar("province").notNull(),
  profilePhotoUrl: varchar("profile_photo_url"),
  memorialMessage: text("memorial_message"),
  status: varchar("status").default("draft"), // draft, published, archived
  privacy: varchar("privacy").default("public"), // public, private
  submittedBy: varchar("submitted_by").references(() => users.id),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tributes table
export const tributes = pgTable("tributes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").references(() => memorials.id).notNull(),
  authorName: varchar("author_name").notNull(),
  relationship: varchar("relationship"),
  message: text("message").notNull(),
  status: varchar("status").default("draft"), // draft, published, archived
  submittedBy: varchar("submitted_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Partners table
export const partners = pgTable("partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // funeral_home, florist, caterer, musician, photographer
  province: varchar("province").notNull(),
  address: text("address"),
  website: varchar("website"),
  phone: varchar("phone"),
  email: varchar("email"),
  description: text("description"),
  logoUrl: varchar("logo_url"),
  status: varchar("status").default("draft"), // draft, published, archived
  tier: varchar("tier").default("basic"), // basic, professional, enterprise
  submittedBy: varchar("submitted_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Memorial photos table
export const memorialPhotos = pgTable("memorial_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").references(() => memorials.id).notNull(),
  photoUrl: varchar("photo_url").notNull(),
  caption: text("caption"),
  mediaType: varchar("media_type").default("photo").notNull(), // photo, video, audio
  isCoverPhoto: boolean("is_cover_photo").default(false),
  viewCount: integer("view_count").default(0),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  uploaderName: varchar("uploader_name"), // Store uploader name for display
  createdAt: timestamp("created_at").defaultNow(),
});

// Funeral programs table
export const funeralPrograms = pgTable("funeral_programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").references(() => memorials.id).notNull(),
  title: varchar("title").notNull(),
  programUrl: varchar("program_url").notNull(),
  downloadCount: integer("download_count").default(0),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Memorial events table
export const memorialEvents = pgTable("memorial_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").references(() => memorials.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  location: text("location"),
  status: varchar("status").default("draft"), // draft, published, archived
  organizedBy: varchar("organized_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact submissions table
export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subject: varchar("subject").notNull(), // general_inquiry, suggestion, technical_issue, content_concern
  message: text("message").notNull(),
  email: varchar("email"),
  memorialId: varchar("memorial_id").references(() => memorials.id),
  submittedBy: varchar("submitted_by").references(() => users.id),
  status: varchar("status").default("new"), // new, in_progress, resolved
  createdAt: timestamp("created_at").defaultNow(),
});

// Memorial subscriptions table for notification preferences
export const memorialSubscriptions = pgTable("memorial_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").references(() => memorials.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  email: varchar("email"), // For guest subscriptions
  subscriptionType: varchar("subscription_type").default("all_updates").notNull(), // all_updates, photos_only, tributes_only
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_memorial_subscriptions_memorial_id").on(table.memorialId),
  index("IDX_memorial_subscriptions_user_id").on(table.userId),
  index("IDX_memorial_subscriptions_email").on(table.email),
]);

// Relations
export const memorialsRelations = relations(memorials, ({ one, many }) => ({
  submitter: one(users, {
    fields: [memorials.submittedBy],
    references: [users.id],
  }),
  tributes: many(tributes),
  photos: many(memorialPhotos),
  programs: many(funeralPrograms),
  events: many(memorialEvents),
  subscriptions: many(memorialSubscriptions),
}));

export const tributesRelations = relations(tributes, ({ one }) => ({
  memorial: one(memorials, {
    fields: [tributes.memorialId],
    references: [memorials.id],
  }),
  submitter: one(users, {
    fields: [tributes.submittedBy],
    references: [users.id],
  }),
}));

export const partnersRelations = relations(partners, ({ one }) => ({
  submitter: one(users, {
    fields: [partners.submittedBy],
    references: [users.id],
  }),
}));

export const memorialPhotosRelations = relations(memorialPhotos, ({ one }) => ({
  memorial: one(memorials, {
    fields: [memorialPhotos.memorialId],
    references: [memorials.id],
  }),
  uploader: one(users, {
    fields: [memorialPhotos.uploadedBy],
    references: [users.id],
  }),
}));

export const funeralProgramsRelations = relations(funeralPrograms, ({ one }) => ({
  memorial: one(memorials, {
    fields: [funeralPrograms.memorialId],
    references: [memorials.id],
  }),
  uploader: one(users, {
    fields: [funeralPrograms.uploadedBy],
    references: [users.id],
  }),
}));

export const memorialEventsRelations = relations(memorialEvents, ({ one }) => ({
  memorial: one(memorials, {
    fields: [memorialEvents.memorialId],
    references: [memorials.id],
  }),
  organizer: one(users, {
    fields: [memorialEvents.organizedBy],
    references: [users.id],
  }),
}));

export const contactSubmissionsRelations = relations(contactSubmissions, ({ one }) => ({
  memorial: one(memorials, {
    fields: [contactSubmissions.memorialId],
    references: [memorials.id],
  }),
  submitter: one(users, {
    fields: [contactSubmissions.submittedBy],
    references: [users.id],
  }),
}));

export const memorialSubscriptionsRelations = relations(memorialSubscriptions, ({ one }) => ({
  memorial: one(memorials, {
    fields: [memorialSubscriptions.memorialId],
    references: [memorials.id],
  }),
  user: one(users, {
    fields: [memorialSubscriptions.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertMemorialSchema = createInsertSchema(memorials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

export const insertTributeSchema = createInsertSchema(tributes).omit({
  id: true,
  createdAt: true,
});

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMemorialPhotoSchema = createInsertSchema(memorialPhotos).omit({
  id: true,
  createdAt: true,
  viewCount: true,
});

export const insertFuneralProgramSchema = createInsertSchema(funeralPrograms).omit({
  id: true,
  createdAt: true,
  downloadCount: true,
});

export const insertMemorialEventSchema = createInsertSchema(memorialEvents).omit({
  id: true,
  createdAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertMemorialSubscriptionSchema = createInsertSchema(memorialSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertMemorial = z.infer<typeof insertMemorialSchema>;
export type Memorial = typeof memorials.$inferSelect;

export type InsertTribute = z.infer<typeof insertTributeSchema>;
export type Tribute = typeof tributes.$inferSelect;

export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Partner = typeof partners.$inferSelect;

export type InsertMemorialPhoto = z.infer<typeof insertMemorialPhotoSchema>;
export type MemorialPhoto = typeof memorialPhotos.$inferSelect;

export type InsertFuneralProgram = z.infer<typeof insertFuneralProgramSchema>;
export type FuneralProgram = typeof funeralPrograms.$inferSelect;

export type InsertMemorialEvent = z.infer<typeof insertMemorialEventSchema>;
export type MemorialEvent = typeof memorialEvents.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertMemorialSubscription = z.infer<typeof insertMemorialSubscriptionSchema>;
export type MemorialSubscription = typeof memorialSubscriptions.$inferSelect;
