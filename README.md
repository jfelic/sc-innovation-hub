# SC Innovation Hub

## Table of Contents

1. [Description](#description)
2. [Installation and Setup](#installation-and-setup)
3. [How to Use](#how-to-use)
4. [Technical Architecture](#technical-architecture)
5. [Development](#development)
6. [Credits](#credits)

## Description

SC Innovation Hub is a comprehensive digital platform that unifies South Carolina's fragmented tech, AI, cybersecurity, and innovation ecosystems into one centralized location. 

**What the application does:**
- Provides a searchable directory of South Carolina's innovation companies with filtering by industry and location
- Automated data extraction from multiple sources to maintain up-to-date company and event information
- Enables user authentication with both Google OAuth and traditional email/password registration
- Implements a bookmark system for users to save companies and events for future reference

**Tech stack and why we chose these technologies:**
- **Next.js 15** with App Router for optimal performance with server-side rendering and client-side interactivity
- **PostgreSQL with Prisma ORM** for robust data modeling and type-safe database operations
- **NextAuth.js** for uh... *checks notes* Authentication 👍
- **shadcn/ui + Tailwind CSS** for accessible, responsive design that works across all devices
- **Firecrawl API** for reliable, structured web scraping that maintains data quality

**Challenges faced and future features:**
We tackled the complex challenge of aggregating data from multiple disparate sources while maintaining data quality and avoiding duplicates. The current system successfully scrapes and validates company data from builtin.com, goodfirms.co, and biopharmguy.com. Future implementations will expand the event discovery system, enhance the user bookmarking interface, and add regional filtering capabilities to focus on specific areas like Mount Pleasant vs. statewide coverage.

## Installation and Setup

Follow these step-by-step instructions to get the SC Innovation Hub running locally on your machine.

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js 18 or higher** - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL database** - [Download from postgresql.org](https://www.postgresql.org/download/)
- **Git** - [Download from git-scm.com](https://git-scm.com/)

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jfelic/sc-innovation-hub.git
   cd sc-innovation-hub
   ```

2. **Install project dependencies**
   ```bash
   npm install
   ```
   This will install all required packages including Next.js, Prisma, NextAuth.js, and UI components.

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Open the `.env` file and configure with your credentials:
   ```env
   # Database connection string
   DATABASE_URL="postgresql://username:password@localhost:5432/sc_innovation_hub"
   
   # NextAuth.js configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-generated-secret-key-here"
   
   # Google OAuth (optional, for Google sign-in)
   GOOGLE_CLIENT_ID="your-google-oauth-client-id"
   GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
   
   # Firecrawl API (optional, for data scraping)
   FIRECRAWL_API_KEY="your-firecrawl-api-key"
   ```

4. **Initialize the database**
   ```bash
   # Apply database migrations
   npx prisma migrate dev --name init
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

### Verification

If everything is set up correctly, you should see:
- The SC Innovation Hub homepage with a hero section
- A business directory (may be empty initially)
- Navigation bar with sign-in options
- No console errors in your browser's developer tools

## How to Use

Once you have the application running, here's how to navigate and use the SC Innovation Hub:

### For Visitors (No Account Required)

**Browse Companies:**
1. Visit the homepage to see the business directory
2. Use the search bar to find companies by name, description, or keywords
3. Apply filters by industry (Technology, AI, Cybersecurity, etc.)
4. Filter by city/location (Charleston, Mount Pleasant, etc.)
5. Click on company cards to expand descriptions and visit websites

**Search Features:**
- **Global search**: Use the hero section search bar to find companies across all fields
- **Advanced filtering**: Use the sidebar filters to narrow results by industry and location
- **Pagination**: Navigate through multiple pages of results (20 companies per page)

### For Registered Users

**Create an Account:**
1. Click "Sign In" in the navigation bar
2. Choose "Register" to create a new account
3. Sign up with Google OAuth or email/password
4. Complete your profile with first and last name

**User Features (Coming Soon):**
- **Bookmark Companies**: Save interesting companies for later reference
- **Bookmark Events**: Save upcoming events you want to attend
- **Personal Dashboard**: View your saved companies and events

### Screenshots and Examples

**Homepage View:**
The homepage features a hero section with search functionality and the main business directory below.

**Company Cards:**
Each company displays:
- Company name and description
- Industry tags
- Location (city, state)
- Website link
- Founded year and company size (when available)

**Search and Filter:**
- Type in the search bar to filter companies in real-time
- Use industry checkboxes to focus on specific sectors
- City dropdown helps narrow results by location

### For Developers and Contributors

**Add New Companies:**
Use the data extraction API endpoints:
```bash
# Extract company data from configured sources
GET /api/extract/companies

# Extract event data from configured sources  
GET /api/extract/events
```

**Database Management:**
```bash
# View database in GUI
npx prisma studio

# Apply schema changes
npx prisma db push
```

## Technical Architecture

### Technology Stack

**Frontend Framework:**
- **Next.js 15** with App Router and TypeScript for optimal performance
- **React 19** for modern component architecture
- **Tailwind CSS** for utility-first styling
- **shadcn/ui + Radix UI** for accessible, pre-built components
- **Lucide React** for consistent iconography

**Backend & Database:**
- **PostgreSQL** for robust relational data storage
- **Prisma ORM** with custom output location for type-safe database operations
- **NextAuth.js** for authentication with JWT session strategy
- **bcryptjs** for secure password hashing

**Data & APIs:**
- **Firecrawl API** for reliable web scraping and data extraction
- **Zod** for runtime type validation and schema enforcement
- RESTful API routes for data extraction and user management

### Project Structure

```
sc-innovation-hub/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API routes
│   │   ├── auth/                  # Authentication pages
│   │   ├── events/                # Events pages
│   │   └── saved-*/               # User bookmark pages
│   ├── components/                # React components
│   │   ├── ui/                    # shadcn/ui components
│   │   └── *.tsx                  # Custom components
│   ├── lib/                       # Utility libraries
│   ├── types/                     # TypeScript definitions
│   └── generated/prisma/          # Generated Prisma client
├── prisma/                        # Database schema and migrations
└── public/                        # Static assets
```

### Database Models

**Authentication (NextAuth.js):**
- User, Account, Session, VerificationToken

**Business Data:**
- **Company**: Innovation businesses with industry arrays, location data, source tracking
- **Event**: Tech events with categorization and organizer info
- **Bookmarks**: User-saved companies and events with relationship tables

### Development Workflow

**Available Scripts:**
```bash
npm run dev      # Start development server
npm run build    # Build for production  
npm run start    # Start production server
npm run lint     # Run ESLint
```

**Database Operations:**
```bash
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Apply migrations
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema changes
```

**Data Sources:**
- **Companies**: builtin.com, goodfirms.co, biopharmguy.com
- **Events**: Meetup, CyberSC, AllEvents

## Development

### Contributing Guidelines

This project addresses South Carolina's innovation ecosystem challenges through open collaboration.

**Current Status:**
✅ **MVP Complete** - Functional business directory with 60+ companies  
✅ **User Authentication** - Google OAuth and email/password registration  
✅ **Data Extraction** - Automated scraping from multiple sources  
✅ **Responsive Design** - Optimized for all devices  

**Next Priorities:**
1. Add more options for regional filtering (Currently only Charleston or Mount Pleasant as options)
2. Tech News aggregation display
3. Improve data extraction logic

## Credits

**Project Creator:**
- **Julian Feliciano** - Project architecture, full-stack development, and data extraction systems
- GitHub: [github.com/jfelic](https://github.com/jfelic)

**Technologies & Frameworks:**
- [Next.js](https://nextjs.org/) - React framework for production
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Firecrawl](https://firecrawl.dev/) - Web scraping API
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

**Inspiration & References:**
This project was developed to address the fragmented nature of South Carolina's innovation ecosystem, inspired by the need for centralized discovery of tech companies and events across the state.

---

*For questions, suggestions, or contributions, please open an issue on GitHub or reach out to the felicianojulian1@gmail.com*
