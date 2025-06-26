# Deployment Configuration Guide

## Environment Variables Setup

### 1. Local Development (.env file)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_REVENUECAT_API_KEY=your_revenuecat_api_key
```

### 2. Netlify Deployment

#### Option A: Netlify Dashboard (Recommended)
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add the following variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anonymous key
   - `VITE_REVENUECAT_API_KEY` = your RevenueCat public API key

#### Option B: Netlify CLI
```bash
netlify env:set VITE_SUPABASE_URL "your_supabase_url"
netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_anon_key"
netlify env:set VITE_REVENUECAT_API_KEY "your_revenuecat_api_key"
```

### 3. Supabase Configuration

#### Edge Functions (if using server-side RevenueCat)
If you plan to use Supabase Edge Functions for server-side RevenueCat operations:

1. In your Supabase dashboard, go to **Settings** > **API**
2. Add environment variables for Edge Functions:
   - `REVENUECAT_SECRET_KEY` = your RevenueCat secret key (for server-side operations)

#### Database Secrets (if storing RevenueCat data)
For storing RevenueCat webhook secrets or configuration:

1. Go to **Settings** > **Vault** in Supabase
2. Add secrets:
   - `revenuecat_webhook_secret` = your webhook secret
   - `revenuecat_app_id` = your RevenueCat app ID

### 4. RevenueCat Dashboard Configuration

#### Webhook Setup
1. In RevenueCat dashboard, go to **Integrations** > **Webhooks**
2. Add webhook URL: `https://your-site.netlify.app/api/revenuecat-webhook`
3. Select events: `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `EXPIRATION`
4. Copy the webhook secret for your environment variables

#### App Configuration
1. Go to **Apps** in RevenueCat dashboard
2. Configure your app with:
   - Bundle ID/Package Name
   - App Store Connect/Google Play Console integration
   - Products and pricing

## Security Best Practices

### Client-Side vs Server-Side Keys
- **Client-side (VITE_REVENUECAT_API_KEY)**: Use RevenueCat's **public** API key
- **Server-side (Edge Functions)**: Use RevenueCat's **secret** API key

### Environment Variable Naming
- All client-side variables must start with `VITE_` for Vite to include them
- Server-side variables (Edge Functions) don't need the `VITE_` prefix

### Key Rotation
- Regularly rotate your API keys
- Update all deployment environments when rotating keys
- Test thoroughly after key rotation

## Deployment Checklist

### Before Deploying:
- [ ] RevenueCat app configured with products
- [ ] Webhook endpoint set up and tested
- [ ] Environment variables set in Netlify
- [ ] Supabase environment variables configured (if using Edge Functions)
- [ ] Test purchases in sandbox mode

### After Deploying:
- [ ] Verify environment variables are loaded correctly
- [ ] Test subscription flow end-to-end
- [ ] Verify webhook events are received
- [ ] Check error logging and monitoring
- [ ] Test in production mode (if ready)

## Troubleshooting

### Common Issues:
1. **"RevenueCat not initialized"**: Check if `VITE_REVENUECAT_API_KEY` is set
2. **"Invalid API key"**: Ensure you're using the correct key for your environment
3. **Webhook not receiving events**: Verify webhook URL and secret configuration
4. **Purchase flow fails**: Check product IDs match between RevenueCat and your app

### Debug Commands:
```bash
# Check environment variables in Netlify build
netlify env:list

# Test local environment
npm run dev

# Check build output for environment variables
npm run build && grep -r "VITE_" dist/
```