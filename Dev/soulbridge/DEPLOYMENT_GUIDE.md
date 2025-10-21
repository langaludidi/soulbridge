# SoulBridge - Production Deployment Guide

## Deployment Status: LIVE

**Deployed:** 2025-10-21 10:12 SAST
**Production URL:** https://soulbridge.co.za

---

## Quick Start - Site is Live!

Your SoulBridge memorial platform is now live and accessible at:
- https://soulbridge.co.za
- https://www.soulbridge.co.za

The site is fully functional with all features deployed. However, you need to complete the webhook configurations below for full functionality.

---

## Required Webhook Configurations

### 1. Clerk (Authentication)

To enable user authentication and automatic profile creation:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your SoulBridge project
3. Navigate to **Settings > Domains**
4. Add authorized domain:
   ```
   soulbridge.co.za
   ```

5. Navigate to **Webhooks**
6. Add new webhook endpoint:
   ```
   Endpoint URL: https://soulbridge.co.za/api/webhooks/clerk
   Events to subscribe:
   - user.created
   - user.updated
   - user.deleted
   ```

7. Copy the webhook secret and verify it matches your `CLERK_WEBHOOK_SECRET` in Vercel environment variables

### 2. Paystack (Payments)

To enable payment processing:

1. Go to [Paystack Dashboard](https://dashboard.paystack.com)
2. Navigate to **Settings > Webhooks**
3. Verify the webhook URL is set to:
   ```
   https://soulbridge.co.za/api/payment/webhook
   ```

4. Ensure these events are enabled:
   - charge.success
   - subscription.create
   - subscription.enable
   - subscription.disable

5. The webhook is already secured with HMAC SHA512 signature verification

---

## Environment Variables - Already Configured

All required environment variables are set in Vercel production:

- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- CLERK_WEBHOOK_SECRET
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SENDGRID_API_KEY
- SENDGRID_FROM_EMAIL
- SENDGRID_FROM_NAME
- NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
- PAYSTACK_SECRET_KEY
- NEXT_PUBLIC_APP_URL (https://soulbridge.co.za)
- NEXT_PUBLIC_APP_NAME (SoulBridge Memorials)

---

## Testing Checklist

### 1. User Authentication
- [ ] Sign up with new account
- [ ] Verify email confirmation works
- [ ] Sign in with existing account
- [ ] Check profile creation in database
- [ ] Test sign out

### 2. Free Plan (Lite)
- [ ] New user gets Lite plan automatically
- [ ] Can create 1 memorial
- [ ] Can upload up to 5 photos
- [ ] Cannot upload videos or audio
- [ ] Gets blocked when trying to create 2nd memorial

### 3. Payment Flow - Essential Plan (R150)
- [ ] Click "Upgrade" on dashboard
- [ ] Select Essential plan
- [ ] Complete Paystack payment
- [ ] Redirect to payment callback page
- [ ] Payment verification succeeds
- [ ] Plan activated in database
- [ ] Can create up to 3 memorials
- [ ] Can upload 30 photos, 10 videos, 10 audio per memorial

### 4. Payment Flow - Premium Plan (R600)
- [ ] Select Premium plan
- [ ] Complete payment
- [ ] Plan activated
- [ ] Can create up to 10 memorials
- [ ] Can upload 200 photos, 30 videos, 30 audio per memorial

### 5. Memorial Features
- [ ] Create memorial
- [ ] Upload photos
- [ ] Upload videos (Essential/Premium only)
- [ ] Upload audio (Essential/Premium only)
- [ ] Add timeline events
- [ ] Add guestbook entries
- [ ] Light virtual candle
- [ ] Generate Order of Service PDF
- [ ] Share memorial on social media
- [ ] Memorial QR code generation

### 6. Mobile Responsiveness
- [ ] Test on iPhone/Safari
- [ ] Test on Android/Chrome
- [ ] Navigation menu works
- [ ] Forms are usable
- [ ] Images load correctly
- [ ] Payment flow works on mobile

---

## Monitoring & Logs

### View Deployment Logs
```bash
vercel logs soulbridge --prod
```

### Check Recent Deployments
```bash
vercel ls soulbridge
```

### Pull Production Environment
```bash
vercel env pull .env.production.local
```

---

## Common Issues & Solutions

### Issue: Authentication not working
**Solution:** Verify Clerk domain is authorized:
1. Check Clerk dashboard domains
2. Ensure soulbridge.co.za is listed
3. Wait 5 minutes for DNS propagation

### Issue: Payments not completing
**Solution:** Check Paystack webhook:
1. Verify webhook URL in Paystack dashboard
2. Check webhook secret matches environment variable
3. Test webhook delivery in Paystack dashboard

### Issue: User not getting Lite plan
**Solution:** Check database trigger:
1. Verify `create_default_user_plan()` function exists
2. Check trigger on profiles table
3. Manually create plan if needed

### Issue: 404 on some pages
**Solution:** Redeploy:
```bash
vercel --prod
```

---

## Database Management

### View Active Plans
```sql
SELECT
  p.email,
  up.plan_type,
  up.plan_status,
  up.valid_until,
  pu.current_memorials_count
FROM user_plans up
JOIN profiles p ON up.profile_id = p.id
LEFT JOIN plan_usage pu ON up.id = pu.plan_id
WHERE up.plan_status = 'active'
ORDER BY up.created_at DESC;
```

### View Recent Payments
```sql
SELECT
  p.email,
  pt.transaction_reference,
  pt.amount,
  pt.plan_type,
  pt.payment_status,
  pt.created_at
FROM payment_transactions pt
JOIN profiles p ON pt.profile_id = p.id
ORDER BY pt.created_at DESC
LIMIT 10;
```

### Manually Activate Plan (if needed)
```sql
-- First, create transaction record
INSERT INTO payment_transactions (
  profile_id,
  transaction_reference,
  amount,
  plan_type,
  payment_status
) VALUES (
  '[user-profile-id]',
  'MANUAL_' || NOW()::TEXT,
  150.00,
  'essential',
  'successful'
);

-- Plan will activate automatically via trigger
```

---

## Rollback Procedure

If you need to rollback to a previous deployment:

```bash
# List recent deployments
vercel ls soulbridge

# Promote a specific deployment to production
vercel promote [deployment-url]
```

---

## Support & Resources

- **Vercel Dashboard:** https://vercel.com/ludidil-5352s-projects/soulbridge
- **GitHub Repository:** https://github.com/langaludidi/soulbridge
- **Clerk Dashboard:** https://dashboard.clerk.com
- **Paystack Dashboard:** https://dashboard.paystack.com
- **Supabase Dashboard:** https://supabase.com/dashboard

---

## Success Metrics

Track these metrics to ensure everything is working:

1. **User Sign-ups:** Monitor in Clerk dashboard
2. **Payment Conversions:** Check Paystack dashboard
3. **Memorial Creation:** Query memorials table
4. **Site Uptime:** Monitor Vercel analytics
5. **Error Rate:** Check Vercel logs

---

## Congratulations!

SoulBridge is now live in production. The platform is ready to help families create beautiful memorial tributes for their loved ones.

Remember to:
1. Complete webhook configurations above
2. Test all user flows
3. Monitor logs for first 48 hours
4. Set up uptime monitoring (optional)

For any issues, check the logs first and refer to the troubleshooting section above.
