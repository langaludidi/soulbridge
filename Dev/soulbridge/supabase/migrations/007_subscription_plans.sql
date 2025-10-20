-- ============================================
-- SoulBridge MVP - Subscription Plans & Payments
-- Phase 7: User Plans and Payment Transactions
-- ============================================

-- ============================================
-- PAYMENT TRANSACTIONS TABLE (created first to avoid circular dependency)
-- ============================================
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

    -- Transaction details
    transaction_reference TEXT UNIQUE NOT NULL,
    payment_provider TEXT DEFAULT 'paystack' CHECK (payment_provider IN ('paystack', 'manual')),
    provider_reference TEXT, -- Paystack transaction reference

    -- Amount details
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'ZAR',

    -- Plan details
    plan_type TEXT NOT NULL CHECK (plan_type IN ('lite', 'essential', 'premium')),
    plan_duration_months INTEGER NOT NULL,

    -- Status
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'successful', 'failed', 'refunded')),

    -- Payment metadata from Paystack
    payment_channel TEXT, -- card, bank, ussd, mobile_money
    payment_method_details JSONB, -- card details, bank details, etc.

    -- Customer details
    customer_email TEXT NOT NULL,
    customer_name TEXT,

    -- Timestamps
    paid_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,

    -- Failure/refund reasons
    failure_reason TEXT,
    refund_reason TEXT,

    -- Metadata and webhook data
    paystack_data JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for payment_transactions table
CREATE INDEX idx_payment_transactions_profile_id ON payment_transactions(profile_id);
CREATE INDEX idx_payment_transactions_reference ON payment_transactions(transaction_reference);
CREATE INDEX idx_payment_transactions_provider_ref ON payment_transactions(provider_reference);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(payment_status);
CREATE INDEX idx_payment_transactions_created_at ON payment_transactions(created_at DESC);

-- ============================================
-- USER PLANS TABLE
-- ============================================
CREATE TABLE user_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

    -- Plan details
    plan_type TEXT NOT NULL CHECK (plan_type IN ('lite', 'essential', 'premium')),
    plan_status TEXT DEFAULT 'active' CHECK (plan_status IN ('active', 'expired', 'cancelled')),

    -- Entitlements based on plan
    max_memorials INTEGER NOT NULL DEFAULT 1,
    max_photos_per_memorial INTEGER NOT NULL DEFAULT 5,
    max_videos_per_memorial INTEGER NOT NULL DEFAULT 0,
    max_audios_per_memorial INTEGER NOT NULL DEFAULT 0,

    -- Themes available
    available_themes TEXT[] DEFAULT ARRAY['classic']::TEXT[],

    -- Features
    explore_listing_enabled BOOLEAN DEFAULT false,
    analytics_level TEXT DEFAULT 'basic' CHECK (analytics_level IN ('basic', 'standard', 'advanced')),
    support_level TEXT DEFAULT 'faq' CHECK (support_level IN ('faq', 'email', 'priority')),

    -- Hosting duration
    hosting_duration_months INTEGER NOT NULL DEFAULT 3,

    -- Pricing
    plan_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    currency TEXT DEFAULT 'ZAR',

    -- Validity period
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,

    -- Payment reference
    transaction_id UUID REFERENCES payment_transactions(id),

    -- Auto-renewal
    auto_renew BOOLEAN DEFAULT false,
    renewal_price DECIMAL(10,2),

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user_plans table
CREATE INDEX idx_user_plans_profile_id ON user_plans(profile_id);
CREATE INDEX idx_user_plans_plan_type ON user_plans(plan_type);
CREATE INDEX idx_user_plans_plan_status ON user_plans(plan_status);
CREATE INDEX idx_user_plans_valid_until ON user_plans(valid_until);
CREATE INDEX idx_user_plans_created_at ON user_plans(created_at DESC);

-- ============================================
-- PLAN USAGE TRACKING TABLE
-- ============================================
CREATE TABLE plan_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES user_plans(id) ON DELETE CASCADE NOT NULL,

    -- Current usage
    current_memorials_count INTEGER DEFAULT 0,

    -- Per-memorial usage (stored as JSONB for flexibility)
    memorial_usage JSONB DEFAULT '{}'::jsonb,
    -- Format: {"memorial_id": {"photos": 5, "videos": 2, "audios": 1}}

    -- Last updated
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for plan_usage table
CREATE INDEX idx_plan_usage_profile_id ON plan_usage(profile_id);
CREATE INDEX idx_plan_usage_plan_id ON plan_usage(plan_id);
CREATE UNIQUE INDEX idx_plan_usage_profile_plan ON plan_usage(profile_id, plan_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to create default Lite plan for new users
CREATE OR REPLACE FUNCTION create_default_user_plan()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_plans (
        profile_id,
        plan_type,
        plan_status,
        max_memorials,
        max_photos_per_memorial,
        max_videos_per_memorial,
        max_audios_per_memorial,
        available_themes,
        explore_listing_enabled,
        analytics_level,
        support_level,
        hosting_duration_months,
        plan_price,
        valid_from,
        valid_until
    ) VALUES (
        NEW.id,
        'lite',
        'active',
        1,
        5,
        0,
        0,
        ARRAY['classic']::TEXT[],
        false,
        'basic',
        'faq',
        3,
        0.00,
        NOW(),
        NOW() + INTERVAL '3 months'
    );

    -- Create usage tracking entry
    INSERT INTO plan_usage (profile_id, plan_id)
    SELECT NEW.id, id FROM user_plans WHERE profile_id = NEW.id AND plan_type = 'lite';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default plan for new users
CREATE TRIGGER create_default_plan_trigger
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_default_user_plan();

-- Function to update user plan after successful payment
CREATE OR REPLACE FUNCTION activate_plan_after_payment()
RETURNS TRIGGER AS $$
DECLARE
    v_max_memorials INTEGER;
    v_max_photos INTEGER;
    v_max_videos INTEGER;
    v_max_audios INTEGER;
    v_themes TEXT[];
    v_explore_enabled BOOLEAN;
    v_analytics_level TEXT;
    v_support_level TEXT;
    v_renewal_price DECIMAL(10,2);
BEGIN
    -- Only proceed if payment is successful and not already processed
    IF NEW.payment_status = 'successful' AND OLD.payment_status != 'successful' THEN

        -- Set entitlements based on plan type
        CASE NEW.plan_type
            WHEN 'essential' THEN
                v_max_memorials := 3;
                v_max_photos := 30;
                v_max_videos := 10;
                v_max_audios := 10;
                v_themes := ARRAY['classic', 'modern']::TEXT[];
                v_explore_enabled := true;
                v_analytics_level := 'standard';
                v_support_level := 'email';
                v_renewal_price := NULL;
            WHEN 'premium' THEN
                v_max_memorials := 10;
                v_max_photos := 200;
                v_max_videos := 30;
                v_max_audios := 30;
                v_themes := ARRAY['classic', 'modern', 'traditional', 'ubuntu']::TEXT[];
                v_explore_enabled := true;
                v_analytics_level := 'advanced';
                v_support_level := 'priority';
                v_renewal_price := 100.00;
            ELSE
                -- Default to lite (shouldn't happen for paid plans)
                v_max_memorials := 1;
                v_max_photos := 5;
                v_max_videos := 0;
                v_max_audios := 0;
                v_themes := ARRAY['classic']::TEXT[];
                v_explore_enabled := false;
                v_analytics_level := 'basic';
                v_support_level := 'faq';
                v_renewal_price := NULL;
        END CASE;

        -- Expire current active plan
        UPDATE user_plans
        SET plan_status = 'expired',
            updated_at = NOW()
        WHERE profile_id = NEW.profile_id
          AND plan_status = 'active';

        -- Create new plan
        INSERT INTO user_plans (
            profile_id,
            plan_type,
            plan_status,
            max_memorials,
            max_photos_per_memorial,
            max_videos_per_memorial,
            max_audios_per_memorial,
            available_themes,
            explore_listing_enabled,
            analytics_level,
            support_level,
            hosting_duration_months,
            plan_price,
            transaction_id,
            valid_from,
            valid_until,
            auto_renew,
            renewal_price
        ) VALUES (
            NEW.profile_id,
            NEW.plan_type,
            'active',
            v_max_memorials,
            v_max_photos,
            v_max_videos,
            v_max_audios,
            v_themes,
            v_explore_enabled,
            v_analytics_level,
            v_support_level,
            NEW.plan_duration_months,
            NEW.amount,
            NEW.id,
            NOW(),
            NOW() + (NEW.plan_duration_months || ' months')::INTERVAL,
            (NEW.plan_type = 'premium'),
            v_renewal_price
        );

        -- Create or update usage tracking
        INSERT INTO plan_usage (profile_id, plan_id)
        SELECT NEW.profile_id, id FROM user_plans
        WHERE profile_id = NEW.profile_id AND plan_status = 'active'
        ON CONFLICT (profile_id, plan_id) DO NOTHING;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to activate plan after successful payment
CREATE TRIGGER activate_plan_trigger
    AFTER UPDATE ON payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION activate_plan_after_payment();

-- Function to get active user plan
CREATE OR REPLACE FUNCTION get_active_user_plan(p_profile_id UUID)
RETURNS TABLE (
    id UUID,
    plan_type TEXT,
    max_memorials INTEGER,
    max_photos_per_memorial INTEGER,
    max_videos_per_memorial INTEGER,
    max_audios_per_memorial INTEGER,
    available_themes TEXT[],
    explore_listing_enabled BOOLEAN,
    analytics_level TEXT,
    support_level TEXT,
    valid_until TIMESTAMPTZ,
    current_memorials_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        up.id,
        up.plan_type,
        up.max_memorials,
        up.max_photos_per_memorial,
        up.max_videos_per_memorial,
        up.max_audios_per_memorial,
        up.available_themes,
        up.explore_listing_enabled,
        up.analytics_level,
        up.support_level,
        up.valid_until,
        COALESCE(pu.current_memorials_count, 0) as current_memorials_count
    FROM user_plans up
    LEFT JOIN plan_usage pu ON up.id = pu.plan_id
    WHERE up.profile_id = p_profile_id
      AND up.plan_status = 'active'
      AND up.valid_until > NOW()
    ORDER BY up.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can create memorial
CREATE OR REPLACE FUNCTION can_create_memorial(p_profile_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_plan RECORD;
BEGIN
    SELECT * INTO v_plan FROM get_active_user_plan(p_profile_id);

    IF v_plan IS NULL THEN
        RETURN false;
    END IF;

    RETURN v_plan.current_memorials_count < v_plan.max_memorials;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================

CREATE TRIGGER update_user_plans_updated_at
    BEFORE UPDATE ON user_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plan_usage_updated_at
    BEFORE UPDATE ON plan_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_usage ENABLE ROW LEVEL SECURITY;

-- User Plans Policies
CREATE POLICY "Users can view their own plans"
    ON user_plans FOR SELECT
    USING (
        profile_id IN (
            SELECT id FROM profiles
            WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Service role can do everything on user_plans"
    ON user_plans FOR ALL
    USING (current_setting('role') = 'service_role');

-- Payment Transactions Policies
CREATE POLICY "Users can view their own transactions"
    ON payment_transactions FOR SELECT
    USING (
        profile_id IN (
            SELECT id FROM profiles
            WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Service role can do everything on payment_transactions"
    ON payment_transactions FOR ALL
    USING (current_setting('role') = 'service_role');

-- Plan Usage Policies
CREATE POLICY "Users can view their own usage"
    ON plan_usage FOR SELECT
    USING (
        profile_id IN (
            SELECT id FROM profiles
            WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Service role can do everything on plan_usage"
    ON plan_usage FOR ALL
    USING (current_setting('role') = 'service_role');

-- ============================================
-- GRANTS
-- ============================================

GRANT ALL ON user_plans TO service_role;
GRANT SELECT ON user_plans TO authenticated;

GRANT ALL ON payment_transactions TO service_role;
GRANT SELECT ON payment_transactions TO authenticated;

GRANT ALL ON plan_usage TO service_role;
GRANT SELECT ON plan_usage TO authenticated;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE user_plans IS 'User subscription plans with entitlements';
COMMENT ON TABLE payment_transactions IS 'Payment transaction records from Paystack';
COMMENT ON TABLE plan_usage IS 'Track usage against plan limits';

COMMENT ON COLUMN user_plans.plan_type IS 'lite (free), essential (R150), premium (R600)';
COMMENT ON COLUMN user_plans.hosting_duration_months IS 'How long memorials are hosted: 3 (lite), 6 (essential), 12 (premium)';
COMMENT ON COLUMN payment_transactions.provider_reference IS 'Paystack transaction reference for verification';
