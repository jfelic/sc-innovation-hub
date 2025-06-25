# SC Innovation Hub

A digital platform that connects South Carolina's tech, AI, cyber, and innovation ecosystems in one centralized location. This project addresses the challenge of fragmented innovation communities by providing unified access to companies, events, and opportunities across the state.

## 🌟 Features

### ✅ Currently Implemented
- **Business Directory**: Fully functional searchable database with 20+ SC innovation companies
  - Advanced search across company names, descriptions, industries, and locations
  - Industry-based filtering (multi-select checkboxes)
  - City-based filtering with Charleston area focus
  - Responsive card layout with expandable descriptions
  - Pagination (20 companies per page)
  - Direct links to company websites
  
- **User Authentication**: Complete auth system with NextAuth.js
  - Google OAuth integration
  - Email/password registration and login
  - Secure password hashing with bcryptjs
  - Custom registration and signin pages
  
- **Automated Data Extraction**: Production-ready scraping system
  - Company data from builtin.com, goodfirms.co, and biopharmguy.com
  - Event data from Meetup, CyberSC, and AllEvents
  - Firecrawl API integration with structured data extraction
  - Zod schema validation for data quality
  - Source tracking for data provenance

### 🚧 Planned Features
- **Event Discovery**: Backend models ready, frontend implementation pending
- **User Bookmarking**: Database schema complete, UI components needed
- **Regional Filtering**: Mount Pleasant vs statewide toggle
- **News Aggregation**: Content scraping infrastructure in place

### Technical Stack
- **Next.js 15** with App Router and TypeScript
- **PostgreSQL** database with Prisma ORM (7 migrations)
- **NextAuth.js** for authentication with session management
- **shadcn/ui** + Radix UI components for accessibility
- **Tailwind CSS** for responsive design
- **Lucide React** for icons
- **Firecrawl API** for automated content scraping
- **Zod** for runtime type validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jfelic/sc-innovation-hub.git
   cd sc-innovation-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database and authentication credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/sc_innovation_hub"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-generated-secret"
   GOOGLE_CLIENT_ID="your-google-oauth-client-id"
   GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
   FIRECRAWL_API_KEY="your-firecrawl-api-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
sc-innovation-hub/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/   # NextAuth.js API routes
│   │   │   ├── extract/             # Data extraction endpoints
│   │   │   │   ├── companies/       # Company scraping API
│   │   │   │   └── events/          # Event scraping API
│   │   │   └── scrape/companies/    # Legacy scraping endpoint
│   │   ├── auth/
│   │   │   ├── register/            # User registration page
│   │   │   └── signin/              # User login page
│   │   ├── layout.tsx               # Root application layout
│   │   ├── page.tsx                 # Homepage with business directory
│   │   └── providers.tsx            # Session provider wrapper
│   ├── components/
│   │   ├── BusinessCard.tsx         # Individual company card component
│   │   ├── BusinessDirectory.tsx    # Server component for data fetching
│   │   ├── BusinessDirectoryClient.tsx # Client component with filters/search
│   │   ├── Hero.tsx                 # Homepage hero section with search
│   │   ├── Navbar.tsx              # Main navigation
│   │   └── ui/                     # shadcn/ui components
│   ├── lib/
│   │   ├── auth.ts                 # NextAuth configuration
│   │   ├── db.ts                   # Prisma client instance
│   │   ├── firecrawl_extract.ts    # Company data extraction logic
│   │   ├── firecrawl_extract_events.ts # Event data extraction logic
│   │   └── utils.ts                # Utility functions
│   ├── types/
│   │   └── next-auth.d.ts          # NextAuth type extensions
│   └── generated/
│       └── prisma/                 # Prisma generated client
├── prisma/
│   ├── schema.prisma              # Database schema (7 migrations)
│   └── migrations/                # Database migration history
└── public/                        # Static assets (logo, hero image)
```

## 🗄️ Database Schema

The platform uses PostgreSQL with comprehensive models for users, companies, and events:

### Authentication Models (NextAuth.js)
- **User**: Core user accounts with email, password, firstName, lastName
- **Account**: OAuth account information (Google, etc.)
- **Session**: User login sessions with expiration tracking
- **VerificationToken**: Email verification and password reset tokens

### Business Models
- **Company**: Innovation businesses with:
  - Basic info (name, description, website, industry array)
  - Location data (address, city, state with SC defaults)
  - Metadata (size, founded year, logo URL)
  - Source tracking (sourceUrl, sourceType for data provenance)
  - Unique constraint on company name

- **Event**: Tech events with:
  - Event details (title, description, start/end dates)
  - Location info (venue, address, city, state, virtual flag)
  - Categorization (industry array, organizer info)
  - Source tracking for scraped data

### User Features
- **EventBookmark**: User-saved events for later reference
- **CompanyBookmark**: User-saved companies for tracking

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Operations
- `npx prisma studio` - Open database GUI
- `npx prisma migrate dev` - Apply migrations
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database

### Data Extraction
- `/api/extract/companies` - Scrape company data from configured sources
- `/api/extract/events` - Scrape event data from configured sources

### Current Data Sources
- **Companies**: builtin.com, goodfirms.co, biopharmguy.com
- **Events**: Meetup, CyberSC, AllEvents

## 🤝 Contributing

This project is part of a month-long hackathon addressing South Carolina's innovation ecosystem challenges. Contributions are welcome!

## 📄 License

This project is private and proprietary.

## 🎯 Current Status

**MVP Status**: ✅ **Functional Business Directory**
- 20+ South Carolina innovation companies catalogued
- Full-text search and filtering capabilities
- Responsive design optimized for all devices
- Automated data extraction from multiple sources
- User authentication system ready for expansion

**Next Priorities**:
1. Event directory frontend implementation
2. User bookmarking interface
3. Regional filtering (Mount Pleasant focus)
4. News aggregation display

---

Built with ❤️ for South Carolina's innovation community

## 🚀 Deployment

The application is built with Vercel deployment in mind:

```bash
npm run build    # Verify production build
vercel           # Deploy to Vercel
```

Ensure environment variables are configured in your deployment platform.
