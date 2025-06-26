# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Commands
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production (validates TypeScript and builds Next.js)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint on the codebase

### Database Commands
- `npx prisma studio` - Open Prisma Studio GUI for database inspection
- `npx prisma migrate dev` - Apply pending migrations and regenerate client
- `npx prisma generate` - Regenerate Prisma client after schema changes
- `npx prisma db push` - Push schema changes to database without migrations

### Data Extraction
- GET `/api/extract/companies` - Scrape company data from configured sources
- GET `/api/extract/events` - Scrape event data from configured sources

## Architecture Overview

### Tech Stack
- **Next.js 15** with App Router and TypeScript
- **PostgreSQL** with Prisma ORM (custom output to `src/generated/prisma`)
- **NextAuth.js** with Google OAuth and credentials authentication
- **shadcn/ui + Radix UI** for accessible components
- **Tailwind CSS** for styling
- **Firecrawl API** for automated web scraping

### Application Structure

**Authentication Flow**:
- NextAuth.js configured in `src/lib/auth.ts` with dual providers (Google OAuth + email/password)
- Custom pages at `/auth/signin` and `/auth/register`
- JWT session strategy with user ID and name in session
- Password hashing with bcryptjs

**Database Architecture**:
- User authentication models (User, Account, Session, VerificationToken)
- Business models (Company, Event) with source tracking
- Bookmark system (EventBookmark, CompanyBookmark) for user saves
- Companies have unique name constraint and default to Charleston, SC
- Events support virtual/in-person with industry categorization

**Component Architecture**:
- Server Components: `BusinessDirectory` (data fetching)
- Client Components: `BusinessDirectoryClient` (filters, search, pagination)
- Reusable UI components in `components/ui/` following shadcn/ui patterns
- `Navbar` with authentication state and dropdown menu

**Data Flow**:
1. Homepage (`src/app/page.tsx`) renders Hero + BusinessDirectory
2. BusinessDirectory server component fetches data from Prisma
3. BusinessDirectoryClient handles client-side filtering and search
4. Individual BusinessCard components display company information

### Key Implementation Details

**Prisma Configuration**:
- Custom client output to `src/generated/prisma` (not default node_modules)
- Always import prisma client from `@/lib/db.ts`
- Schema uses array fields for industries and comprehensive source tracking

**Authentication Patterns**:
- Session management via NextAuth with JWT strategy
- Protected routes use session checking patterns
- User registration hashes passwords before database storage

**Data Scraping System**:
- Firecrawl API integration with structured extraction
- Zod schema validation for scraped data quality
- Source URL and type tracking for data provenance
- Current sources: builtin.com, goodfirms.co, biopharmguy.com (companies), Meetup/CyberSC/AllEvents (events)

## Development Notes

**Next.js 15 Specifics**:
- `searchParams` must be awaited in page components
- App Router patterns throughout
- Server/Client component separation clearly defined

**Database Considerations**:
- Run `npx prisma generate` after any schema changes
- Migrations are tracked in `prisma/migrations/`
- Company names have unique constraints
- Default locations set to Charleston/South Carolina

**Environment Requirements**:
- DATABASE_URL for PostgreSQL connection
- NEXTAUTH_URL and NEXTAUTH_SECRET for authentication
- GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET for OAuth
- FIRECRAWL_API_KEY for web scraping functionality