# CollegeDiscovery Platform

A full-stack college discovery platform built with Next.js 14, TypeScript, TailwindCSS, Prisma, PostgreSQL (Neon), and NextAuth.js.

## Features

- Browse 27+ Indian colleges (IITs, NITs, BITS, DU, Mumbai University, etc.)
- Search and filter by city, fees, rating
- College detail pages with courses, placements, and reviews
- Compare up to 3 colleges side-by-side
- Save colleges to dashboard (authenticated)
- Export saved colleges to CSV
- Multi-auth: Email/Password, Google, GitHub
- Toast notifications for save, compare, and export actions

## Getting Started

### 1. Clone and install

```bash
cd college-discovery
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```env
DATABASE_URL="postgresql://user:password@host.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
```

Generate `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Database setup

```bash
npx prisma db push
npx prisma db seed
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel + Neon)

1. Create a [Neon](https://neon.tech) PostgreSQL database
2. Add environment variables in Vercel project settings
3. Deploy — `vercel.json` runs `prisma generate && prisma db push && next build`
4. Run seed once: `npx prisma db seed` (via Vercel CLI or local with production DATABASE_URL)

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/colleges` | List colleges with filters & pagination |
| GET | `/api/colleges/[id]` | College detail with reviews |
| POST | `/api/compare` | Compare up to 3 colleges |
| GET/POST/DELETE | `/api/saved` | Manage saved colleges |
| GET | `/api/saved/export` | Export saved colleges as CSV |
| POST | `/api/notifications` | Create notification |
| GET | `/api/notifications/unread` | Unread notification count |
| POST | `/api/register` | Email registration |
| POST | `/api/reviews` | Submit college review |

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **ORM:** Prisma 5
- **Database:** PostgreSQL (Neon)
- **Auth:** NextAuth.js v4

## Project Structure

```
src/
├── app/           # Pages and API routes
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Auth, Prisma, utilities
└── types/         # TypeScript types
prisma/
├── schema.prisma  # Database schema
└── seed.ts        # Seed data (27 colleges)
```
