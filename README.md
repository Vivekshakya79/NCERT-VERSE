# StudyVerse — CBSE Classes 6-12 Educational Platform

A modern, production-grade Next.js application for CBSE students. Access NCERT solutions, study materials, MCQs, AI-powered tools, and more.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (Strict)
- **Styling:** Tailwind CSS + CSS Custom Properties
- **Database:** PostgreSQL + Prisma ORM
- **Fonts:** Inter, Poppins (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (optional for development)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL

# Run database migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   ├── not-found.tsx       # 404 page
│   ├── classes/            # Classes pages
│   ├── ncert/              # NCERT pages
│   ├── ai/                 # AI tools page
│   ├── quiz/               # Quiz page
│   ├── dashboard/          # Dashboard page
│   ├── admin/              # Admin panel
│   └── api/                # API routes
├── components/
│   ├── layout/             # Layout components
│   ├── ui/                 # Reusable UI components
│   ├── cards/              # Card components
│   └── features/           # Feature components
├── contexts/               # React contexts
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── data/                   # Static data
└── types/                  # TypeScript types
prisma/
├── schema.prisma           # Database schema
└── seed.js                 # Database seed script
```

## Features

- 📚 CBSE Classes 6-12 with complete subject coverage
- 📖 NCERT solutions with chapter-wise organization
- 🤖 AI-powered study tools
- 🏆 Quiz center with MCQs
- 📊 Personal dashboard with progress tracking
- ⚙️ Admin panel for content management
- 🌙 Dark mode support
- ⌨️ Keyboard shortcuts
- 🔖 Bookmarks and recent history
- 📱 Fully responsive design
- ⚡ Optimized with Turbopack

## Scripts

- `npm run dev` — Start development server (Turbopack)
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npm run db:generate` — Generate Prisma client
- `npm run db:push` — Push schema to database
- `npm run db:migrate` — Run database migrations
- `npm run db:studio` — Open Prisma Studio
- `npm run db:seed` — Seed database

## Deployment (Vercel)

The project is deployed on Vercel. Environment variables are **never committed**
to git — `.env` is gitignored — so every environment (local, Vercel) must be
configured separately.

### Required environment variables

| Variable | Description | Required |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (Prisma) | Yes (for DB features) |
| `DEEPSEEK_API_KEY` | OpenRouter API key for the AI Doubt Solver | Yes (for AI) |
| `DEEPSEEK_MODEL` | OpenRouter model slug (defaults to `google/gemma-4-26b-a4b-it:free`) | No |
| `NEXT_PUBLIC_APP_URL` | Public app URL | No |

### Setting variables on Vercel

1. Open the project in the [Vercel Dashboard](https://vercel.com/dashboard).
2. Go to **Settings → Environment Variables**.
3. Add each key with its value, and tick the environments
   (**Production**, **Preview**, **Development**).
4. Click **Save**, then **Deployments → Redeploy** so the new variables take
   effect.

> ⚠️ **AI Doubt Solver:** if `DEEPSEEK_API_KEY` is missing on Vercel, the live
> site shows `"AI service is not configured. Please set DEEPSEEK_API_KEY."`
> (HTTP 503). The app works locally because `.env` holds the key — the same
> value must be added to Vercel. Free-tier OpenRouter keys can only use
> `:free` model slugs.

### Using the Vercel CLI instead

```bash
npm i -g vercel
vercel login
vercel link
vercel env add DEEPSEEK_API_KEY production preview development
vercel env add DATABASE_URL production preview development
vercel --prod
```

## License

Private project. All rights reserved.
