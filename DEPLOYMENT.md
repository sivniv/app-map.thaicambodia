# 🚀 Deployment Guide - Thailand-Cambodia Conflict Monitor

## 📋 Pre-Deployment Checklist

### ✅ Required Environment Variables
- [ ] `DATABASE_URL` - MongoDB connection string
- [ ] `OPENAI_API_KEY` - OpenAI API key for AI analysis
- [ ] `RAPIDAPI_KEY` - RapidAPI key for Facebook scraping
- [ ] `NEXT_PUBLIC_ADMIN_PASSWORD` - Admin panel password
- [ ] `NEXTAUTH_SECRET` - Authentication secret (generate with `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` - Your production domain URL
- [ ] `WEBHOOK_SECRET` - Webhook security token
- [ ] `CRON_SECRET` - Cron job security token

### ✅ Build Process
```bash
# Test local build
npm run build
npm run start

# Verify all routes work
curl http://localhost:3000/api/stats
curl http://localhost:3000/api/timeline
```

## 🌐 Deployment Platforms

### 1. Vercel (Recommended)

**Setup:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Or use CLI:
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
# ... add all required variables
```

**Vercel Configuration:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Framework Preset: `Next.js`
- Node.js Version: `18.x`

**Environment Variables in Vercel:**
- Go to Dashboard → Project → Settings → Environment Variables
- Add all variables from `.env.example`
- Set `NEXTAUTH_URL` to your Vercel domain

### 2. Railway

**Setup:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Railway Configuration:**
- Build Command: `npm run build`
- Start Command: `npm run start`
- Port: Auto-detected from Next.js

### 3. Heroku

**Setup:**
```bash
# Install Heroku CLI
# Create Procfile
echo "web: npm run start" > Procfile

# Deploy
heroku create your-app-name
heroku config:set DATABASE_URL="your-mongodb-url"
heroku config:set OPENAI_API_KEY="your-openai-key"
# ... set all environment variables

git push heroku main
```

### 4. Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
```

**Deploy:**
```bash
docker build -t thailand-cambodia-monitor .
docker run -p 3000:3000 --env-file .env thailand-cambodia-monitor
```

## 🗄️ Database Setup

### MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create new cluster (Free tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string → Set as `DATABASE_URL`

### Initialize Database
The application automatically creates collections on first run. No manual setup required.

## 🔐 Security Configuration

### Required Security Updates
1. **Change Admin Password:**
   ```bash
   # Generate secure password
   openssl rand -base64 32
   # Set as NEXT_PUBLIC_ADMIN_PASSWORD
   ```

2. **Generate Secrets:**
   ```bash
   # NEXTAUTH_SECRET
   openssl rand -base64 32
   
   # WEBHOOK_SECRET
   openssl rand -base64 32
   
   # CRON_SECRET
   openssl rand -base64 32
   ```

3. **Update Domain URLs:**
   - Set `NEXTAUTH_URL` to your production domain
   - Update any hardcoded localhost references

### API Keys Setup
1. **OpenAI API Key:** [OpenAI Platform](https://platform.openai.com/api-keys)
2. **RapidAPI Key:** [RapidAPI Facebook Scraper](https://rapidapi.com/neoscrap-net/api/facebook-scraper3)
3. **News API Key (Optional):** [NewsAPI.org](https://newsapi.org/register)

## 📊 Monitoring & Maintenance

### Health Checks
- `/api/stats` - System statistics
- `/api/timeline` - Timeline data
- `/admin` - Admin panel (password protected)

### Scheduled Jobs
The app includes automated monitoring:
- News monitoring: Every 15 minutes
- Facebook monitoring: Every 2-4 hours
- Analytics: Daily at 11 PM

### Logs
- Check admin panel → Monitoring Logs
- Monitor error rates and performance
- Set up alerts for failed monitoring cycles

## 🔧 Troubleshooting

### Build Issues
- **Cloudflare Scraper Error:** The app conditionally loads advanced scraping features. Basic functionality works without these dependencies.
- **Memory Issues:** Increase memory limits in deployment platform settings
- **Timeout Issues:** Adjust API timeouts in platform configuration

### Runtime Issues
- **Database Connection:** Verify MongoDB Atlas IP whitelist and connection string
- **API Rate Limits:** Check OpenAI and RapidAPI usage
- **Admin Access:** Verify admin password is set correctly

### Performance Optimization
- Enable gzip compression (configured in `next.config.mjs`)
- Use CDN for static assets
- Monitor database query performance
- Consider caching for frequent API calls

## 📈 Scaling Considerations

### High Traffic
- Use Redis for session storage
- Implement database connection pooling
- Add load balancing
- Consider Next.js API route caching

### Data Growth
- Implement data archiving strategy
- Monitor database storage usage
- Consider database indexing optimization
- Set up automated backups

## ✅ Post-Deployment Verification

1. **Frontend Access:** Visit your domain
2. **Admin Panel:** Access `/admin` with password
3. **API Endpoints:** Test `/api/stats`, `/api/timeline`
4. **Monitoring:** Verify news monitoring is working
5. **Database:** Check data is being stored correctly

## 🆘 Support

For deployment issues:
1. Check application logs in your deployment platform
2. Verify all environment variables are set
3. Test API endpoints individually
4. Check database connectivity
5. Review security settings and IP whitelisting

---

**🎉 Your Thailand-Cambodia Conflict Monitor is ready for production!**