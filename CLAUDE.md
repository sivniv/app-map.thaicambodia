# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Thailand-Cambodia Conflict Monitor is an AI-powered news monitoring system that tracks government communications and international news related to Thailand-Cambodia conflicts. The system uses Next.js 15 with a dual monitoring approach: real-time Facebook webhooks for government pages and scheduled RSS monitoring for international news outlets.

## Essential Commands

```bash
# Development
npm run dev              # Start development server on :3000
npm run build           # Production build
npm run typecheck       # TypeScript validation without output
npm run lint            # ESLint validation

# Database Operations
npx prisma generate     # Generate Prisma client after schema changes
npx prisma db push      # Push schema changes to database
npx prisma studio       # Open database browser UI
npx prisma db push --force-reset  # Reset database completely

# Environment Setup
cp .env.example .env.local  # Initialize environment variables
```

## Architecture Overview

### Core Data Flow
1. **Input Sources**: Facebook webhooks (`/api/webhook/facebook`) + RSS monitoring (`/api/monitor/news`)
2. **AI Processing**: OpenAI GPT-4 analysis via `lib/openai.ts` (conflict relevance 1-10, importance 1-5, sentiment)
3. **Storage**: PostgreSQL with Prisma ORM (Articles → TimelineEvents relationship)
4. **Output**: Public dashboard (`/`) + Admin interface (`/admin`)

### Key Service Layers

**`lib/` - Core Services**
- `openai.ts`: AI content analysis (analyzeContent function returns AnalysisResult interface)
- `facebook.ts`: Facebook Graph API integration with webhook verification
- `news.ts`: RSS parsing and web scraping with conflict relevance filtering
- `prisma.ts`: Database client singleton

**API Routes Architecture**
- `/api/webhook/facebook`: Facebook webhook handler (GET for verification, POST for processing)
- `/api/monitor/news`: Manual news monitoring trigger (POST only)
- `/api/articles`: Article CRUD with pagination/filtering
- `/api/timeline`: Timeline events with article relationships
- `/api/admin/*`: Administrative operations (logs, source management)

### Database Schema Key Relationships
- `Source` (1:many) → `Article` (1:many) → `TimelineEvent`
- `MonitoringLog` tracks all system activity by SourceType
- Articles have status flow: PENDING → PROCESSING → ANALYZED/ERROR
- All models use MongoDB ObjectId with @db.ObjectId mapping

## Environment Variables Required

```bash
DATABASE_URL="mongodb+srv://..."    # MongoDB Atlas connection
OPENAI_API_KEY="..."               # Required for AI analysis
RAPIDAPI_KEY="..."                 # RapidAPI key for Facebook scraping
RAPIDAPI_HOST="facebook-scraper3.p.rapidapi.com"  # RapidAPI host
NEWS_API_KEY="..."                 # NewsAPI.org (optional, RSS still works)
```

## Monitoring System Behavior

### Facebook Integration
- Uses RapidAPI Facebook Scraper3 for reliable access to government pages
- Polling-based monitoring (replaces webhook system) via `/api/monitor/facebook`
- Monitors predefined government pages (THAI_GOVERNMENT_PAGES, CAMBODIAN_GOVERNMENT_PAGES in `lib/facebook.ts`)
- Content filtered by `isConflictRelated()` function before storage
- Manual trigger available in both main dashboard and admin interface

### News Monitoring
- RSS feeds from NEWS_SOURCES array in `lib/news.ts` (Reuters, BBC, Channel News Asia, etc.)
- Manual trigger via admin dashboard or API call
- Two-stage filtering: `isThailandCambodiaRelated()` then AI conflictRelevance scoring
- Web scraping fallback for full content when RSS excerpts are insufficient

### AI Analysis Pipeline
- `analyzeContent()` returns structured AnalysisResult with summary, keywords, sentiment
- Conflict relevance threshold: articles with score < 3 are filtered out
- Analysis stored as JSON in Article.aiAnalysis field

### OpenAI Real-time Analytics (New)
- **Real-time Conflict Analysis**: ChatGPT-4 powered analytics updated every 12 hours
- **Direct OpenAI Integration**: Bypasses news sources for real-time conflict assessment
- **Comprehensive Metrics**: Casualties, population impact, weapons, diplomatic tension, risk levels
- **Manual Updates**: Dashboard "Update Now" button for instant OpenAI analysis
- **Scheduled Updates**: Automatic 12-hour intervals via cron endpoints
- **High Confidence**: AI provides confidence scores and verification levels
- **Service**: `lib/openai-analytics.ts` - OpenAIAnalyticsService class
- **Endpoints**: `/api/analytics/openai-update` (manual), `/api/cron/openai-analytics` (scheduled)

## Component Architecture

**Pages**
- `/`: Main dashboard with stats, article cards, timeline (client-side data fetching)
- `/admin`: Administrative interface with tabs for logs, sources, monitoring status

**Components**
- `Timeline.tsx`: Chronological event display with filtering (facebook/news/all)
- `ArticleCard.tsx`: Article display with metadata badges and source icons

## Development Patterns

### Adding New Monitoring Sources
1. Update appropriate array in `lib/facebook.ts` or `lib/news.ts`
2. Create Source record in database via admin interface or direct API
3. Ensure `isConflictRelated()` or `isThailandCambodiaRelated()` functions cover new source patterns

### API Route Pattern
All routes use NextRequest/NextResponse with try/catch blocks logging to MonitoringLog table. Admin routes check permissions implicitly through URL structure.

### Database Changes
Always run `npx prisma generate` after schema modifications and `npx prisma db push` to apply changes. The schema uses cuid() IDs and cascade deletions.

## Testing and Monitoring

### Manual Testing
- Use admin dashboard `/admin` to trigger monitoring cycles
- Check `/api/stats` for system health metrics
- Monitor `/api/admin/logs` for processing errors

### Production Monitoring
- MonitoringLog table tracks all system activity with status/metadata
- Timeline events show processing success/failure
- Admin dashboard provides system health overview

## Security Considerations

- Webhook endpoints verify tokens before processing
- Environment variables must be secured (no defaults in production)
- All content analysis happens server-side via OpenAI API
- Facebook integration requires valid app registration and page tokens