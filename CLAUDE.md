# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Thailand-Cambodia Conflict Monitor is an AI-powered news monitoring system that tracks government communications and international news related to Thailand-Cambodia conflicts. The system uses Next.js 15 with MongoDB, automated monitoring via cron jobs, and real-time AI analytics. Key differentiator: Uses RapidAPI Facebook Scraper3 instead of official webhooks for reliable government page access.

## Essential Commands

```bash
# Development
npm run dev              # Start development server on :3000
npm run build           # Production build
npm run start           # Production server (requires build first)
npm run typecheck       # TypeScript validation without output
npm run lint            # ESLint validation

# Testing
npm run test            # Run Playwright tests
npm run test:ui         # Run tests with UI
npm run test:report     # Show test report

# Database Operations
npx prisma generate     # Generate Prisma client after schema changes
npx prisma db push      # Push schema changes to database
npx prisma studio       # Open database browser UI
npx prisma db push --force-reset  # Reset database completely

# Environment Setup
cp .env.example .env.local  # Initialize environment variables
```

## Architecture Overview

### Data Flow Architecture
1. **Input Sources**: RapidAPI Facebook scraping (`/api/monitor/official-pages`) + RSS feeds (`/api/monitor/news`)
2. **Scheduling Layer**: `lib/scheduler.ts` manages cron jobs (news every 15min, Facebook every 3hrs, analytics daily)
3. **AI Processing**: OpenAI GPT-4 analysis via `lib/openai.ts` (conflict relevance 1-10, importance 1-5, sentiment)
4. **Enhanced Analytics**: `lib/openai-analytics.ts` generates daily conflict summaries with casualty/weapon tracking
5. **Storage**: MongoDB with Prisma ORM (complex relational schema for conflict analytics)
6. **Output**: Multi-page dashboard with research hub, timeline visualization, and admin interface

### Core Service Architecture

**`lib/` - Core Services**
- `openai.ts`: Content analysis (`analyzeContent()` returns AnalysisResult with summary, keywords, sentiment)
- `openai-analytics.ts`: Daily conflict analytics (`OpenAIAnalyticsService` class for comprehensive metrics)
- `facebook.ts`: RapidAPI Facebook Scraper3 integration (THAI_GOVERNMENT_PAGES + CAMBODIAN_GOVERNMENT_PAGES arrays)
- `news.ts`: RSS parsing and web scraping (NEWS_SOURCES array for international outlets)
- `scheduler.ts`: Cron job management with Bangkok timezone (auto-initializes in production)
- `conflict-analytics.ts`: Advanced conflict data processing and correlation
- `prisma.ts`: Database client singleton

**API Routes by Function**
- `/api/monitor/*`: Monitoring triggers (news, facebook, official-pages)
- `/api/analytics/*`: AI analytics (daily-summary, stats, openai-update, weekly-trends)
- `/api/cron/*`: Scheduled job endpoints (openai-analytics)
- `/api/admin/*`: Administrative operations (logs, sources, cleanup utilities)
- `/api/webhook/facebook`: Legacy webhook handler (GET verification, POST processing)
- `/api/articles`, `/api/timeline`: Data access with pagination/filtering

### Database Schema (MongoDB)

**Core Models**
- `Source` (1:many) → `Article` (1:many) → `TimelineEvent`
- `MonitoringLog`: All system activity tracking by SourceType
- `Configuration`: System settings key-value store

**Enhanced Conflict Analytics Models**
- `ConflictAnalytics`: Daily analytics with casualty/population/economic/diplomatic metrics
- `CasualtyReport`: Detailed casualty tracking with verification levels
- `WeaponUsage`: Military equipment mentions with threat assessment
- `PopulationImpact`: Civilian impact tracking with demographics
- All use MongoDB ObjectId with @db.ObjectId mapping and cascade deletions

### Page Architecture

**Main Pages**
- `/`: Dashboard with stats, articles, timeline (real-time monitoring indicators)
- `/thailand-cambodia-research`: Comprehensive research hub with interactive navigation
- `/conflict-origins`, `/conflict-history`: Deep analysis pages
- `/analysis/thai-politics`: Political analysis dashboard
- `/timeline`: Full timeline visualization with filtering
- `/admin`: System monitoring with tabs (logs, sources, analytics)

## Environment Variables Required

```bash
# Core Services
DATABASE_URL="mongodb+srv://..."    # MongoDB Atlas connection (required)
OPENAI_API_KEY="sk-..."             # OpenAI GPT-4 API (required)

# Facebook Monitoring
RAPIDAPI_KEY="..."                  # RapidAPI key for Facebook scraping (required)
RAPIDAPI_HOST="facebook-scraper3.p.rapidapi.com"  # RapidAPI host (required)

# Optional Services  
NEWS_API_KEY="..."                  # NewsAPI.org (optional, RSS still works)
NEXTAUTH_SECRET="..."               # NextAuth session security
NEXTAUTH_URL="http://localhost:3000" # Base URL for auth callbacks
WEBHOOK_SECRET="..."                # Webhook verification token

# Scheduler Control
ENABLE_SCHEDULER="true"             # Enable cron jobs in development
NODE_ENV="production"               # Auto-enables scheduler in production
```

## Monitoring System Behavior

### Automated Scheduling (lib/scheduler.ts)
- **News Monitoring**: Every 15 minutes via `/api/monitor/news`
- **Official Pages**: Every 3 hours via `/api/monitor/official-pages`
- **Facebook Search**: Every 2 hours (8AM-8PM), every 4 hours (off-hours)
- **Daily Analytics**: 11PM Bangkok time via `/api/analytics/daily-summary`
- **Weekly Trends**: Sunday 11:30PM via `/api/analytics/weekly-trends`
- **Timezone**: Asia/Bangkok for all cron jobs

### Facebook Integration Strategy
- **RapidAPI Approach**: Uses Facebook Scraper3 API instead of official Graph API (more reliable)
- **Government Pages**: Predefined arrays in `lib/facebook.ts` (Thai + Cambodian official pages)
- **Content Filtering**: `isConflictRelated()` function filters relevant posts before storage
- **Rate Limiting**: Scheduled intervals prevent API overuse
- **Fallback**: Manual triggers available in dashboard and admin interface

### News Aggregation System
- **RSS Sources**: NEWS_SOURCES array in `lib/news.ts` (Reuters, BBC, CNA, Bangkok Post, etc.)
- **Two-Stage Filtering**: `isThailandCambodiaRelated()` → AI conflictRelevance scoring (threshold: 3/10)
- **Content Enhancement**: Web scraping for full article text when RSS provides excerpts
- **Deduplication**: Fuzzy matching prevents duplicate articles from same source

### AI Analysis Pipeline
- **Content Analysis**: `analyzeContent()` processes title+content → AnalysisResult structure
- **Conflict Metrics**: Relevance (1-10), importance (1-5), sentiment, keywords, summary
- **Enhanced Analytics**: `OpenAIAnalyticsService` generates daily reports with:
  - Casualty tracking and verification
  - Weapon usage mentions and threat assessment  
  - Population impact analysis with demographics
  - Economic/diplomatic tension scoring
- **Storage**: Analysis stored as JSON in Article.aiAnalysis field + structured conflict models

## Development Patterns

### Adding New Sources
1. **Facebook**: Add page to THAI_GOVERNMENT_PAGES or CAMBODIAN_GOVERNMENT_PAGES in `lib/facebook.ts`
2. **News**: Add RSS feed to NEWS_SOURCES array in `lib/news.ts`
3. **Database**: Create Source record via admin interface or direct API
4. **Filtering**: Update `isConflictRelated()` or `isThailandCambodiaRelated()` for new source patterns

### API Route Pattern
- All routes use NextRequest/NextResponse with try/catch error handling
- Comprehensive logging to MonitoringLog table with metadata
- Admin routes use implicit URL-based permissions (no explicit auth middleware)
- Consistent JSON response format with success/error status

### Database Operations
- **Schema Changes**: Always `npx prisma generate` → `npx prisma db push`
- **Development**: Use `npx prisma studio` for data browser
- **Production**: Never use `--force-reset` (data loss)
- **Relationships**: Extensive use of cascade deletions for data integrity

### Component Development
- **Client Components**: Use 'use client' directive for interactivity
- **Server Components**: Default for data fetching and static content
- **Styling**: Tailwind CSS with design system consistency
- **State Management**: React hooks for local state, no external state library

## Testing Strategy

### Test Suite (Playwright)
- **Application Functionality**: Main page loading, navigation, responsiveness
- **Error Handling**: 404 pages, error boundaries, invalid routes
- **API Error Handling**: Endpoint error responses and edge cases
- **Next.js Features**: Production error handling, static file serving

### Manual Testing Checklist
- Admin dashboard (`/admin`): Monitor logs, trigger cycles, check system health
- API endpoints: `/api/stats` for metrics, `/api/admin/logs` for errors
- Monitoring cycles: Verify news/Facebook data collection working
- AI analysis: Check conflictRelevance scoring and article processing

## Production Deployment

### Build Configuration (next.config.mjs)
- **Standalone Output**: Optimized for containerization
- **Image Domains**: Configured for Facebook/social media images
- **Build Tolerance**: Ignores TypeScript/ESLint errors to prevent deployment blocks
- **Performance**: Compression enabled, powered-by header disabled

### Deployment Files Created
- `vercel.json`: Vercel configuration with cron jobs and function timeouts
- `Dockerfile`: Multi-stage build for containerized deployment
- `.env.production.example`: Production environment variable template
- `DEPLOYMENT.md`: Comprehensive deployment guide for multiple platforms

### Monitoring and Maintenance
- **Health Checks**: Database connectivity, API availability, cron job status
- **Logging**: MonitoringLog table tracks all system activities with metadata
- **Performance**: Built with standalone output for optimal production performance
- **Security**: All secrets externalized, environment-based configuration

## Key Architectural Decisions

### Why RapidAPI over Facebook Graph API
- Official Facebook API has strict rate limits and approval requirements
- RapidAPI Facebook Scraper3 provides reliable access to public government pages
- Eliminates webhook complexity while maintaining data freshness through scheduling

### Why MongoDB over PostgreSQL
- Better JSON storage for complex AI analysis results and metadata
- Flexible schema evolution for enhanced conflict analytics models
- Simplified relationship management with Prisma ORM

### Why Next.js App Router
- Server-side rendering for SEO and performance
- API routes co-located with frontend code
- Built-in optimization for static pages and dynamic content
- TypeScript integration with type-safe routing