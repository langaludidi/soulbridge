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
  // Note: subscriptionTier and subscriptionStatus are cached from subscriptions table
  // The subscriptions table is the source of truth - these are updated when subscription changes
  subscriptionTier: varchar("subscription_tier").default("remember"), // remember, honour, legacy, family_vault
  subscriptionStatus: varchar("subscription_status").default("active"), // active, trialing, past_due, canceled, in_grace
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
  familyId: varchar("family_id").references(() => families.id), // For family vault subscriptions
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

// Families table for Family Vault subscriptions
export const families = pgTable("families", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  ownerUserId: varchar("owner_user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Family members table for Family Vault access
export const familyMembers = pgTable("family_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").references(() => families.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: varchar("role").default("member").notNull(), // owner, member
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_family_members_family_id").on(table.familyId),
  index("IDX_family_members_user_id").on(table.userId),
  // Ensure unique family membership - no duplicate users in same family
  index("UNQ_family_member_user").unique().on(table.familyId, table.userId),
]);

// Subscriptions table for billing management
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  familyId: varchar("family_id").references(() => families.id),
  provider: varchar("provider").notNull(), // paystack, payfast, netcash
  providerCustomerId: varchar("provider_customer_id"),
  providerSubscriptionId: varchar("provider_subscription_id").unique(), // Ensure unique provider subscription IDs
  plan: varchar("plan").notNull(), // remember, honour, legacy, family_vault
  interval: varchar("interval").notNull(), // monthly, yearly
  status: varchar("status").notNull(), // active, trialing, past_due, canceled, in_grace
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  graceUntil: timestamp("grace_until"),
  trialEnd: timestamp("trial_end"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_subscriptions_user_id").on(table.userId),
  index("IDX_subscriptions_family_id").on(table.familyId),
  index("IDX_subscriptions_provider_subscription_id").on(table.providerSubscriptionId),
  index("IDX_subscriptions_plan_status").on(table.plan, table.status), // For admin reports
  // Business rule: exactly one of userId or familyId must be set, but not both
  sql`CONSTRAINT chk_subscription_subject CHECK ((user_id IS NOT NULL AND family_id IS NULL) OR (user_id IS NULL AND family_id IS NOT NULL))`,
]);

// Invoices/Payments table for billing history
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subscriptionId: varchar("subscription_id").references(() => subscriptions.id).notNull(),
  amount: integer("amount").notNull(), // Amount in cents
  currency: varchar("currency").default("ZAR").notNull(),
  status: varchar("status").notNull(), // pending, paid, failed, refunded
  providerPaymentId: varchar("provider_payment_id"),
  paidAt: timestamp("paid_at"),
  rawEvent: jsonb("raw_event"), // Store full webhook payload
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_invoices_subscription_id").on(table.subscriptionId),
  index("IDX_invoices_provider_payment_id").on(table.providerPaymentId),
]);

// Digital Order of Service table - Main program details
export const digitalOrderOfService = pgTable("digital_order_of_service", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorialId: varchar("memorial_id").references(() => memorials.id).notNull(),
  
  // Cover page details
  title: varchar("title").default("Celebration of Life"), // "Celebration of Life", "Funeral Service", etc.
  coverPhotoUrl: varchar("cover_photo_url"),
  tributeQuote: text("tribute_quote"), // Short tribute/quote for cover page
  
  // Service details
  serviceDate: timestamp("service_date"),
  serviceTime: varchar("service_time"), // e.g., "10:00 AM"
  venue: text("venue"), // Service location
  officiant: varchar("officiant"), // Person conducting the service
  
  // Customization
  theme: varchar("theme").default("classic"), // classic, modern, floral, etc.
  fontFamily: varchar("font_family").default("serif"), // serif, sans-serif, script
  
  // Metadata
  status: varchar("status").default("draft"), // draft, published, archived
  privacy: varchar("privacy").default("public"), // public, private, family_only
  downloadCount: integer("download_count").default(0),
  viewCount: integer("view_count").default(0),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order of Service Events table - Individual service events
export const orderOfServiceEvents = pgTable("order_of_service_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderOfServiceId: varchar("order_of_service_id").references(() => digitalOrderOfService.id).notNull(),
  
  // Event details
  title: varchar("title").notNull(), // "Opening Prayer", "Reading", "Eulogy", etc.
  description: text("description"), // Additional details about the event
  speaker: varchar("speaker"), // Person conducting this part
  duration: varchar("duration"), // e.g., "5 minutes"
  
  // Order and display
  orderIndex: integer("order_index").notNull(), // Order in the service
  eventType: varchar("event_type").notNull(), // prayer, reading, music, eulogy, reflection, closing
  
  // Optional content
  content: text("content"), // Specific prayer text, reading passage, etc.
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_order_service_events_order_id").on(table.orderOfServiceId),
  index("IDX_order_service_events_order_index").on(table.orderIndex),
]);

// Relations
export const memorialsRelations = relations(memorials, ({ one, many }) => ({
  submitter: one(users, {
    fields: [memorials.submittedBy],
    references: [users.id],
  }),
  family: one(families, {
    fields: [memorials.familyId],
    references: [families.id],
  }),
  tributes: many(tributes),
  photos: many(memorialPhotos),
  programs: many(funeralPrograms),
  events: many(memorialEvents),
  subscriptions: many(memorialSubscriptions),
  orderOfService: many(digitalOrderOfService),
}));

export const familiesRelations = relations(families, ({ one, many }) => ({
  owner: one(users, {
    fields: [families.ownerUserId],
    references: [users.id],
  }),
  members: many(familyMembers),
  memorials: many(memorials),
  subscriptions: many(subscriptions),
}));

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
  family: one(families, {
    fields: [familyMembers.familyId],
    references: [families.id],
  }),
  user: one(users, {
    fields: [familyMembers.userId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  family: one(families, {
    fields: [subscriptions.familyId],
    references: [families.id],
  }),
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [invoices.subscriptionId],
    references: [subscriptions.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  memorials: many(memorials),
  tributes: many(tributes),
  partners: many(partners),
  ownedFamilies: many(families),
  familyMemberships: many(familyMembers),
  subscriptions: many(subscriptions),
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

export const digitalOrderOfServiceRelations = relations(digitalOrderOfService, ({ one, many }) => ({
  memorial: one(memorials, {
    fields: [digitalOrderOfService.memorialId],
    references: [memorials.id],
  }),
  creator: one(users, {
    fields: [digitalOrderOfService.createdBy],
    references: [users.id],
  }),
  events: many(orderOfServiceEvents),
}));

export const orderOfServiceEventsRelations = relations(orderOfServiceEvents, ({ one }) => ({
  orderOfService: one(digitalOrderOfService, {
    fields: [orderOfServiceEvents.orderOfServiceId],
    references: [digitalOrderOfService.id],
  }),
}));

// Insert schemas
export const insertMemorialSchema = createInsertSchema(memorials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
}).extend({
  // Robust date validation with coercion and validation checks
  dateOfBirth: z.coerce.date().refine(date => !isNaN(date.getTime()), {
    message: "Please enter a valid birth date"
  }),
  dateOfPassing: z.coerce.date().refine(date => !isNaN(date.getTime()), {
    message: "Please enter a valid passing date"
  }),
}).refine(data => data.dateOfBirth <= data.dateOfPassing, {
  message: "Birth date must be before passing date",
  path: ["dateOfPassing"]
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

export const insertDigitalOrderOfServiceSchema = createInsertSchema(digitalOrderOfService).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  downloadCount: true,
  viewCount: true,
});

export const insertOrderOfServiceEventSchema = createInsertSchema(orderOfServiceEvents).omit({
  id: true,
  createdAt: true,
});

export const insertFamilySchema = createInsertSchema(families).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFamilyMemberSchema = createInsertSchema(familyMembers).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
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

export type InsertDigitalOrderOfService = z.infer<typeof insertDigitalOrderOfServiceSchema>;
export type DigitalOrderOfService = typeof digitalOrderOfService.$inferSelect;

export type InsertOrderOfServiceEvent = z.infer<typeof insertOrderOfServiceEventSchema>;
export type OrderOfServiceEvent = typeof orderOfServiceEvents.$inferSelect;

export type InsertFamily = z.infer<typeof insertFamilySchema>;
export type Family = typeof families.$inferSelect;

export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;
export type FamilyMember = typeof familyMembers.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// Subscription tier types and entitlements
export type SubscriptionTier = "remember" | "honour" | "legacy" | "family_vault";
export type SubscriptionInterval = "monthly" | "yearly";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "in_grace";

export interface SubscriptionEntitlements {
  memorialLimit: number | "unlimited";
  allowGallery: boolean;
  allowAudioVideo: boolean;
  allowPdf: boolean;
  allowEvents: boolean;
  allowFamilyTree: boolean;
  allowPrivateLink: boolean;
  maxPhotos: number | "unlimited";
}

// Helper function to get entitlements for a subscription tier
export function getSubscriptionEntitlements(tier: SubscriptionTier): SubscriptionEntitlements {
  switch (tier) {
    case "remember":
      return {
        memorialLimit: 1,
        allowGallery: false,
        allowAudioVideo: false,
        allowPdf: true,
        allowEvents: false,
        allowFamilyTree: false,
        allowPrivateLink: false,
        maxPhotos: 1,
      };
    case "honour":
      return {
        memorialLimit: 3,
        allowGallery: true,
        allowAudioVideo: true,
        allowPdf: true,
        allowEvents: false,
        allowFamilyTree: false,
        allowPrivateLink: true,
        maxPhotos: 10,
      };
    case "legacy":
      return {
        memorialLimit: "unlimited",
        allowGallery: true,
        allowAudioVideo: true,
        allowPdf: true,
        allowEvents: true,
        allowFamilyTree: true,
        allowPrivateLink: true,
        maxPhotos: "unlimited",
      };
    case "family_vault":
      return {
        memorialLimit: "unlimited",
        allowGallery: true,
        allowAudioVideo: true,
        allowPdf: true,
        allowEvents: true,
        allowFamilyTree: true,
        allowPrivateLink: true,
        maxPhotos: "unlimited",
      };
    default:
      return getSubscriptionEntitlements("remember");
  }
}
