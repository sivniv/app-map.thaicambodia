# Thailand-Cambodia Conflict Monitor

An AI-powered monitoring system that tracks news and government communications related to Thailand-Cambodia conflicts using Next.js, OpenAI, and real-time data processing.

## Features

### Core Monitoring Capabilities
- **Facebook Government Page Monitoring**: Real-time tracking of official government Facebook pages from both Thailand and Cambodia
- **International News Monitoring**: Automated collection from major news outlets and RSS feeds
- **AI-Powered Analysis**: OpenAI GPT-4 integration for content summarization and conflict relevance scoring
- **Timeline Visualization**: Chronological display of events with importance ratings
- **Admin Dashboard**: Comprehensive monitoring and management interface

### Technical Features
- Real-time webhook processing for Facebook updates
- Automated news scraping from multiple sources
- Intelligent content filtering and relevance scoring
- PostgreSQL database with Prisma ORM
- Responsive design with Tailwind CSS
- TypeScript for type safety

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI GPT-4 API
- **Monitoring**: Custom webhook system, RSS parsing
- **APIs**: Facebook Graph API, News API

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Facebook App with Graph API access
- News API key (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NewsAIAgent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys and database URL in `.env.local`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/news_ai_agent"
   OPENAI_API_KEY="your_openai_api_key"
   FACEBOOK_ACCESS_TOKEN="your_facebook_access_token"
   FACEBOOK_VERIFY_TOKEN="your_webhook_verify_token"
   NEWS_API_KEY="your_news_api_key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Main dashboard: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin

## Configuration

### Facebook Integration

1. Create a Facebook App at https://developers.facebook.com
2. Get a long-lived page access token
3. Set up webhook endpoints:
   - Webhook URL: `https://yourdomain.com/api/webhook/facebook`
   - Verify token: Set in your environment variables
   - Subscribe to `feed` events

### Monitored Sources

**Thai Government Pages:**
- Royal Thai Government
- Ministry of Foreign Affairs Thailand
- Prime Minister of Thailand

**Cambodian Government Pages:**
- Royal Government of Cambodia
- Ministry of Foreign Affairs Cambodia

**News Sources:**
- Reuters
- BBC News
- Channel News Asia
- Bangkok Post
- Phnom Penh Post
- Al Jazeera

## Usage

### Manual Monitoring
- Use the "Refresh News" button on the main dashboard
- Access the admin dashboard for detailed monitoring controls

### API Endpoints

- `GET /api/articles` - Fetch articles with pagination and filtering
- `GET /api/timeline` - Get timeline events
- `POST /api/monitor/news` - Trigger news monitoring
- `POST /api/webhook/facebook` - Facebook webhook endpoint
- `GET /api/stats` - System statistics

### Admin Features
- View monitoring logs
- Manage sources (enable/disable)
- Trigger manual monitoring cycles
- System health checks

## Content Analysis

The system uses OpenAI GPT-4 to analyze content for:
- **Conflict Relevance**: 1-10 scale rating
- **Importance**: 1-5 scale rating
- **Sentiment**: Positive, negative, or neutral
- **Keywords**: Extracted relevant terms
- **Summary**: Concise 2-3 sentence summary

## Database Schema

Key entities:
- **Sources**: Monitoring sources (Facebook pages, RSS feeds)
- **Articles**: Processed content with AI analysis
- **TimelineEvents**: Chronological event tracking
- **MonitoringLogs**: System activity logs
- **Configuration**: System settings

## Development

### Running Tests
```bash
npm run test
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Database Management
```bash
# Reset database
npx prisma db push --force-reset

# View database
npx prisma studio
```

## Deployment

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Set up webhook URLs for Facebook

### Vercel Deployment
```bash
npm run build
# Deploy to Vercel or your preferred platform
```

### Database Migration
```bash
npx prisma generate
npx prisma db push
```

## Monitoring and Maintenance

### Health Checks
- Database connectivity
- API availability
- Webhook functionality

### Logs
- Access monitoring logs via admin dashboard
- Check API response logs
- Monitor system performance

## Security Considerations

- Webhook verification tokens
- API key protection
- Rate limiting on monitoring endpoints
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational and defensive security purposes only.

## Support

For issues and questions:
1. Check the admin dashboard for system status
2. Review monitoring logs for errors
3. Ensure all API keys are properly configured
4. Verify database connectivity