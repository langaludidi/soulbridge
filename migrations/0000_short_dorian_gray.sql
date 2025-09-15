CREATE TABLE "contact_submissions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject" varchar NOT NULL,
	"message" text NOT NULL,
	"email" varchar,
	"memorial_id" varchar,
	"submitted_by" varchar,
	"status" varchar DEFAULT 'new',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "digital_order_of_service" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memorial_id" varchar NOT NULL,
	"title" varchar DEFAULT 'Celebration of Life',
	"cover_photo_url" varchar,
	"tribute_quote" text,
	"service_date" timestamp,
	"service_time" varchar,
	"venue" text,
	"officiant" varchar,
	"theme" varchar DEFAULT 'classic',
	"font_family" varchar DEFAULT 'serif',
	"status" varchar DEFAULT 'draft',
	"privacy" varchar DEFAULT 'public',
	"download_count" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "families" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"owner_user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "family_members" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"role" varchar DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "UNQ_family_member_user" UNIQUE("family_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "funeral_programs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memorial_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"program_url" varchar NOT NULL,
	"download_count" integer DEFAULT 0,
	"uploaded_by" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" varchar NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar DEFAULT 'ZAR' NOT NULL,
	"status" varchar NOT NULL,
	"provider_payment_id" varchar,
	"partner_id" varchar,
	"partner_revenue_amount" integer DEFAULT 0,
	"paid_at" timestamp,
	"raw_event" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "invoices_provider_payment_id_unique" UNIQUE("provider_payment_id")
);
--> statement-breakpoint
CREATE TABLE "memorial_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memorial_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"event_date" timestamp NOT NULL,
	"location" text,
	"status" varchar DEFAULT 'draft',
	"organized_by" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "memorial_photos" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memorial_id" varchar NOT NULL,
	"photo_url" varchar NOT NULL,
	"caption" text,
	"media_type" varchar DEFAULT 'photo' NOT NULL,
	"is_cover_photo" boolean DEFAULT false,
	"view_count" integer DEFAULT 0,
	"uploaded_by" varchar,
	"uploader_name" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "memorial_subscriptions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memorial_id" varchar NOT NULL,
	"user_id" varchar,
	"email" varchar,
	"subscription_type" varchar DEFAULT 'all_updates' NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "memorials" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar NOT NULL,
	"middle_name" varchar,
	"last_name" varchar NOT NULL,
	"date_of_birth" timestamp NOT NULL,
	"date_of_passing" timestamp NOT NULL,
	"date_of_funeral" timestamp,
	"funeral_address" text,
	"province" varchar NOT NULL,
	"profile_photo_url" varchar,
	"memorial_message" text,
	"status" varchar DEFAULT 'draft',
	"privacy" varchar DEFAULT 'public',
	"submitted_by" varchar,
	"family_id" varchar,
	"partner_id" varchar,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "netcash_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" varchar,
	"invoice_id" varchar,
	"paynow_reference" varchar NOT NULL,
	"netcash_id" varchar,
	"amount" integer NOT NULL,
	"currency" varchar DEFAULT 'ZAR' NOT NULL,
	"status" varchar NOT NULL,
	"customer_email" varchar NOT NULL,
	"customer_reference" varchar,
	"description" text,
	"extra_field_1" varchar,
	"extra_field_2" varchar,
	"extra_field_3" varchar,
	"extra_field_4" varchar,
	"extra_field_5" varchar,
	"verified" boolean DEFAULT false,
	"verified_at" timestamp,
	"security_key" varchar,
	"paid_at" timestamp,
	"failed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "netcash_transactions_paynow_reference_unique" UNIQUE("paynow_reference"),
	CONSTRAINT "netcash_transactions_netcash_id_unique" UNIQUE("netcash_id")
);
--> statement-breakpoint
CREATE TABLE "order_of_service_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_of_service_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"speaker" varchar,
	"duration" varchar,
	"order_index" integer NOT NULL,
	"event_type" varchar NOT NULL,
	"content" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "partner_domains" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"domain" varchar NOT NULL,
	"is_primary" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"ssl_status" varchar DEFAULT 'pending',
	"verification_status" varchar DEFAULT 'pending',
	"verification_token" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "partner_domains_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "partner_leads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" varchar NOT NULL,
	"contact_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar,
	"province" varchar NOT NULL,
	"service_type" varchar NOT NULL,
	"partnership_model" varchar NOT NULL,
	"website" varchar,
	"message" text,
	"status" varchar DEFAULT 'new',
	"converted_to_partner_id" varchar,
	"lead_source" varchar DEFAULT 'website',
	"utm" jsonb,
	"contacted_at" timestamp,
	"contacted_by" varchar,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "partner_members" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"role" varchar DEFAULT 'member' NOT NULL,
	"permissions" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "UNQ_partner_member_user" UNIQUE("partner_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "partner_payouts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"payout_type" varchar NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar DEFAULT 'ZAR' NOT NULL,
	"period" varchar,
	"status" varchar DEFAULT 'pending',
	"invoice_ids" jsonb,
	"referral_conversion_ids" jsonb,
	"payment_method" varchar,
	"payment_reference" varchar,
	"paid_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "partner_subscriptions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"plan" varchar NOT NULL,
	"status" varchar NOT NULL,
	"provider" varchar NOT NULL,
	"provider_customer_id" varchar,
	"provider_subscription_id" varchar,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false,
	"trial_end" timestamp,
	"monthly_memorial_count" integer DEFAULT 0,
	"monthly_revenue_shared" integer DEFAULT 0,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "partner_subscriptions_provider_subscription_id_unique" UNIQUE("provider_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"province" varchar NOT NULL,
	"address" text,
	"website" varchar,
	"phone" varchar,
	"email" varchar,
	"description" text,
	"logo_url" varchar,
	"status" varchar DEFAULT 'draft',
	"tier" varchar DEFAULT 'basic',
	"partnership_model" varchar DEFAULT 'directory',
	"branding_config" jsonb,
	"domain_config" jsonb,
	"revenue_share_pct" integer DEFAULT 0,
	"referral_payout_zar" integer DEFAULT 0,
	"billing_plan" varchar DEFAULT 'basic',
	"onboarding_status" varchar DEFAULT 'pending',
	"submitted_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "referral_codes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"code" varchar NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"usage_count" integer DEFAULT 0,
	"max_uses" integer,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "referral_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "referral_conversions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referral_code_id" varchar NOT NULL,
	"partner_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"conversion_type" varchar NOT NULL,
	"conversion_value" integer DEFAULT 0,
	"payout_amount" integer DEFAULT 0,
	"payout_status" varchar DEFAULT 'pending',
	"subscription_id" varchar,
	"memorial_id" varchar,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"family_id" varchar,
	"provider" varchar NOT NULL,
	"provider_customer_id" varchar,
	"provider_subscription_id" varchar,
	"plan" varchar NOT NULL,
	"interval" varchar NOT NULL,
	"status" varchar NOT NULL,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false,
	"grace_until" timestamp,
	"trial_end" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "subscriptions_provider_subscription_id_unique" UNIQUE("provider_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "tributes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memorial_id" varchar NOT NULL,
	"author_name" varchar NOT NULL,
	"relationship" varchar,
	"message" text NOT NULL,
	"status" varchar DEFAULT 'draft',
	"submitted_by" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"role" varchar DEFAULT 'public',
	"subscription_tier" varchar DEFAULT 'remember',
	"subscription_status" varchar DEFAULT 'active',
	"acquisition_partner_id" varchar,
	"acquisition_referral_code" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" varchar NOT NULL,
	"event_id" varchar NOT NULL,
	"event_type" varchar NOT NULL,
	"processed" boolean DEFAULT false,
	"processed_at" timestamp,
	"raw_event" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "UNQ_webhook_provider_event" UNIQUE("provider","event_id")
);
--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_memorial_id_memorials_id_fk" FOREIGN KEY ("memorial_id") REFERENCES "public"."memorials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_order_of_service" ADD CONSTRAINT "digital_order_of_service_memorial_id_memorials_id_fk" FOREIGN KEY ("memorial_id") REFERENCES "public"."memorials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_order_of_service" ADD CONSTRAINT "digital_order_of_service_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "families" ADD CONSTRAINT "families_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funeral_programs" ADD CONSTRAINT "funeral_programs_memorial_id_memorials_id_fk" FOREIGN KEY ("memorial_id") REFERENCES "public"."memorials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funeral_programs" ADD CONSTRAINT "funeral_programs_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memorial_events" ADD CONSTRAINT "memorial_events_memorial_id_memorials_id_fk" FOREIGN KEY ("memorial_id") REFERENCES "public"."memorials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memorial_events" ADD CONSTRAINT "memorial_events_organized_by_users_id_fk" FOREIGN KEY ("organized_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memorial_photos" ADD CONSTRAINT "memorial_photos_memorial_id_memorials_id_fk" FOREIGN KEY ("memorial_id") REFERENCES "public"."memorials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memorial_photos" ADD CONSTRAINT "memorial_photos_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memorial_subscriptions" ADD CONSTRAINT "memorial_subscriptions_memorial_id_memorials_id_fk" FOREIGN KEY ("memorial_id") REFERENCES "public"."memorials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memorial_subscriptions" ADD CONSTRAINT "memorial_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memorials" ADD CONSTRAINT "memorials_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memorials" ADD CONSTRAINT "memorials_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memorials" ADD CONSTRAINT "memorials_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "netcash_transactions" ADD CONSTRAINT "netcash_transactions_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "netcash_transactions" ADD CONSTRAINT "netcash_transactions_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_of_service_events" ADD CONSTRAINT "order_of_service_events_order_of_service_id_digital_order_of_service_id_fk" FOREIGN KEY ("order_of_service_id") REFERENCES "public"."digital_order_of_service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_domains" ADD CONSTRAINT "partner_domains_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_leads" ADD CONSTRAINT "partner_leads_converted_to_partner_id_partners_id_fk" FOREIGN KEY ("converted_to_partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_leads" ADD CONSTRAINT "partner_leads_contacted_by_users_id_fk" FOREIGN KEY ("contacted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_members" ADD CONSTRAINT "partner_members_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_members" ADD CONSTRAINT "partner_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_payouts" ADD CONSTRAINT "partner_payouts_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_subscriptions" ADD CONSTRAINT "partner_subscriptions_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partners" ADD CONSTRAINT "partners_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_codes" ADD CONSTRAINT "referral_codes_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_conversions" ADD CONSTRAINT "referral_conversions_referral_code_id_referral_codes_id_fk" FOREIGN KEY ("referral_code_id") REFERENCES "public"."referral_codes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_conversions" ADD CONSTRAINT "referral_conversions_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_conversions" ADD CONSTRAINT "referral_conversions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_conversions" ADD CONSTRAINT "referral_conversions_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_conversions" ADD CONSTRAINT "referral_conversions_memorial_id_memorials_id_fk" FOREIGN KEY ("memorial_id") REFERENCES "public"."memorials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tributes" ADD CONSTRAINT "tributes_memorial_id_memorials_id_fk" FOREIGN KEY ("memorial_id") REFERENCES "public"."memorials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tributes" ADD CONSTRAINT "tributes_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_acquisition_partner_id_partners_id_fk" FOREIGN KEY ("acquisition_partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_family_members_family_id" ON "family_members" USING btree ("family_id");--> statement-breakpoint
CREATE INDEX "IDX_family_members_user_id" ON "family_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "IDX_invoices_subscription_id" ON "invoices" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "IDX_invoices_provider_payment_id" ON "invoices" USING btree ("provider_payment_id");--> statement-breakpoint
CREATE INDEX "IDX_invoices_partner_id" ON "invoices" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "IDX_memorial_subscriptions_memorial_id" ON "memorial_subscriptions" USING btree ("memorial_id");--> statement-breakpoint
CREATE INDEX "IDX_memorial_subscriptions_user_id" ON "memorial_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "IDX_memorial_subscriptions_email" ON "memorial_subscriptions" USING btree ("email");--> statement-breakpoint
CREATE INDEX "IDX_netcash_transactions_subscription_id" ON "netcash_transactions" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "IDX_netcash_transactions_invoice_id" ON "netcash_transactions" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "IDX_netcash_transactions_paynow_reference" ON "netcash_transactions" USING btree ("paynow_reference");--> statement-breakpoint
CREATE INDEX "IDX_netcash_transactions_status" ON "netcash_transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "IDX_order_service_events_order_id" ON "order_of_service_events" USING btree ("order_of_service_id");--> statement-breakpoint
CREATE INDEX "IDX_order_service_events_order_index" ON "order_of_service_events" USING btree ("order_index");--> statement-breakpoint
CREATE INDEX "IDX_partner_domains_partner_id" ON "partner_domains" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "IDX_partner_domains_domain" ON "partner_domains" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "IDX_partner_leads_email" ON "partner_leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "IDX_partner_leads_status" ON "partner_leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "IDX_partner_leads_partnership_model" ON "partner_leads" USING btree ("partnership_model");--> statement-breakpoint
CREATE INDEX "IDX_partner_leads_service_type" ON "partner_leads" USING btree ("service_type");--> statement-breakpoint
CREATE INDEX "IDX_partner_leads_province" ON "partner_leads" USING btree ("province");--> statement-breakpoint
CREATE INDEX "IDX_partner_members_partner_id" ON "partner_members" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "IDX_partner_members_user_id" ON "partner_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "IDX_partner_payouts_partner_id" ON "partner_payouts" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "IDX_partner_payouts_status" ON "partner_payouts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "IDX_partner_payouts_period" ON "partner_payouts" USING btree ("period");--> statement-breakpoint
CREATE INDEX "IDX_partner_subscriptions_partner_id" ON "partner_subscriptions" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "IDX_partner_subscriptions_provider_subscription_id" ON "partner_subscriptions" USING btree ("provider_subscription_id");--> statement-breakpoint
CREATE INDEX "IDX_partner_subscriptions_plan_status" ON "partner_subscriptions" USING btree ("plan","status");--> statement-breakpoint
CREATE INDEX "IDX_referral_codes_partner_id" ON "referral_codes" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "IDX_referral_codes_code" ON "referral_codes" USING btree ("code");--> statement-breakpoint
CREATE INDEX "IDX_referral_codes_active" ON "referral_codes" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "IDX_referral_conversions_referral_code_id" ON "referral_conversions" USING btree ("referral_code_id");--> statement-breakpoint
CREATE INDEX "IDX_referral_conversions_partner_id" ON "referral_conversions" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "IDX_referral_conversions_user_id" ON "referral_conversions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "IDX_referral_conversions_payout_status" ON "referral_conversions" USING btree ("payout_status");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "IDX_subscriptions_user_id" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "IDX_subscriptions_family_id" ON "subscriptions" USING btree ("family_id");--> statement-breakpoint
CREATE INDEX "IDX_subscriptions_provider_subscription_id" ON "subscriptions" USING btree ("provider_subscription_id");--> statement-breakpoint
CREATE INDEX "IDX_subscriptions_plan_status" ON "subscriptions" USING btree ("plan","status");--> statement-breakpoint
CREATE INDEX "IDX_webhook_events_provider_type" ON "webhook_events" USING btree ("provider","event_type");