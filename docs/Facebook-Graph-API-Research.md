# Facebook Graph API Integration Research

## Current Status
- ✅ **Phase 1 Complete**: Automated scheduling with RapidAPI Facebook Scraper3
- 🔄 **Phase 2 Research**: Facebook Graph API integration for better reliability

## Facebook Graph API Requirements

### 1. App Registration & Permissions
- **Facebook Developer Account**: Required
- **Facebook App**: Create app for Business/Other type
- **App Review**: May need review for certain permissions
- **Required Permissions**:
  - `pages_read_engagement` - Read public page posts
  - `pages_show_list` - List pages (if managing multiple)

### 2. Access Tokens
- **Page Access Tokens**: Long-lived tokens for specific pages
- **App Access Token**: For app-level operations
- **User Access Token**: If accessing user-managed pages

### 3. API Endpoints for Page Monitoring
```
GET /{page-id}/posts
GET /{page-id}/feed  
GET /{post-id}
GET /{page-id}
```

### 4. Webhooks Setup
- **Webhook URL**: `https://yourdomain.com/api/webhook/facebook`
- **Verify Token**: Random string for webhook verification
- **Subscribed Fields**: `feed`, `posts`
- **Page Subscriptions**: Subscribe to specific pages

## Implementation Plan for Phase 2

### Step 1: Facebook App Setup
1. Create Facebook Developer App
2. Configure Basic Settings
3. Add Facebook Login product
4. Set up Webhooks product

### Step 2: Token Management
1. Generate Page Access Tokens
2. Implement token refresh logic
3. Store tokens securely (environment variables)

### Step 3: Webhook Implementation
1. Create webhook verification endpoint
2. Handle incoming webhook events
3. Process page post updates in real-time

### Step 4: Graph API Integration
1. Replace RapidAPI calls with Graph API
2. Implement proper error handling
3. Add rate limiting compliance

## Benefits vs Current System

### Graph API Advantages
- ✅ **Official API**: Direct from Facebook
- ✅ **Real-time Webhooks**: Instant notifications
- ✅ **Higher Rate Limits**: More reliable access
- ✅ **Better Data Quality**: Complete post data
- ✅ **No Third-party Dependency**: Direct access

### Current RapidAPI Advantages
- ✅ **Simple Setup**: Already working
- ✅ **No App Review**: Immediate access
- ✅ **Page ID Discovery**: Can find page IDs easily

## Migration Strategy

### Hybrid Approach (Recommended)
1. **Keep RapidAPI as Backup**: For reliability
2. **Primary Graph API**: For real-time updates
3. **Fallback Logic**: Switch to RapidAPI if Graph API fails
4. **Gradual Migration**: Test with one page first

### Implementation Timeline
- **Week 1**: App setup and token generation
- **Week 2**: Webhook implementation and testing
- **Week 3**: Graph API integration
- **Week 4**: Hybrid system testing and deployment

## Technical Considerations

### Rate Limits
- **Graph API**: 200 calls per hour per user
- **RapidAPI**: Variable based on plan
- **Solution**: Implement request queuing and caching

### Error Handling
- **Token Expiration**: Implement refresh mechanism
- **API Downtime**: Fallback to RapidAPI
- **Webhook Failures**: Retry logic with exponential backoff

### Security
- **Webhook Verification**: Validate incoming requests
- **Token Storage**: Use environment variables
- **HTTPS Required**: For webhook endpoints

## Next Steps
1. Create Facebook Developer App
2. Get Page Access Tokens for government pages
3. Implement webhook verification endpoint
4. Test with one page before full rollout

## Government Pages to Monitor

### Thai Government
- Royal Thai Government
- Ministry of Foreign Affairs Thailand  
- Prime Minister of Thailand

### Cambodian Government
- Royal Government of Cambodia
- Ministry of Foreign Affairs Cambodia

### Required Information
- Page IDs (can get from current RapidAPI)
- Page Access Tokens (need Facebook App)
- Webhook subscriptions (need app setup)