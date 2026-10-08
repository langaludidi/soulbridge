# Soulbridge application — V1 development baseline
Date: 2026-10-08
Branch: development/mvp-memorial-privacy-20261008

## Product split
- soulbridge.co.za = public marketing website (separate package)
- app.soulbridge.co.za = authenticated family memorial application
- Do not repoint DNS or switch production deployments until all release gates pass.

## Launch-critical family journeys
1. Sign up/sign in; verify ownership and email and record a family contact.
2. Create a **private draft** memorial, upload the family-approved deceased photo.
3. Add obituary, life story, funeral location/time and optional service information.
4. Assemble a browser-based Order of Service, review and print/share a digital link.
5. Preview, explicitly publish, choose public / unlisted / private.
6. Share on WhatsApp using 1200x630 Open Graph previews including the family-approved portrait, with QR code fallback.
7. Receive tributes/condolences and photo submissions, subject to family moderation.
8. Edit, unpublish or archive without leaking previously private content.
9. Mobile-first and low-data access across common South African devices.

## Deferred
AI-written obituaries, music/video hosting, white-label partner dashboards and subscription billing.

## Initial review findings
- 2025 Vercel production build reported 48 compiler errors; unresolved module lucide-react was observed.
- Existing repository contains nested Dev/soulbridge application; root also has package.json.
- Client-facing /memorials/[id] rendered private/draft memorial data before checking ownership; remediation in this branch.
- Existing /api/memorials/[id] PATCH copied arbitrary user-supplied keys into privileged database updates; remediation in this branch.
- Existing creation default was published/public; change to private draft.
- Old upload route places uploads into public Supabase Storage; before launch, restrict private memorial image storage and implement signed URLs.
- Original Soulbridge Supabase database is not visible in the currently connected Supabase project list; remote RLS and migrations are UNVERIFIED.

## No-go until all of these are evidenced
- Correct Vercel root / dependency resolution and clean CI build.
- Branch preview deploy, device responsiveness/accessibility/performance regression.
- Remote database ownership and migration/RLS/storage policies audited.
- Cross-user tests for memorial, tribute, Order of Service and uploaded-photo endpoints.
- Private photo URLs cannot be accessed by unauthorised visitors.
- Draft/unlisted/private search indexing and OG card privacy tested.
- Clerk verification/email and full session/authorization regression passed.
- Functional end-to-end tests for creation, Order of Service, QR and sharing.
- No known P0 or critical security issues and approved production rollback plan.
