# Facebook Graph API Setup Guide

## ✅ Phase 2 Implementation Complete!

Your system now supports **both** Facebook monitoring methods:
1. **RapidAPI Scraper** (Current, working)
2. **Facebook Graph API** (New, ready for configuration)

## Quick Start

### 1. Facebook Developer App Setup

1. **Visit**: https://developers.facebook.com/
2. **Create App**: Choose "Business" type
3. **Add Products**: Add "Facebook Login" and "Webhooks"
4. **Get Credentials**: Note your App ID and App Secret

### 2. Environment Variables

Add these to your `.env.local` file:

```bash
# Facebook Graph API (Required for Phase 2)
FACEBOOK_APP_ID="your_app_id_here"
FACEBOOK_APP_SECRET="your_app_secret_here"
FACEBOOK_ACCESS_TOKEN="your_access_token_here"
FACEBOOK_WEBHOOK_VERIFY_TOKEN="thailand-cambodia-monitor-webhook-2025"
```

### 3. Access Token Generation

**Option A: App Access Token (Public Pages)**
```
https://graph.facebook.com/oauth/access_token?client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&grant_type=client_credentials
```

**Option B: Page Access Token (Better)**
1. Use Graph API Explorer: https://developers.facebook.com/tools/explorer/
2. Select your app and get User Access Token
3. Use token to get Page Access Tokens for government pages

### 4. Webhook Configuration

1. **Webhook URL**: `https://yourdomain.com/api/webhook/facebook-graph`
2. **Verify Token**: `thailand-cambodia-monitor-webhook-2025`
3. **Subscribe to**: `feed` events
4. **Test Webhook**: Facebook will send verification request

## Current System Status

### ✅ **Working Features**

#### Phase 1: RapidAPI Integration
- ✅ Automated scheduling (every 30 minutes during business hours)
- ✅ Error handling with retry logic
- ✅ Admin dashboard control
- ✅ 5 government pages monitored
- ✅ Real-time status monitoring

#### Phase 2: Graph API Integration
- ✅ Official Facebook Graph API integration
- ✅ Webhook verification endpoint
- ✅ Real-time post processing
- ✅ Hybrid system (Graph API + RapidAPI fallback)
- ✅ Admin interface for Graph API control
- ✅ Connection testing and status monitoring

### 🔧 **How to Enable Graph API**

1. **Set up Facebook App** (follow steps above)
2. **Add environment variables** to `.env.local`
3. **Restart your server**: `npm run dev`
4. **Test connection** in Admin Dashboard → Monitoring Status
5. **Run Graph API monitoring** manually to test
6. **Enable webhooks** for real-time updates

## System Architecture

### Dual Monitoring System
```
┌─────────────────┐    ┌──────────────────┐
│   RapidAPI      │    │  Graph API       │
│   (Backup)      │    │  (Primary)       │
├─────────────────┤    ├──────────────────┤
│ • Reliable      │    │ • Real-time      │
│ • Working now   │    │ • Official API   │
│ • Fallback      │    │ • Webhooks       │
│ • No setup      │    │ • Higher limits  │
└─────────────────┘    └──────────────────┘
        │                       │
        └───────┬───────────────┘
                │
        ┌───────▼────────┐
        │  Unified       │
        │  Processing    │
        │  Pipeline      │
        └────────────────┘
```

### API Endpoints
- `/api/monitor/facebook` - RapidAPI monitoring (existing)
- `/api/monitor/facebook-graph` - Graph API monitoring (new)
- `/api/webhook/facebook-graph` - Real-time webhooks (new)
- `/api/scheduler` - Automated scheduling control

### Admin Dashboard
- **Scheduler Control**: Start/stop automated monitoring
- **Facebook Graph Control**: Test connection, run monitoring
- **System Health**: Monitor both API systems
- **Logs**: View all monitoring activity

## Benefits of Graph API

### 🚀 **Advantages**
- **Real-time Updates**: Instant notifications via webhooks
- **Official API**: Direct from Facebook, more reliable
- **Higher Rate Limits**: Better for frequent monitoring
- **Complete Data**: Full post content and metadata
- **No Third-party Dependency**: Direct Facebook access

### 📊 **Comparison**

| Feature | RapidAPI | Graph API |
|---------|----------|-----------|
| **Real-time** | ❌ | ✅ |
| **Official** | ❌ | ✅ |
| **Setup** | ✅ Easy | ⚠️ Requires App |
| **Rate Limits** | ⚠️ Limited | ✅ Higher |
| **Reliability** | ✅ Working | ✅ Better |
| **Cost** | 💰 Paid | 🆓 Free |

## Government Pages Monitored

### Thailand 🇹🇭
- Royal Thai Government
- Ministry of Foreign Affairs Thailand
- Prime Minister of Thailand

### Cambodia 🇰🇭
- Royal Government of Cambodia
- Ministry of Foreign Affairs Cambodia

## Troubleshooting

### Common Issues

**1. "Facebook App ID and App Secret are required"**
- Solution: Add credentials to `.env.local` and restart server

**2. "Connection test failed"**
- Check your App ID and App Secret
- Ensure app is active in Facebook Developer Console
- Verify access token is valid

**3. "Webhook verification failed"**
- Check webhook URL is accessible
- Verify token matches in both Facebook and `.env.local`
- Ensure HTTPS for production webhooks

**4. "No posts found"**
- Government pages may have limited public content
- Try with a test page first
- Check page privacy settings

### Testing Steps

1. **Test Connection**: Admin → Monitoring Status → Test Connection
2. **Manual Run**: Click "Run Graph API Monitoring"
3. **Check Logs**: Monitor system logs for errors
4. **Webhook Test**: Use Facebook's webhook tester
5. **Compare Results**: Compare RapidAPI vs Graph API results

## Next Steps

1. **Set up Facebook Developer App**
2. **Add environment variables**
3. **Test connection**
4. **Enable webhooks for real-time monitoring**
5. **Monitor system performance**
6. **Consider phasing out RapidAPI once Graph API is stable**

## Security Notes

- **Environment Variables**: Never commit credentials to version control
- **Webhook Verification**: Always verify webhook signatures
- **Access Tokens**: Use page-specific tokens when possible
- **HTTPS Required**: Production webhooks must use HTTPS
- **Token Rotation**: Regularly rotate access tokens

---

**Status**: ✅ Ready for production deployment with proper Facebook App configuration