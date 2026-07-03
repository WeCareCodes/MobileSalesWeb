# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Taiwan mobile phone e-commerce browsing website. Lists all phones available in the Taiwan market with specs, pricing, and reviews. Deployed on Vercel (frontend) + Neon (PostgreSQL database).

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Database**: Neon PostgreSQL via `@neondatabase/serverless`
- **ORM**: Drizzle ORM
- **Deployment**: Vercel + Neon

## Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push schema changes to Neon (drizzle-kit push)
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed database with mock Taiwan phone data
```

## Architecture

### App Router Structure

```
app/
├── page.tsx                    # Homepage – top 20 popular phones this month
├── brands/[brand]/page.tsx     # All phones for a specific brand
├── phones/[id]/page.tsx        # Phone detail: specs, pricing, reviews
└── layout.tsx                  # Root layout with Navbar
```

### Key Files

- `lib/db.ts` – Neon database connection (uses `DATABASE_URL` from env)
- `lib/schema.ts` – Drizzle schema: `phones` table + `brands` enum
- `lib/queries.ts` – Server-side data access functions
- `components/Navbar.tsx` – Top navigation with brand tabs
- `scripts/seed.ts` – Seed script for mock phone data

### Database Schema

`phones` table stores: brand, name, image_url, price_official, price_site, specs (JSONB), popularity_rank, youtube_review_url, external_reviews (JSONB array).

### Environment Variables

Required in `.env.local`:
```
DATABASE_URL=         # Neon connection string (pooled)
DATABASE_URL_UNPOOLED= # For migrations/drizzle-kit
```

## Website Spec

- **Homepage**: Top 20 phones ranked by popularity this month; click → detail page
- **Navbar**: Brand tabs (Apple, Samsung, ASUS ROG, Sony, Google, Xiaomi, OPPO, vivo, Motorola, Nokia, OnePlus, Nothing)
- **Brand page**: All phones for that brand, grid layout
- **Detail page**: Full specs (size/weight, CPU/RAM/storage, display resolution, camera), MSRP, site price, embedded YouTube reviews

## Data Sources (reference only)

- 手機王: https://www.sogi.com.tw
- 傑昇通訊: https://www.jyes.com.tw
