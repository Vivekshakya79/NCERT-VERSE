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

## License

Private project. All rights reserved.
