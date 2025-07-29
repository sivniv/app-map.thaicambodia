# 🚀 Thailand-Cambodia Conflict Monitor - Full Application

**Dynamic Next.js application with real-time monitoring, AI analysis, and database integration.**

## 🌟 Features

- **🤖 AI-Powered Analysis**: OpenAI GPT-4 content analysis and conflict assessment
- **📊 Real-time Dashboard**: Live statistics and conflict analytics
- **🔄 Automated Monitoring**: Facebook pages and RSS feeds monitoring
- **📱 Interactive Timeline**: Horizontal timeline with event filtering
- **🔐 Admin Panel**: Password-protected administrative interface
- **🌍 Multi-language**: Thai/English language support
- **📈 Analytics Dashboard**: Comprehensive conflict metrics tracking
- **⚡ Real-time Updates**: Live data synchronization

## 🎯 Quick Deploy Options

### Option 1: Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sivniv/thailand-cambodia-monitor-APP)

### Option 2: Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/thailand-cambodia-monitor)

### Option 3: Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sivniv/thailand-cambodia-monitor-APP)

## 🔧 Environment Variables Setup

### Required Variables:
```bash
DATABASE_URL="mongodb+srv://..."           # MongoDB Atlas connection
OPENAI_API_KEY="sk-proj-..."              # OpenAI API key
RAPIDAPI_KEY="..."                        # RapidAPI for Facebook scraping
NEXTAUTH_SECRET="..."                     # Auth secret (32+ chars)
NEXTAUTH_URL="https://your-domain.com"    # Your app URL
NEXT_PUBLIC_ADMIN_PASSWORD="..."          # Admin panel password
```

### Optional Variables:
```bash
NEWS_API_KEY="..."                        # NewsAPI.org key
GOOGLE_TRANSLATE_API_KEY="..."            # Google Translate
FACEBOOK_APP_ID="..."                     # Facebook Graph API
TWOCAPTCHA_TOKEN="..."                    # Cloudflare bypass
```

## 📋 Deployment Steps

### 1. **Fork/Clone Repository**
```bash
git clone https://github.com/sivniv/thailand-cambodia-monitor-APP.git
cd thailand-cambodia-monitor-APP
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Setup Database**
1. Create [MongoDB Atlas](https://cloud.mongodb.com) account
2. Create new cluster (free tier available)
3. Get connection string
4. Set as `DATABASE_URL` environment variable

### 4. **Configure Environment**
1. Copy `.env.production` to `.env.local`
2. Fill in your API keys and secrets
3. Update `NEXTAUTH_URL` with your domain

### 5. **Initialize Database**
```bash
npx prisma generate
npx prisma db push
```

### 6. **Deploy**
- **Vercel**: Connect GitHub repo → Deploy
- **Railway**: Connect repo → Add env vars → Deploy
- **Manual**: `npm run build` → Upload to hosting

## 🗄️ Database Schema

The application uses MongoDB with Prisma ORM:

- **Articles**: News articles with AI analysis
- **Timeline Events**: Chronological conflict events
- **Sources**: News sources and monitoring configs
- **Conflict Analytics**: Daily conflict metrics
- **Monitoring Logs**: System activity tracking

## 🤖 AI Features

### OpenAI Integration:
- **Content Analysis**: Automatic relevance scoring (1-10)
- **Sentiment Analysis**: Positive/Negative/Neutral classification
- **Keyword Extraction**: Automatic tagging
- **Conflict Assessment**: Risk level evaluation
- **Real-time Analytics**: Live conflict metrics

### Analytics Dashboard:
- **Tension Levels**: 1-10 conflict intensity
- **Casualty Tracking**: Verified casualty reports
- **Population Impact**: Affected civilians count
- **Diplomatic Activity**: Meeting and statement tracking
- **Risk Assessment**: AI-powered risk evaluation

## 📱 Pages Overview

### Public Pages:
- **`/`** - Main dashboard with statistics
- **`/timeline`** - Interactive timeline view
- **`/conflict-history`** - Historical conflict analysis
- **`/thailand-cambodia-research`** - Deep research page

### Admin Pages (Password Protected):
- **`/admin`** - Administrative dashboard
- **`/admin/logs`** - System monitoring logs
- **`/admin/sources`** - Source management

## 🔄 Monitoring System

### Automated Monitoring:
- **Facebook Pages**: Thai/Cambodian government pages
- **RSS Feeds**: International news sources
- **Conflict Analytics**: Real-time AI assessment
- **Scheduled Updates**: Every 15 minutes to 12 hours

### Manual Triggers:
- Admin panel monitoring controls
- API endpoints for forced updates
- Webhook integration support

## 🎨 Customization

### Adding News Sources:
1. Update `lib/rss-sources.ts`
2. Add to database via admin panel
3. Configure monitoring frequency

### Modifying AI Analysis:
1. Edit `lib/openai.ts`
2. Update analysis prompts
3. Adjust scoring algorithms

### Timeline Customization:
1. Modify `components/HorizontalTimeline.tsx`
2. Update event filtering logic
3. Customize visual appearance

## 🔐 Security Features

- **Admin Authentication**: Password-protected access
- **API Rate Limiting**: Prevents abuse
- **Environment Variable Security**: Sensitive data protection
- **CORS Configuration**: Controlled API access
- **Input Validation**: Secure data handling

## 📊 Performance Optimization

- **Next.js 15**: Latest framework optimizations
- **Database Indexing**: Optimized queries
- **API Caching**: Reduced response times
- **Image Optimization**: Automatic compression
- **Code Splitting**: Faster page loads

## 🐛 Troubleshooting

### Common Issues:

**Database Connection Failed:**
- Verify MongoDB Atlas connection string
- Check IP whitelist settings
- Ensure network access is enabled

**API Rate Limits:**
- Check OpenAI usage limits
- Verify RapidAPI subscription
- Monitor API quotas

**Build Errors:**
- Run `npm run typecheck`
- Check environment variables
- Verify all dependencies installed

### Debug Mode:
```bash
npm run dev  # Local development with hot reload
npm run build && npm run start  # Production testing
```

## 🔄 Updates & Maintenance

### Updating Content:
1. Use admin panel for manual updates
2. Configure automated monitoring frequency
3. Monitor system logs for errors

### Database Maintenance:
- Regular backups recommended
- Monitor storage usage
- Clean old logs periodically

### Performance Monitoring:
- Check API response times
- Monitor database query performance
- Review system resource usage

## 📞 Support & Documentation

- **Repository**: https://github.com/sivniv/thailand-cambodia-monitor-APP
- **Static Version**: https://github.com/sivniv/thailand-cambodia-monitor
- **Live Demo**: https://sivniv.github.io/thailand-cambodia-monitor/

## 🎉 Success Metrics

After deployment, verify:
- [ ] Main dashboard loads with statistics
- [ ] Timeline displays events correctly
- [ ] Admin panel accessible with password
- [ ] Monitoring systems operational
- [ ] Database connectivity working
- [ ] AI analysis functioning

---

**🌐 Your dynamic Thailand-Cambodia Conflict Monitor with full AI capabilities and real-time monitoring is ready for deployment!**