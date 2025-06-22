# SC Innovation Hub

A digital platform that connects South Carolina's tech, AI, cyber, and innovation ecosystems in one centralized location. This project addresses the challenge of fragmented innovation communities by providing unified access to companies, events, and opportunities across the state.

## 🌟 Features

### Core MVP Features
- **Business Directory**: Searchable database of innovation-driven companies across SC
- **Event Discovery**: Centralized calendar with conflict detection and categorization
- **Content Aggregation**: AI-powered scraping of SC tech news and updates
- **User Authentication**: Secure login with Google OAuth and email providers
- **Regional Filtering**: Toggle between Mount Pleasant, statewide, and regional views
- **Bookmarking System**: Save companies and events for easy access

### Technical Features
- **Next.js 15** with App Router and TypeScript
- **PostgreSQL** database with Prisma ORM
- **NextAuth.js** for authentication
- **Radix UI** components for accessibility
- **Tailwind CSS** for responsive design
- **Automated Content Scraping** via Firecrawl API

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
│   ├── app/                 # Next.js App Router pages
│   │   ├── auth/           # Authentication pages
│   │   ├── api/            # API routes
│   │   └── layout.tsx      # Root layout
│   ├── lib/                # Utility functions and configurations
│   │   ├── auth.ts         # NextAuth configuration
│   │   └── db.ts           # Database connection
│   ├── types/              # TypeScript type definitions
│   └── generated/          # Prisma generated client
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
└── public/                 # Static assets
```

## 🗄️ Database Schema

The platform uses PostgreSQL with the following main entities:

- **Users**: Authentication and user profiles
- **Companies**: Innovation businesses with location and industry data
- **Events**: Tech events with scheduling and categorization
- **Bookmarks**: User-saved companies and events

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

## 🤝 Contributing

This project is part of a month-long hackathon addressing South Carolina's innovation ecosystem challenges. Contributions are welcome!

## 📄 License

This project is private and proprietary.

---

Built with ❤️ for South Carolina's innovation community

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
