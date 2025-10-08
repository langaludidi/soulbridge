# SoulBridge Development Guide

## 🎯 What's Been Built

### ✅ Completed Features

#### 1. **Design System & Branding**
- **Colors**: Delft Blue (#2E3C5A), Cambridge Blue (#96B496), Gray (#738180)
- **Typography**: Playfair Display (headings), Inter (body)
- **Spacing**: 4pt grid system, consistent padding/margins
- **Components**: 15+ reusable UI components

#### 2. **Component Library** (`src/components/ui/`)
- **Button** - 6 variants (primary, secondary, accent, outline, ghost, destructive)
- **Input** - Text, email, password with error states
- **Textarea** - Multi-line text input
- **Card** - Container with shadow and border
- **Modal** - Dialog with overlay (Radix UI)
- **Badge** - Status pills with variants
- **Tabs** - Tabbed interface
- **Label** - Form labels

#### 3. **Layout Components** (`src/components/site/`)
- **Navbar**:
  - Responsive (desktop + mobile menu)
  - Glassmorphic background effect
  - Links: Product, Features, Pricing, Examples, How It Works, Support
  - Actions: Sign In, Create Memorial (accent pill)
- **Footer**:
  - 3-column layout (Product, Company, Support)
  - Legal links, support email
- **FloatingAudioPlayer**:
  - Sticky bottom player
  - Play/pause, next/previous, volume control
  - Track info and progress bar
  - Mobile responsive

#### 4. **Marketing Pages**
- **Homepage** (`/`):
  - Hero section with CTA
  - Feature cards (Gallery, Timeline, Guestbook, QR)
  - Testimonials
  - Value proposition
  - Final CTA
- **Pricing Page** (`/pricing`):
  - Plan toggle (Monthly / Annual / Lifetime)
  - 4 pricing tiers with feature lists
  - Comparison table
  - "Most Popular" badge on Essential
  - Links to checkout

#### 5. **Authentication** (`/sign-in`, `/sign-up`)
- **Sign In**:
  - Email + password
  - Google OAuth option
  - "Forgot password" link
  - Form validation
- **Sign Up**:
  - Full name, email, password, confirm password
  - Google OAuth option
  - Terms & Privacy consent
  - Plan badge (if coming from pricing)
- **Auth Callback** (`/auth/callback`):
  - Handles OAuth redirect
  - Routes to dashboard

#### 6. **Dashboard** (`/dashboard`)
- Plan display (Free/Essential/Family/Lifetime)
- Memorial grid with cards
- Empty state with CTA
- Upgrade banner for free users
- Memorial actions: View, Edit, Share, Delete
- View/tribute counters (placeholder)

#### 7. **Database Schema** (`supabase/schema.sql`)
All tables with Row Level Security:
- **profiles** - User data, plan, subscription status
- **memorials** - Full memorial data (name, dates, photos, privacy, status)
- **gallery_items** - Photos, videos, audio with ordering
- **timeline_events** - Life milestones
- **tributes** - Guestbook entries
- **relationships** - Family members
- **plans** - Subscription definitions (seeded with 4 plans)
- **payments** - Payment history with Netcash references

Includes:
- Auto-create profile trigger on user signup
- Updated_at triggers
- Complete RLS policies for security

#### 8. **Supabase Integration**
- Client setup (`src/lib/supabase/client.ts`)
- TypeScript types (`src/lib/supabase/database.types.ts`)
- Environment variable configuration

#### 9. **Configuration Files**
- `tailwind.config.js` - Design tokens, custom utilities
- `globals.css` - CSS variables, design tokens
- `.env.local.example` - Environment variable template
- `next.config.ts` - Next.js configuration

---

## 🚧 What Still Needs to Be Built

### Priority 1: Core Memorial Features

#### Memorial Creation Wizard (`/memorial/create`)
**8-step flow with autosave:**

1. **Profile Step** (`/memorial/create?step=1`)
   - Full name (required)
   - Date of birth, date of death
   - Auto-calculate age at passing
   - Profile photo upload (circle preview)

2. **Obituary Step** (`/memorial/create?step=2`)
   - Short tribute (160 chars max, for sharing)
   - Full obituary (rich text editor)
   - Optional verse/quote

3. **Gallery Step** (`/memorial/create?step=3`)
   - Tabs: Photos / Audio / Videos
   - Drag-and-drop upload
   - Progress bars
   - Thumbnail previews
   - Delete functionality
   - Background audio checkbox (for audio)

4. **Timeline Step** (`/memorial/create?step=4`)
   - Add event rows (date, title, description, icon)
   - Reorder events
   - Preview vertical timeline

5. **Relationships Step** (`/memorial/create?step=5`)
   - Spouse, children, parents, siblings
   - Tag-style input

6. **Donations & RSVP** (`/memorial/create?step=6`)
   - Toggle donations → Netcash Pay Link URL field
   - Toggle RSVP → Event details (date, time, location, text)

7. **Privacy Step** (`/memorial/create?step=7`)
   - Radio: Public / Private / Unlisted
   - Allow comments/guestbook toggle

8. **Review & Publish** (`/memorial/create?step=8`)
   - Read-only summary of all sections
   - Edit links to go back
   - Checkbox: "I confirm content is respectful"
   - Publish button → generates slug → redirects to memorial

**Components needed:**
- `<WizardStepper>` - Progress indicator
- `<ImageUploader>` - Dropzone with preview
- `<RichTextEditor>` - WYSIWYG (use Tiptap or similar)
- `<TimelineBuilder>` - Add/edit/reorder events
- `<AutoSave>` - Save draft every 30 seconds

#### Public Memorial Page (`/memorial/[slug]`)
**Dynamic page structure:**

1. **Hero Section**
   - Profile photo (large, centered)
   - Full name
   - Dates (DOB - DOD)
   - Age at death
   - Optional verse
   - Soft gradient background

2. **Floating Audio Player** (if background audio exists)
   - Sticky at bottom
   - Auto-play on user interaction
   - Show track name
   - Play/Pause, Volume, Next/Prev

3. **Obituary Section**
   - Full text
   - Readable line width (max-w-3xl)

4. **Timeline Section**
   - Vertical layout with dates
   - Icons (if set)
   - Descriptions

5. **Gallery Section**
   - Tabs: Photos / Videos / Audio
   - Photo grid (lightbox on click)
   - Video embeds
   - Audio list with play buttons

6. **Guestbook Section**
   - Form: Name + Message
   - "Light a Candle" button (icon + count)
   - List of public tributes (most recent first)
   - Moderation note (if owner viewing)

7. **Donations Section** (if enabled)
   - CTA button → opens Netcash Pay Link in new tab
   - Optional progress bar

8. **RSVP Section** (if enabled)
   - Event details
   - RSVP form (name, email, attending yes/no)

9. **Share Bar** (floating)
   - WhatsApp, Facebook, X, Email, QR, Copy Link
   - Tooltip on hover

10. **Floating Bottom Nav**
    - Sticky tabs: Obituary | Gallery | Timeline | Guestbook | Donate | RSVP
    - Scroll to section on click
    - Active section highlight

**Components needed:**
- `<MemorialHero>`
- `<GalleryGrid>` with Lightbox
- `<TimelineVertical>`
- `<GuestbookForm>` + `<TributeList>`
- `<ShareButtons>`
- `<FloatingNav>`
- `<DonationCTA>`
- `<RSVPForm>`

### Priority 2: Sharing & Monetization

#### Sharing System
**QR Code Generation:**
- API endpoint: `/api/qr?url={memorial_url}`
- Use quickchart.io or qr-code library
- Download button
- Display in modal

**Open Graph Metadata:**
- Dynamic OG tags per memorial
- `og:title`: "In Memory of {Name} ({birth}–{death})"
- `og:description`: Short obituary
- `og:image`: Profile photo
- Twitter card: summary_large_image

**Social Share URLs:**
- WhatsApp: `https://api.whatsapp.com/send?text={TITLE}+{URL}`
- Facebook: `https://www.facebook.com/sharer/sharer.php?u={URL}`
- X: `https://twitter.com/intent/tweet?text={TITLE}&url={URL}`
- Email: `mailto:?subject={TITLE}&body={URL}`

#### Netcash Payment Integration
**Checkout Page** (`/checkout`)
- Display selected plan + amount
- User info (name, email prefilled)
- "Proceed to Payment" button
- Redirect to Netcash Pay Now
- Pass return URLs: /payment/success, /payment/cancelled

**Payment Success** (`/payment/success`)
- Confirmation message
- CTA: "Create Your First Memorial" → /memorial/create

**Payment Cancelled** (`/payment/cancelled`)
- Info banner
- CTA: Back to /pricing

**Webhook Handler** (`/api/webhooks/netcash`)
- Receive payment notifications
- Update payment record
- Upgrade user plan
- Send email receipt

### Priority 3: File Uploads

#### Supabase Storage Integration
**Upload Flow:**
1. User selects file
2. Validate: type, size
3. Generate unique filename: `{memorial_id}/{type}/{uuid}.{ext}`
4. Upload to Supabase Storage bucket
5. Get public URL
6. Save to `gallery_items` table

**Storage Buckets:**
- `memorial-photos` - Images (JPG, PNG, WebP)
- `memorial-videos` - Videos (MP4, WebM) - max 100MB
- `memorial-audio` - Audio (MP3, WAV) - max 10MB

**Components:**
- `<FileUploader>` - Drag-and-drop
- `<UploadProgress>` - Progress bar with cancel
- `<MediaPreview>` - Show uploaded files

### Priority 4: Additional Pages

#### Features Page (`/features`)
- Detailed feature descriptions
- Screenshots/mockups
- Benefits

#### How It Works (`/how-it-works`)
- 5-step process with icons
- Visual guide

#### Examples Page (`/examples`)
- Grid of sample memorials
- Link to demo memorial(s)

#### Support Pages
- `/support` - Help center
- `/help` - FAQ
- `/contact` - Contact form
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/404` - Custom not found page

### Priority 5: Email Notifications

**Using Resend:**
1. Welcome email (on signup)
2. Memorial published (after publishing)
3. New tribute received (when someone leaves a message)
4. Payment receipt (after successful payment)
5. Password reset

**Email Templates:**
- Create React Email templates
- Consistent branding
- Clear CTAs
- Plain text alternatives

---

## 🛠️ Development Workflow

### Working on a New Feature

1. **Create a new branch**
   ```bash
   git checkout -b feature/memorial-wizard
   ```

2. **Build the feature**
   - Create components in `src/components/`
   - Create pages in `src/app/`
   - Update types if needed

3. **Test locally**
   ```bash
   npm run dev
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add memorial creation wizard"
   git push origin feature/memorial-wizard
   ```

### File Organization

```
src/
├── app/
│   ├── memorial/
│   │   ├── create/
│   │   │   ├── page.tsx           # Main wizard container
│   │   │   └── _components/        # Step components
│   │   │       ├── ProfileStep.tsx
│   │   │       ├── ObituaryStep.tsx
│   │   │       └── ...
│   │   └── [slug]/
│   │       ├── page.tsx           # Public memorial
│   │       └── _components/
│   │           ├── MemorialHero.tsx
│   │           ├── GallerySection.tsx
│   │           └── ...
│   └── ...
├── components/
│   ├── ui/                        # Generic UI components
│   ├── site/                      # Layout components
│   └── memorial/                  # Memorial-specific components
│       ├── WizardStepper.tsx
│       ├── ImageUploader.tsx
│       └── ...
└── lib/
    ├── supabase/
    ├── utils/
    └── hooks/                     # Custom React hooks
```

### Best Practices

1. **Component Structure:**
   - Keep components small and focused
   - Use TypeScript for type safety
   - Extract reusable logic into custom hooks

2. **State Management:**
   - Use Zustand for complex global state
   - Use React Hook Form for forms
   - Validate with Zod schemas

3. **Supabase Queries:**
   - Use `.select()` to fetch only needed data
   - Leverage RLS - don't bypass it
   - Handle errors gracefully

4. **Styling:**
   - Use Tailwind utility classes
   - Follow design tokens in `globals.css`
   - Use responsive classes (`md:`, `lg:`)

5. **Testing:**
   - Test all user flows
   - Check mobile responsiveness
   - Verify RLS policies work

---

## 🚀 Quick Start for Next Features

### 1. Memorial Creation Wizard

```bash
# Create the files
mkdir -p src/app/memorial/create/_components
touch src/app/memorial/create/page.tsx
touch src/app/memorial/create/_components/ProfileStep.tsx
touch src/app/memorial/create/_components/ObituaryStep.tsx
# ... etc for all 8 steps
```

**Start with:**
```tsx
// src/app/memorial/create/page.tsx
"use client";

import { useState } from "react";
import ProfileStep from "./_components/ProfileStep";
import ObituaryStep from "./_components/ObituaryStep";
// ... import other steps

export default function CreateMemorialPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [memorialData, setMemorialData] = useState({});

  // Wizard logic here
}
```

### 2. Public Memorial Page

```bash
mkdir -p src/app/memorial/[slug]/_components
touch src/app/memorial/[slug]/page.tsx
touch src/app/memorial/[slug]/_components/MemorialHero.tsx
# ... etc
```

**Fetch memorial data:**
```tsx
// src/app/memorial/[slug]/page.tsx
export default async function MemorialPage({ params }: { params: { slug: string } }) {
  const { data: memorial } = await supabase
    .from("memorials")
    .select("*, gallery_items(*), timeline_events(*), tributes(*)")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!memorial) notFound();

  return <MemorialLayout memorial={memorial} />;
}
```

---

## 📚 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com/
- **React Hook Form**: https://react-hook-form.com/
- **Zod**: https://zod.dev/

---

Happy coding! 🎨🚀
