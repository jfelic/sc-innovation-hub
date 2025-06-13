**Innovation Platform – MVP Plan & Meeting Summary**

---

### 🌐 Project Overview

A web-based platform that centralizes innovation activity across South Carolina with a focus on:

- Business & startup directories
- Event discovery & conflict tracking
- Tech news aggregation
- Regional filtering (e.g., Mount Pleasant vs. statewide)

The solution combines challenge statements from Jamie Dement and Matt Brady into a single, scalable product.

---

### ✅ Core MVP Features (Must-Have)

#### 1. Business Directory

- List of innovation-driven businesses across SC & Mount Pleasant
- Profiles include:
  - Name
  - Description
  - Industry/category (see below)
  - Location (address or map coordinates)
  - **Affiliated People** (names, titles, optional contact info)
- Search and filter by:
  - Industry/category
  - Region/location
- Simple map view with pins by region

#### 2. Event Discovery & Tracking

- Centralized event calendar for tech/innovation
- Event details:
  - Title, date, time, location, description
  - Category tagging (AI, Cyber, etc.)
- Conflict detection: alerts for same-day/time overlaps
- Moderation system for user-submitted events

#### 3. AI-Powered Content Aggregation

- Firecrawl integration for scraping 3–5 trusted SC tech/event/news sources
- Automated daily or weekly scraping jobs
- LLM prompt design to extract structured data (title, date, location, summary)
- Basic validation before inserting into the DB

#### 4. User Authentication & Profiles

- Account creation & login (NextAuth.js or similar)
- Basic user profile (name, email, bookmarked items)
- Ability to save/bookmark:
  - Events
  - Companies

#### 5. Regional Filtering

- Toggle to filter platform content by region:
  - Mount Pleasant
  - Statewide
  - Others (e.g. Upstate, Midlands, Lowcountry)
- Filters apply across events, directories, and news

#### 6. Discover Page

- News-style page that aggregates innovation-related content scraped via Firecrawl
- Automatically updated content, categorized by topic (AI, Cyber, Biotech, etc.)

---

### 💡 Meeting Notes Summary (Stakeholder Feedback)

**Categories for Businesses**:

- AI
- Cyber
- SaaS
- Software/IT Consulting (General tech)
- Nonprofit
- Medical Tech / Biotech
- Other

**Additional Requirements:**

- Companies should have associated/affiliated people listed
- Platform should have 3 main sections:
  - Directory
  - *Events*
  - *Tech News ("Discover" page)*

***Stakeholder Contacts:***

- *Jamie Dement – 843-817-1144*
- *Matt Brady – 864-316-5945*


