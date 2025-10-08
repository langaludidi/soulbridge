-- SoulBridge Pricing Structure Update
-- This migration sets up the correct pricing plans according to the new structure

-- First, clean up existing plans
TRUNCATE TABLE public.plans CASCADE;

-- Insert the 4 pricing tiers with correct pricing
INSERT INTO public.plans (name, description, price_monthly, price_annual, price_lifetime, max_memorials, max_uploads, features, is_active)
VALUES
  -- Free Plan
  (
    'Free',
    'Entry point — allows one memorial to experience SoulBridge',
    0.00,
    0.00,
    0.00,
    1,
    10,
    ARRAY[
      'Create 1 memorial',
      'Upload up to 10 photos',
      'Basic themes (2)',
      'Share link',
      'Guest book',
      'Virtual candles',
      'Timeline'
    ],
    true
  ),

  -- Essential Plan
  (
    'Essential',
    'Build a beautiful, complete tribute',
    99.00,
    999.00,
    NULL,
    1,
    NULL, -- unlimited
    ARRAY[
      '1 memorial',
      'Unlimited photos, videos, audio',
      'All themes (4)',
      'QR code generation',
      'Full social sharing',
      'Timeline',
      'Donation link',
      'Email support',
      'Analytics'
    ],
    true
  ),

  -- Family Plan
  (
    'Family',
    'Honor all your loved ones',
    179.00,
    1799.00,
    NULL,
    3,
    NULL, -- unlimited
    ARRAY[
      'Up to 3 memorials',
      'Unlimited photos, videos, audio',
      'All themes (4)',
      'QR code generation',
      'Full social sharing',
      'Timeline',
      'Donation link',
      'Priority support',
      'Analytics',
      'Early access to new features'
    ],
    true
  ),

  -- Lifetime Plan
  (
    'Lifetime',
    'One price. Infinite memories.',
    NULL,
    NULL,
    2999.00,
    NULL, -- unlimited
    NULL, -- unlimited
    ARRAY[
      'Unlimited memorials',
      'Unlimited photos, videos, audio',
      'All themes + Custom',
      'QR code generation',
      'Full social sharing',
      'Timeline',
      'Donation link',
      'Priority support',
      'Analytics',
      'Future updates included',
      'Custom requests (if feasible)'
    ],
    true
  );

-- Update payment reference field name if it doesn't exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'payments'
    AND column_name = 'netcash_reference'
  ) THEN
    ALTER TABLE public.payments RENAME COLUMN netcash_reference TO payment_reference;
  END IF;
END $$;

-- Add payment_reference column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'payments'
    AND column_name = 'payment_reference'
  ) THEN
    ALTER TABLE public.payments ADD COLUMN payment_reference TEXT;
  END IF;
END $$;

-- Add subscription tracking fields to profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'plan_start_date'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN plan_start_date TIMESTAMP WITH TIME ZONE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'plan_renewal_date'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN plan_renewal_date TIMESTAMP WITH TIME ZONE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'billing_cycle'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual', 'lifetime'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'paystack_subscription_code'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN paystack_subscription_code TEXT;
  END IF;
END $$;

-- Create index on payment_reference for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_payment_reference ON public.payments(payment_reference);
