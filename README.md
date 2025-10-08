# SoulBridge - Digital Memorial Platform

**Celebrate Life. Cherish Memories.**

SoulBridge is a comprehensive digital memorial platform that allows users to create beautiful, lasting tributes to honor and celebrate the lives of their loved ones.

## 🌟 Features

### Core Features
- **Digital Memorials**: Create personalized memorial pages with photos, videos, and stories
- **Life Timeline**: Chronicle important milestones and memories
- **Photo & Video Gallery**: Unlimited uploads for paid plans
- **Background Audio**: Add meaningful music to memorial pages
- **Digital Guestbook**: Friends and family can share tributes and condolences
- **QR Code Sharing**: Easy sharing at services and gatherings
- **Privacy Controls**: Public, private, or unlisted memorials
- **Social Sharing**: Share via WhatsApp, Facebook, X (Twitter), and email

### Subscription Plans
- **Free**: 1 memorial, 10 uploads, basic features
- **Essential**: R49/month - 1 memorial, unlimited uploads
- **Family**: R99/month - 3 memorials, all features
- **Lifetime**: R999 one-time - Unlimited memorials, lifetime access

### Payment Integration
- **Netcash Payment Gateway**: Secure payment processing for South African market
- Supports monthly, annual, and one-time (lifetime) payments

## 🎨 Design System

### Brand Colors
- **Primary (Delft Blue)**: `#2E3C5A` - Brand identity, headers
- **Secondary (Gray)**: `#738180` - Secondary elements
- **Accent (Cambridge Blue)**: `#96B496` - CTA buttons, highlights
- **Background**: `#F9F9F7` - Warm off-white canvas
- **Foreground**: `#000000` - Text

### Typography
- **Headings**: Playfair Display (serif, elegant)
- **Body/UI**: Inter (sans-serif, modern)

### Component Library
Built with Radix UI and Tailwind CSS:
- Buttons (primary, secondary, accent, outline, ghost)
- Inputs, textareas, labels
- Cards, badges, modals
- Tabs, dialogs, dropdowns
- Custom floating audio player

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animations
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide Icons** - Icon library

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Authentication (email/password, Google OAuth)
  - Storage for media files
- **Netcash** - Payment gateway integration

### State Management
- **Zustand** - Lightweight state management
- **React Hot Toast** - Notifications

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Netcash merchant account (for payments)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd soulbridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your credentials:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   # Netcash
   NEXT_PUBLIC_NETCASH_SERVICE_KEY=your-service-key
   NETCASH_SECRET_KEY=your-secret-key

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=SoulBridge

   # Email (optional)
   RESEND_API_KEY=your-resend-api-key
   ```

4. **Set up Supabase database**

   a. Create a new Supabase project at [supabase.com](https://supabase.com)

   b. Run the SQL schema in the Supabase SQL Editor:
   ```bash
   # Copy contents of supabase/schema.sql
   # Paste into Supabase SQL Editor and run
   ```

   c. Enable authentication providers:
   - Go to Authentication > Providers
   - Enable Email/Password
   - Enable Google OAuth (optional)

   d. Set up Storage buckets:
   - Create bucket: `memorial-photos` (public)
   - Create bucket: `memorial-videos` (public)
   - Create bucket: `memorial-audio` (public)

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
soulbridge/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx             # Homepage
│   │   ├── pricing/             # Pricing page
│   │   ├── sign-in/             # Authentication
│   │   ├── sign-up/
│   │   ├── dashboard/           # User dashboard
│   │   ├── memorial/
│   │   │   ├── create/          # Memorial creation wizard (TODO)
│   │   │   └── [slug]/          # Public memorial pages (TODO)
│   │   ├── checkout/            # Payment checkout (TODO)
│   │   └── auth/callback/       # OAuth callback
│   │
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── label.tsx
│   │   │
│   │   └── site/                # Layout components
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       └── FloatingAudioPlayer.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Supabase client
│   │   │   └── database.types.ts # TypeScript types
│   │   └── utils.ts             # Utility functions
│   │
│   └── app/
│       ├── globals.css          # Global styles & design tokens
│       └── layout.tsx           # Root layout with fonts
│
├── supabase/
│   └── schema.sql               # Complete database schema
│
├── public/                      # Static assets
├── .env.local.example           # Environment variables template
├── tailwind.config.js           # Tailwind configuration
├── next.config.ts               # Next.js configuration
└── package.json
```

## 🗄️ Database Schema

### Core Tables

**profiles** - User profile and subscription data
**memorials** - Memorial details, privacy, and settings
**gallery_items** - Photos, videos, and audio files
**timeline_events** - Life milestones
**tributes** - Guestbook entries
**relationships** - Family relationships
**plans** - Subscription plan definitions
**payments** - Payment history and Netcash references

See `supabase/schema.sql` for the complete schema with Row Level Security policies.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Set up your Supabase project and update .env.local

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📝 Current Status & Roadmap

### ✅ Completed
- [x] Design system with SoulBridge branding
- [x] Component library (buttons, inputs, cards, modals, etc.)
- [x] Responsive navbar and footer
- [x] Homepage with hero, features, testimonials
- [x] Pricing page with plan toggle
- [x] Authentication (sign-in, sign-up, Google OAuth)
- [x] Dashboard with memorial management
- [x] Database schema with RLS policies
- [x] Supabase integration
- [x] Floating audio player component

### 🚧 In Progress / TODO
- [ ] 8-step memorial creation wizard
- [ ] Public memorial pages (/memorial/[slug])
- [ ] File upload functionality (images, videos, audio)
- [ ] Sharing system (QR codes, social media, OG metadata)
- [ ] Netcash payment integration
- [ ] Email notification system
- [ ] Search functionality
- [ ] Features, How It Works, Examples pages
- [ ] 404 and error pages

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication via Supabase
- Secure password hashing
- HTTPS required in production
- Environment variables for sensitive data

## 📧 Support

- Email: support@soulbridge.co.za
- Issues: [GitHub Issues]

## 📄 License

All rights reserved © 2025 SoulBridge

---

**Made with ❤️ for families across South Africa**
