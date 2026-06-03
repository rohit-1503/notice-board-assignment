# Notice Board

A full-stack notice board application built with Next.js (Pages Router), Prisma ORM, TiDB Cloud, and Tailwind CSS.

## Tech Stack
- **Frontend**: Next.js 14 (Pages Router), Tailwind CSS
- **ORM**: Prisma
- **Database**: TiDB Cloud (MySQL-compatible)
- **Deployment**: Vercel

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy .env.example to .env.local and fill in your TiDB Cloud credentials
cp .env.example .env.local

# 3. Generate Prisma client
npm run db:generate

# 4. Push schema to TiDB Cloud
npm run db:push

# 5. Run development server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | TiDB Cloud MySQL connection string |

## Project Structure
```
notice-board/
├── pages/
│   ├── index.js               # Notice listing
│   ├── notices/
│   │   ├── create.js          # Create notice
│   │   └── edit/[id].js       # Edit notice
│   └── api/notices/
│       ├── index.js           # GET all / POST
│       └── [id].js            # GET one / PUT / DELETE
├── components/
│   ├── NoticeCard.js
│   └── NoticeForm.js
├── lib/prisma.js
└── prisma/schema.prisma
```
