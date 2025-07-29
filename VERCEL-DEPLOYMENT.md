# 🚀 Vercel Deployment Guide - Thailand-Cambodia Monitor App

## 🎯 Quick Deploy (1-Click)

### Option 1: Direct Deploy Button
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sivniv/thailand-cambodia-monitor-APP)

### Option 2: Manual Setup
1. **Go to**: https://vercel.com
2. **Login** with GitHub
3. **Import Project** → Select `thailand-cambodia-monitor-APP`
4. **Configure** environment variables (see below)
5. **Deploy**

## 🔧 Required Environment Variables

### In Vercel Dashboard → Settings → Environment Variables:

#### Essential (Required):
```bash
DATABASE_URL = mongodb+srv://username:password@cluster.mongodb.net/thailand_cambodia_monitor?retryWrites=true&w=majority
OPENAI_API_KEY = sk-proj-your-openai-key-here
RAPIDAPI_KEY = your-rapidapi-key-here
RAPIDAPI_HOST = facebook-scraper3.p.rapidapi.com
NEXTAUTH_SECRET = your-32-character-random-secret-here
NEXTAUTH_URL = https://your-app-name.vercel.app
NEXT_PUBLIC_ADMIN_PASSWORD = YourSecureAdminPassword2025!
WEBHOOK_SECRET = your-webhook-secret-here
CRON_SECRET = your-cron-secret-here
```

#### Optional (Enhanced Features):
```bash
NEWS_API_KEY = your-newsapi-org-key
GOOGLE_TRANSLATE_API_KEY = your-google-translate-key
FACEBOOK_APP_ID = your-facebook-app-id
FACEBOOK_APP_SECRET = your-facebook-app-secret
TWOCAPTCHA_TOKEN = your-2captcha-token
```

## 📋 Step-by-Step Setup

### 1. **Create MongoDB Database**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free account
3. Create new cluster (M0 free tier)
4. Create database user
5. Whitelist IP: `0.0.0.0/0` (all IPs)
6. Get connection string

### 2. **Get API Keys**

#### OpenAI API Key:
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create account and add billing
3. Generate new API key
4. Copy key starting with `sk-proj-...`

#### RapidAPI Key (for Facebook monitoring):
1. Go to [RapidAPI Facebook Scraper](https://rapidapi.com/neoscrap-net/api/facebook-scraper3)
2. Subscribe to free or paid plan
3. Copy your RapidAPI key

#### NewsAPI Key (optional):
1. Go to [NewsAPI.org](https://newsapi.org/register)
2. Register for free account
3. Copy API key

### 3. **Generate Secrets**
```bash
# For NEXTAUTH_SECRET (run in terminal):
openssl rand -base64 32

# For WEBHOOK_SECRET:
openssl rand -base64 32

# For CRON_SECRET:
openssl rand -base64 32
```

### 4. **Deploy to Vercel**

#### Method 1: GitHub Integration
1. **Connect GitHub**: Import `thailand-cambodia-monitor-APP` repo
2. **Add Environment Variables**: Paste all variables above
3. **Deploy**: Click deploy button
4. **Wait**: 3-5 minutes for deployment

#### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
# ... add all required variables

# Redeploy with environment variables
vercel --prod
```

## ⚙️ Vercel Configuration

### Build Settings:
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Functions Configuration (vercel.json):
```json
{
  "functions": {
    "app/api/**": {
      "maxDuration": 30
    }
  },
  "regions": ["sin1"]
}
```

## 🔄 Post-Deployment Setup

### 1. **Initialize Database**
After first deployment, visit these URLs to initialize:
- `https://your-app.vercel.app/api/admin/init-db` (creates database structure)
- `https://your-app.vercel.app/api/test` (tests basic functionality)

### 2. **Test Core Features**
- **Main Dashboard**: `https://your-app.vercel.app/`
- **Timeline**: `https://your-app.vercel.app/timeline`
- **Admin Panel**: `https://your-app.vercel.app/admin`

### 3. **Configure Monitoring**
1. Visit admin panel
2. Configure news sources
3. Test monitoring systems
4. Set update frequencies

## 🌐 Domain Configuration

### Custom Domain (Optional):
1. **Vercel Dashboard** → Project → Settings → Domains
2. **Add Domain**: your-domain.com
3. **Update DNS**: Add CNAME record pointing to Vercel
4. **Update Environment**: Change `NEXTAUTH_URL` to your domain

## 📊 Monitoring & Analytics

### Vercel Analytics:
- **Enable**: Dashboard → Analytics → Enable
- **Monitor**: Page views, performance, errors
- **Real-time**: View live traffic and performance

### Application Monitoring:
- **Admin Logs**: `/admin` → Monitoring Logs
- **API Health**: Built-in health checks
- **Error Tracking**: Automatic error reporting

## 🔧 Troubleshooting

### Common Deployment Issues:

#### Build Failures:
```bash
# Check build logs in Vercel dashboard
# Common fixes:
- Verify all environment variables are set
- Check TypeScript errors: npm run typecheck
- Ensure all dependencies installed: npm install
```

#### Database Connection Issues:
```bash
# Verify MongoDB Atlas setup:
- Connection string format correct
- Database user created with proper permissions
- IP whitelist includes 0.0.0.0/0
- Network access enabled
```

#### API Timeouts:
```bash
# Increase function timeout in vercel.json:
{
  "functions": {
    "app/api/**": {
      "maxDuration": 60
    }
  }
}
```

### Debug Mode:
Enable detailed logging by adding:
```bash
DEBUG = true
NODE_ENV = development
```

## 🚀 Performance Optimization

### Edge Functions:
- Automatic edge caching enabled
- Global CDN distribution
- Optimized image delivery

### Database Optimization:
- Connection pooling configured
- Query optimization enabled
- Automatic indexing

### Caching Strategy:
- Static assets cached globally
- API responses cached appropriately
- Database queries optimized

## 🔄 Updates & Maintenance

### Automatic Deployments:
- **Git Integration**: Push to main branch → Auto deploy
- **Branch Previews**: Feature branches get preview URLs
- **Rollback**: Easy rollback to previous versions

### Manual Updates:
- **Environment Variables**: Update in Vercel dashboard
- **Code Changes**: Push to GitHub → Auto deploy
- **Database Schema**: Run migrations via API

## 🎉 Success Checklist

After deployment, verify:
- [ ] **Main page loads**: Statistics display correctly
- [ ] **Timeline works**: Interactive timeline with events
- [ ] **Admin panel**: Accessible with password
- [ ] **Database connected**: Data loads and saves
- [ ] **AI analysis**: OpenAI integration working
- [ ] **Monitoring active**: News and Facebook monitoring
- [ ] **API endpoints**: All routes responding
- [ ] **Mobile responsive**: Works on mobile devices

## 📞 Support Resources

### Vercel Support:
- **Documentation**: https://vercel.com/docs
- **Discord**: https://vercel.com/discord
- **GitHub Issues**: https://github.com/vercel/vercel/issues

### Application Support:
- **Repository**: https://github.com/sivniv/thailand-cambodia-monitor-APP
- **Documentation**: README-DEPLOYMENT.md
- **Static Version**: https://github.com/sivniv/thailand-cambodia-monitor

---

## 🎯 Expected Result

After successful deployment:

**🌐 Your Live App**: `https://thailand-cambodia-monitor-app.vercel.app`

**Features Working**:
- ✅ Real-time conflict monitoring
- ✅ AI-powered content analysis  
- ✅ Interactive timeline with filtering
- ✅ Admin panel with full controls
- ✅ Automated news monitoring
- ✅ Mobile-responsive design
- ✅ Multi-language support
- ✅ Comprehensive analytics dashboard

**🚀 Ready for production use with full AI capabilities and real-time monitoring!**