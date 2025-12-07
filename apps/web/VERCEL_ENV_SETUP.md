# Vercel Environment Variables Setup

## 401 Error Fix

If you're getting a 401 error from Supabase, it's likely because the environment variables aren't set in Vercel.

## Steps to Fix:

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Go to Settings → Environment Variables

2. **Add these variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
   ```

3. **Important Settings:**
   - ✅ Check "Production"
   - ✅ Check "Preview" 
   - ✅ Check "Development"
   - This ensures the variables are available in all environments

4. **Redeploy:**
   - After adding variables, trigger a new deployment
   - Or wait for the next automatic deployment

## Verify Variables Are Set:

You can verify in your Vercel deployment logs:
- Look for any warnings about missing Supabase variables
- Check the build logs for "Supabase configuration missing"

## Get Your Supabase Keys:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Common Issues:

### Issue: Variables set but still getting 401

**Solution:** Make sure you're using the **publishable** key, NOT the secret key. The secret key bypasses RLS and should never be exposed in client-side code.

### Issue: Variables not available in API routes

**Solution:** Make sure the variable names start with `NEXT_PUBLIC_` for them to be available in both client and server code. However, for API routes, you can also use non-prefixed variables, but `NEXT_PUBLIC_` works for both.

### Issue: Different behavior in local vs Vercel

**Solution:** 
- Local: Uses `.env.local`
- Vercel: Uses Environment Variables from dashboard
- Make sure both are set with the same values

