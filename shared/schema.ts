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
  unique,
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
  
  // Partner acquisition tracking
  acquisitionPartnerId: varchar("acquisition_partner_id").references((): any => partners.id), // Partner who acquired this user
  acquisitionReferralCode: varchar("acquisition_referral_code"), // Referral code used during signup
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Memorials table
export const memorials = pgTable("memorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  middleName: varchar("middle_name"), // Middle name / nickname
  lastName: varchar("last_name").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  dateOfPassing: timestamp("date_of_passing").notNull(),
  dateOfFuneral: timestamp("date_of_funeral"), // Date of funeral service
  funeralAddress: text("funeral_address"), // Address/place of funeral
  province: varchar("province").notNull(),
  profilePhotoUrl: varchar("profile_photo_url"),
  memorialMessage: text("memorial_message"),
  status: varchar("status").default("draft"), // draft, published, archived
  privacy: varchar("privacy").default("public"), // public, private
  submittedBy: varchar("submitted_by").references(() => users.id),
  familyId: varchar("family_id").references(() => families.id), // For family vault subscriptions
  
  // Partner association
  partnerId: varchar("partner_id").references(() => partners.id), // Partner who facilitated this memorial
  
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
  
  // Partnership model and branding fields
  partnershipModel: varchar("partnership_model").default("directory"), // directory, cobrand, whitelabel, referral
  
  // Branding configuration for co-brand/white-label
  brandingConfig: jsonb("branding_config"), // { logoUrl, primaryColor, secondaryColor, fontFamily, displayName }
  
  // Domain configuration for white-label
  domainConfig: jsonb("domain_config"), // { primaryDomain, customDomains[], sslEnabled }
  
  // Revenue sharing and payouts
  revenueSharePct: integer("revenue_share_pct").default(0), // Percentage for co-brand partnerships
  referralPayoutZar: integer("referral_payout_zar").default(0), // Fixed payout amount in ZAR cents for referrals
  
  // Partner subscription plan
  billingPlan: varchar("billing_plan").default("basic"), // basic, professional, enterprise
  
  // Onboarding status
  onboardingStatus: varchar("onboarding_status").default("pending"), // pending, documents_submitted, approved, active, suspended
  
  submittedBy: varchar("submitted_by").references((): any => users.id),
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
  unique("UNQ_family_member_user").on(table.familyId, table.userId),
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
  providerPaymentId: varchar("provider_payment_id").unique(), // Unique to prevent duplicate invoices
  
  // Partner revenue sharing
  partnerId: varchar("partner_id").references(() => partners.id), // Partner who facilitated this payment
  partnerRevenueAmount: integer("partner_revenue_amount").default(0), // Partner's share in cents
  
  paidAt: timestamp("paid_at"),
  rawEvent: jsonb("raw_event"), // Store full webhook payload
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_invoices_subscription_id").on(table.subscriptionId),
  index("IDX_invoices_provider_payment_id").on(table.providerPaymentId),
  index("IDX_invoices_partner_id").on(table.partnerId),
]);

// Webhook events table for idempotency
export const webhookEvents = pgTable("webhook_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  provider: varchar("provider").notNull(), // paystack, payfast, netcash
  eventId: varchar("event_id").notNull(), // Provider's event ID
  eventType: varchar("event_type").notNull(), // charge.success, subscription.create, etc.
  processed: boolean("processed").default(false),
  processedAt: timestamp("processed_at"),
  rawEvent: jsonb("raw_event"), // Store full event payload
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  // Ensure we don't process the same event twice from same provider
  unique("UNQ_webhook_provider_event").on(table.provider, table.eventId),
  index("IDX_webhook_events_provider_type").on(table.provider, table.eventType),
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

// Partner Members table - for partner staff access
export const partnerMembers = pgTable("partner_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").references(() => partners.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: varchar("role").default("member").notNull(), // owner, admin, member
  permissions: jsonb("permissions"), // Specific permissions for this partner member
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_partner_members_partner_id").on(table.partnerId),
  index("IDX_partner_members_user_id").on(table.userId),
  unique("UNQ_partner_member_user").on(table.partnerId, table.userId),
]);

// Partner Domains table - for white-label domain mapping
export const partnerDomains = pgTable("partner_domains", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").references(() => partners.id).notNull(),
  domain: varchar("domain").notNull().unique(), // e.g., "memorials.example.com"
  isPrimary: boolean("is_primary").default(false), // One primary domain per partner
  isActive: boolean("is_active").default(true),
  sslStatus: varchar("ssl_status").default("pending"), // pending, active, failed
  verificationStatus: varchar("verification_status").default("pending"), // pending, verified, failed
  verificationToken: varchar("verification_token"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_partner_domains_partner_id").on(table.partnerId),
  index("IDX_partner_domains_domain").on(table.domain),
]);

// Referral Codes table - for tracking partner referrals
export const referralCodes = pgTable("referral_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").references(() => partners.id).notNull(),
  code: varchar("code").notNull().unique(), // e.g., "FUNERAL_HOME_2024"
  description: text("description"), // Human-readable description
  isActive: boolean("is_active").default(true),
  usageCount: integer("usage_count").default(0),
  maxUses: integer("max_uses"), // null for unlimited
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_referral_codes_partner_id").on(table.partnerId),
  index("IDX_referral_codes_code").on(table.code),
  index("IDX_referral_codes_active").on(table.isActive),
]);

// Referral Conversions table - for tracking successful referral conversions
export const referralConversions = pgTable("referral_conversions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referralCodeId: varchar("referral_code_id").references(() => referralCodes.id).notNull(),
  partnerId: varchar("partner_id").references(() => partners.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  conversionType: varchar("conversion_type").notNull(), // signup, subscription, memorial_creation
  conversionValue: integer("conversion_value").default(0), // Value in ZAR cents
  payoutAmount: integer("payout_amount").default(0), // Amount partner earns in ZAR cents
  payoutStatus: varchar("payout_status").default("pending"), // pending, processing, paid, failed
  subscriptionId: varchar("subscription_id").references(() => subscriptions.id),
  memorialId: varchar("memorial_id").references(() => memorials.id),
  metadata: jsonb("metadata"), // Additional conversion data
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_referral_conversions_referral_code_id").on(table.referralCodeId),
  index("IDX_referral_conversions_partner_id").on(table.partnerId),
  index("IDX_referral_conversions_user_id").on(table.userId),
  index("IDX_referral_conversions_payout_status").on(table.payoutStatus),
]);

// Partner Payouts table - for partner revenue sharing and referral payouts
export const partnerPayouts = pgTable("partner_payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").references(() => partners.id).notNull(),
  payoutType: varchar("payout_type").notNull(), // revenue_share, referral, bonus
  amount: integer("amount").notNull(), // Amount in ZAR cents
  currency: varchar("currency").default("ZAR").notNull(),
  period: varchar("period"), // e.g., "2024-01" for monthly payouts
  status: varchar("status").default("pending"), // pending, processing, paid, failed
  
  // Related records for tracking source
  invoiceIds: jsonb("invoice_ids"), // Array of invoice IDs for revenue share
  referralConversionIds: jsonb("referral_conversion_ids"), // Array of conversion IDs for referrals
  
  // Payment details
  paymentMethod: varchar("payment_method"), // bank_transfer, paypal, etc.
  paymentReference: varchar("payment_reference"), // External payment reference
  paidAt: timestamp("paid_at"),
  
  metadata: jsonb("metadata"), // Additional payout details
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_partner_payouts_partner_id").on(table.partnerId),
  index("IDX_partner_payouts_status").on(table.status),
  index("IDX_partner_payouts_period").on(table.period),
]);

// Partner Subscriptions table - for partner billing management
export const partnerSubscriptions = pgTable("partner_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").references(() => partners.id).notNull(),
  plan: varchar("plan").notNull(), // basic, professional, enterprise
  status: varchar("status").notNull(), // active, trialing, past_due, canceled, in_grace
  provider: varchar("provider").notNull(), // paystack, payfast, netcash
  providerCustomerId: varchar("provider_customer_id"),
  providerSubscriptionId: varchar("provider_subscription_id").unique(),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  trialEnd: timestamp("trial_end"),
  
  // Usage tracking
  monthlyMemorialCount: integer("monthly_memorial_count").default(0),
  monthlyRevenueShared: integer("monthly_revenue_shared").default(0), // In ZAR cents
  
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_partner_subscriptions_partner_id").on(table.partnerId),
  index("IDX_partner_subscriptions_provider_subscription_id").on(table.providerSubscriptionId),
  index("IDX_partner_subscriptions_plan_status").on(table.plan, table.status),
]);

// Partner Leads table - for capturing partner signup interest
export const partnerLeads = pgTable("partner_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessName: varchar("business_name").notNull(),
  contactName: varchar("contact_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  province: varchar("province").notNull(),
  serviceType: varchar("service_type").notNull(), // funeral_home, florist, caterer, musician, photographer
  partnershipModel: varchar("partnership_model").notNull(), // cobrand, whitelabel, referral
  website: varchar("website"),
  message: text("message"), // Optional message from the lead
  
  // Lead status and conversion tracking
  status: varchar("status").default("new"), // new, contacted, qualified, converted, rejected
  convertedToPartnerId: varchar("converted_to_partner_id").references(() => partners.id),
  leadSource: varchar("lead_source").default("website"), // website, referral, direct, marketing
  utm: jsonb("utm"), // UTM tracking parameters { source, medium, campaign, term, content }
  
  // Contact tracking
  contactedAt: timestamp("contacted_at"),
  contactedBy: varchar("contacted_by").references(() => users.id),
  notes: text("notes"), // Internal notes about the lead
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_partner_leads_email").on(table.email),
  index("IDX_partner_leads_status").on(table.status),
  index("IDX_partner_leads_partnership_model").on(table.partnershipModel),
  index("IDX_partner_leads_service_type").on(table.serviceType),
  index("IDX_partner_leads_province").on(table.province),
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
  partner: one(partners, {
    fields: [memorials.partnerId],
    references: [partners.id],
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
  partner: one(partners, {
    fields: [invoices.partnerId],
    references: [partners.id],
  }),
}));

export const webhookEventsRelations = relations(webhookEvents, ({ one }) => ({
  // No direct relations - this is a standalone audit/idempotency table
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  memorials: many(memorials),
  tributes: many(tributes),
  partners: many(partners),
  ownedFamilies: many(families),
  familyMemberships: many(familyMembers),
  subscriptions: many(subscriptions),
  partnerMemberships: many(partnerMembers),
  referralConversions: many(referralConversions),
  acquisitionPartner: one(partners, {
    fields: [users.acquisitionPartnerId],
    references: [partners.id],
  }),
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

export const partnersRelations = relations(partners, ({ one, many }) => ({
  submitter: one(users, {
    fields: [partners.submittedBy],
    references: [users.id],
  }),
  members: many(partnerMembers),
  domains: many(partnerDomains),
  referralCodes: many(referralCodes),
  payouts: many(partnerPayouts),
  conversions: many(referralConversions),
  subscriptions: many(partnerSubscriptions),
  memorials: many(memorials),
  acquiredUsers: many(users),
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

// Partner-related table relations
export const partnerMembersRelations = relations(partnerMembers, ({ one }) => ({
  partner: one(partners, {
    fields: [partnerMembers.partnerId],
    references: [partners.id],
  }),
  user: one(users, {
    fields: [partnerMembers.userId],
    references: [users.id],
  }),
}));

export const partnerDomainsRelations = relations(partnerDomains, ({ one }) => ({
  partner: one(partners, {
    fields: [partnerDomains.partnerId],
    references: [partners.id],
  }),
}));

export const referralCodesRelations = relations(referralCodes, ({ one, many }) => ({
  partner: one(partners, {
    fields: [referralCodes.partnerId],
    references: [partners.id],
  }),
  conversions: many(referralConversions),
}));

export const referralConversionsRelations = relations(referralConversions, ({ one }) => ({
  referralCode: one(referralCodes, {
    fields: [referralConversions.referralCodeId],
    references: [referralCodes.id],
  }),
  partner: one(partners, {
    fields: [referralConversions.partnerId],
    references: [partners.id],
  }),
  user: one(users, {
    fields: [referralConversions.userId],
    references: [users.id],
  }),
  subscription: one(subscriptions, {
    fields: [referralConversions.subscriptionId],
    references: [subscriptions.id],
  }),
  memorial: one(memorials, {
    fields: [referralConversions.memorialId],
    references: [memorials.id],
  }),
}));

export const partnerPayoutsRelations = relations(partnerPayouts, ({ one }) => ({
  partner: one(partners, {
    fields: [partnerPayouts.partnerId],
    references: [partners.id],
  }),
}));

export const partnerSubscriptionsRelations = relations(partnerSubscriptions, ({ one }) => ({
  partner: one(partners, {
    fields: [partnerSubscriptions.partnerId],
    references: [partners.id],
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

export const insertWebhookEventSchema = createInsertSchema(webhookEvents).omit({
  id: true,
  createdAt: true,
});

// Partner-related insert schemas
export const insertPartnerMemberSchema = createInsertSchema(partnerMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerDomainSchema = createInsertSchema(partnerDomains).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReferralCodeSchema = createInsertSchema(referralCodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  usageCount: true,
});

export const insertReferralConversionSchema = createInsertSchema(referralConversions).omit({
  id: true,
  createdAt: true,
});

export const insertPartnerPayoutSchema = createInsertSchema(partnerPayouts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerSubscriptionSchema = createInsertSchema(partnerSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  monthlyMemorialCount: true,
  monthlyRevenueShared: true,
});

export const insertPartnerLeadSchema = createInsertSchema(partnerLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  convertedToPartnerId: true,
  contactedAt: true,
  contactedBy: true,
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

export type InsertWebhookEvent = z.infer<typeof insertWebhookEventSchema>;
export type WebhookEvent = typeof webhookEvents.$inferSelect;

// Partner-related types
export type InsertPartnerMember = z.infer<typeof insertPartnerMemberSchema>;
export type PartnerMember = typeof partnerMembers.$inferSelect;

export type InsertPartnerDomain = z.infer<typeof insertPartnerDomainSchema>;
export type PartnerDomain = typeof partnerDomains.$inferSelect;

export type InsertReferralCode = z.infer<typeof insertReferralCodeSchema>;
export type ReferralCode = typeof referralCodes.$inferSelect;

export type InsertReferralConversion = z.infer<typeof insertReferralConversionSchema>;
export type ReferralConversion = typeof referralConversions.$inferSelect;

export type InsertPartnerPayout = z.infer<typeof insertPartnerPayoutSchema>;
export type PartnerPayout = typeof partnerPayouts.$inferSelect;

export type InsertPartnerSubscription = z.infer<typeof insertPartnerSubscriptionSchema>;
export type PartnerSubscription = typeof partnerSubscriptions.$inferSelect;

export type InsertPartnerLead = z.infer<typeof insertPartnerLeadSchema>;
export type PartnerLead = typeof partnerLeads.$inferSelect;

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
