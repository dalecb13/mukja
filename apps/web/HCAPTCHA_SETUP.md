# hCaptcha Setup Guide

## 1. Get hCaptcha Keys

1. Go to [hCaptcha Dashboard](https://dashboard.hcaptcha.com/)
2. Sign up or log in
3. Create a new site
4. Get your keys:
   - **Site Key** (public) → `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
   - **Secret Key** (private) → `HCAPTCHA_SECRET_KEY`

## 2. Add Environment Variables

### Local Development (`.env.local`)

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-site-key-here
HCAPTCHA_SECRET_KEY=your-secret-key-here
```

### Vercel Deployment

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` = your site key
   - `HCAPTCHA_SECRET_KEY` = your secret key
3. Enable for Production, Preview, and Development
4. Redeploy

## 3. How It Works

1. **Frontend**: User completes hCaptcha challenge
2. **Frontend**: Captcha token is sent to API route
3. **Backend**: API route verifies token with hCaptcha API
4. **Backend**: If valid, proceed with Supabase insert
5. **Backend**: If invalid, return error

## 4. Testing

### Test Mode

hCaptcha provides test keys for development:

- **Site Key**: `10000000-ffff-ffff-ffff-000000000001`
- **Secret Key**: `0x0000000000000000000000000000000000000000`

These always pass verification in test mode.

### Production

Use your real keys from the hCaptcha dashboard.

## 5. Troubleshooting

### Issue: "Captcha verification required"

**Fix:** Make sure `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` is set and the component is rendering.

### Issue: "Captcha verification failed"

**Fix:** 
- Check that `HCAPTCHA_SECRET_KEY` is set correctly
- Verify the token hasn't expired (tokens expire after a few minutes)
- Check hCaptcha dashboard for any errors

### Issue: Captcha not showing

**Fix:**
- Check browser console for errors
- Verify `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` is set
- Make sure the site key is correct (not the secret key)

## 6. Security Notes

- ✅ **Site Key** is safe to expose in client code (it's public)
- ❌ **Secret Key** must NEVER be exposed (server-side only)
- The secret key is only used in the API route to verify tokens
- Tokens are single-use and expire after a few minutes



