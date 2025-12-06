# Troubleshooting 401 Errors with Supabase

## Common Causes of 401 Errors

### 1. Environment Variables Not Set in Vercel

**Most Common Issue!**

Check that these are set in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Fix:**
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Add both variables
4. Enable for Production, Preview, and Development
5. Redeploy

### 2. Wrong API Key

**Issue:** Using the wrong key type

**Fix:** Make sure you're using the **anon/public** key, NOT the service_role key.

- ✅ Use: `anon` or `public` key (safe for client-side)
- ❌ Don't use: `service_role` key (bypasses RLS, should never be exposed)

**Where to find it:**
- Supabase Dashboard → Settings → API
- Look for "anon public" key

### 3. API Key Format Issues

**Issue:** Key might have extra spaces or be truncated

**Fix:**
- Copy the key directly from Supabase dashboard
- Don't add quotes around it in Vercel
- Make sure there are no leading/trailing spaces

### 4. RLS Policy Not Configured

**Issue:** RLS is enabled but no policy allows inserts

**Fix:** Run this SQL in Supabase SQL Editor:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'waitlist';

-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'waitlist';

-- Create policy if missing
CREATE POLICY "Allow anonymous inserts" 
ON "public"."waitlist"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (true);
```

### 5. Supabase Client Configuration

**Issue:** Client not properly configured for server-side usage

**Fix:** The code now creates a fresh client per request. Make sure you're using `createServerClient()` in API routes.

### 6. Network/Firewall Issues

**Issue:** Vercel might be blocking requests to Supabase

**Fix:** 
- Check Vercel logs for network errors
- Verify Supabase project is not paused
- Check Supabase project status

## Debugging Steps

### Step 1: Check Environment Variables

Add this to your API route temporarily to verify:

```typescript
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING");
console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING");
```

### Step 2: Check Supabase Logs

1. Go to Supabase Dashboard
2. Logs → API Logs
3. Look for 401 errors
4. Check the request details

### Step 3: Test Directly

Test the Supabase connection directly:

```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/rest/v1/waitlist' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"email":"test@example.com","source":"test"}'
```

**If this fails but Step 4 works**, the issue is with PostgREST/API layer, not RLS. Common causes:
- API key format issue
- PostgREST not recognizing the anon role
- Schema/table name mismatch

**Try this alternative curl with verbose output:**
```bash
curl -v -X POST 'https://YOUR_PROJECT.supabase.co/rest/v1/waitlist' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"email":"test@example.com","source":"test"}'
```

The `-v` flag will show the full HTTP response including the error message.

### Step 4: Verify RLS Policy

```sql
-- Test as anonymous user
SET ROLE anon;
INSERT INTO waitlist (email, source) VALUES ('test@example.com', 'test');
RESET ROLE;
```

If this fails, your RLS policy is the issue.

## Quick Fix Checklist

- [ ] Environment variables set in Vercel
- [ ] Using anon/public key (not service_role)
- [ ] RLS policy exists and allows `TO public` or `TO anon`
- [ ] Supabase project is active (not paused)
- [ ] No typos in environment variable names
- [ ] Redeployed after setting environment variables

