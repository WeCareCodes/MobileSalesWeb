# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Taiwan mobile phone e-commerce browsing website. Lists all phones available in the Taiwan market with specs, pricing, and reviews. Deployed on Vercel (frontend) + Neon (PostgreSQL database).

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Database**: Neon PostgreSQL via `@neondatabase/serverless`
- **ORM**: Drizzle ORM
- **Auth**: Neon Auth (`@neondatabase/auth@0.4.2-beta` + `@neondatabase/auth-ui@0.2.1-beta`)
- **Testing**: Vitest + Testing Library + jsdom
- **Deployment**: Vercel + Neon

## Development Commands

```bash
npm run dev              # Start development server (localhost:3000)
npm run build            # Production build
npm run lint             # ESLint
npm run db:push          # Push schema changes to Neon (drizzle-kit push)
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed database with mock Taiwan phone data
npm run scrape           # Run Playwright scraper against sogi.com.tw
npm run db:seed:scrape   # Import scraped JSON into Neon database
npm run test             # Run Vitest tests once
npm run test:watch       # Run Vitest in watch mode
```

## Architecture

### App Router Structure

```
app/
├── layout.tsx                    # Root layout: wraps body in <Providers> (NeonAuthUIProvider)
├── providers.tsx                 # Client provider: NeonAuthUIProvider + router bridge
├── page.tsx                      # Homepage – top 20 popular phones this month
├── brands/[brand]/page.tsx       # All phones for a specific brand, grid layout
├── phones/[id]/page.tsx          # Phone detail: specs, pricing, embedded YouTube reviews
├── auth/
│   ├── sign-in/page.tsx          # SignInForm from @neondatabase/auth-ui
│   └── sign-up/page.tsx          # SignUpForm from @neondatabase/auth-ui
├── api/auth/[...path]/route.ts   # Neon Auth API handler (GET + POST)
└── actions/auth.ts               # Server actions: signIn, signUp, signOut
```

### Key Files

- `lib/db.ts` – Neon database connection (uses `DATABASE_URL` from env)
- `lib/schema.ts` – Drizzle schema: `phones` table + `brands` enum
- `lib/queries.ts` – Server-side data access functions
- `lib/brands.ts` – Brand list + `brandSlug()` helper
- `lib/auth/server.ts` – `createNeonAuth()` server instance
- `lib/auth/client.ts` – `createAuthClient()` for client components
- `components/Navbar.tsx` – Top navigation with brand tabs + `SignedIn`/`SignedOut`/`UserButton`
- `middleware.ts` – Auth middleware protecting `/account/*` and `/favorites/*`
- `scripts/scraper.ts` – Playwright scraper for sogi.com.tw phone specs
- `scripts/seed-from-scrape.ts` – Transforms scraped JSON and upserts into Neon

### Database Schema

`phones` table stores: brand, name, image_url, price_official, price_site, specs (JSONB), popularity_rank, youtube_review_url, external_reviews (JSONB array).

### Auth Architecture

- **Server**: `lib/auth/server.ts` exports `auth` (used in API route and middleware)
- **Client**: `lib/auth/client.ts` exports `authClient` (used in `providers.tsx`)
- **Provider**: `app/providers.tsx` wraps the app with `NeonAuthUIProvider`; `app/layout.tsx` imports it
- **UI components** from `@neondatabase/auth-ui`: `SignInForm`, `SignUpForm`, `UserButton`, `SignedIn`, `SignedOut`, `authLocalization`
- **Protected routes** (via `middleware.ts` matcher): `/account/*`, `/favorites/*` — all browsing pages are public
- CSS must be imported in layout: `import "@neondatabase/auth-ui/css"`

### Environment Variables

Required in `.env.local`:
```
DATABASE_URL=              # Neon connection string (pooled)
DATABASE_URL_UNPOOLED=     # For migrations/drizzle-kit
NEON_AUTH_BASE_URL=        # From Neon Console → Auth tab
NEON_AUTH_COOKIE_SECRET=   # Generate: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Data Pipeline

1. `npm run scrape` — Playwright scrapes sogi.com.tw for each brand's phone list, then visits each phone's spec page. Saves to `scripts/scraped-phones.json`.
2. `npm run db:seed:scrape` — Reads `scraped-phones.json`, transforms specs (Chinese field names → typed spec object), upserts into `phones` table.

Key scraper behaviors:
- Uses `waitUntil: "domcontentloaded"` + 3s delay (sogi ads prevent `networkidle`)
- Product images selected via `img[src*="tw/product/img/"]` (avoids article cover images)
- Prices extracted from `document.body.innerText` matching `原廠售價` / `本站售價` patterns
- sogi spec field names are Chinese: `機身長度/寬度/厚度`, `機身顏色`, `前相機`, `電池容量`, etc.

## Website Spec

- **Homepage**: Top 20 phones ranked by popularity this month; click → detail page
- **Navbar**: Brand tabs (Apple, Samsung, ASUS ROG, Sony, Google, Xiaomi, OPPO, vivo, Motorola, Nokia, OnePlus, Nothing) + auth buttons
- **Brand page**: All phones for that brand, grid layout
- **Detail page**: Full specs (size/weight, CPU/RAM/storage, display resolution, camera), MSRP, site price, embedded YouTube reviews

## Data Sources (reference only)

- 手機王: https://www.sogi.com.tw
- 傑昇通訊: https://www.jyes.com.tw
