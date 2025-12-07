# Troubleshooting 401 45201 Error in Production

## The Problem

You're getting a `401` error with PostgreSQL error code `45201` when trying to add an email to the waitlist anonymously in production. Error code `45201` is a PostgREST JWT authentication error.

## What is Error 45201?

Error code `45201` indicates a JWT (JSON Web Token) authentication failure in PostgREST. This typically means:
- The JWT token is missing, invalid, or expired
- The JWT secret doesn't match between your app and Supabase
- The token format is incorrect

## Common Causes in Production

### 1. Wrong API Key in Production Environment

**Issue**: Using the wrong key type or an incorrect publishable key in production.

**Solution**:
1. Go to your deployment platform (Vercel, etc.)
2. Check environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` should match your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` should be the **publishable** key (not secret key)
3. Verify in Supabase Dashboard → Settings → API:
   - Copy the **Publishable key** (not Secret key)
   - Ensure it matches your production environment variable

### 2. Anonymous Authentication Not Enabled

**Issue**: Anonymous authentication might be disabled in your Supabase project.

**Solution**:
1. Go to Supabase Dashboard → **Authentication → Providers**
2. Find **Anonymous** provider
3. Ensure it's **enabled**
4. Save changes
5. Try again

### 3. Environment Variables Not Set in Production

**Issue**: Environment variables might not be configured correctly in your deployment platform.

**Solution**:
- **Vercel**: Go to Project Settings → Environment Variables
- Ensure variables are set for **Production**, **Preview**, and **Development**
- Redeploy after adding/changing variables
- Verify variables are available at runtime (check deployment logs)

### 4. JWT Secret Mismatch

**Issue**: The JWT secret used to sign tokens doesn't match what Supabase expects.

**Solution**:
- This is usually not something you configure directly
- Ensure you're using the correct Supabase project
- If you have multiple Supabase projects, verify you're using the right one
- Check that your `NEXT_PUBLIC_SUPABASE_URL` matches the project

### 5. Anonymous Sign-In Failing Silently

**Issue**: The anonymous sign-in might be failing, but the error isn't being caught properly.

**Solution**: The code now includes proper error handling for anonymous sign-in. Check your production logs for:
- "Anonymous sign-in error" messages
- "Anonymous sign-in succeeded but no session returned"
- "Session not found on client after anonymous sign-in"

### 6. RLS Policy Blocking Anonymous Users

**Issue**: Even though you're signing in anonymously, the RLS policy might not allow the `anon` role.

**Check your RLS policy**:
```sql
-- Should allow 'anon' role, not 'authenticated' or 'public'
SELECT policyname, roles, cmd, with_check 
FROM pg_policies 
WHERE tablename = 'waitlist';

-- Correct policy for anonymous inserts:
CREATE POLICY "Allow anonymous inserts" 
ON waitlist 
FOR INSERT 
TO anon  -- Must be 'anon', not 'authenticated'
WITH CHECK (true);
```

### 7. Session Not Persisting Between Sign-In and Insert

**Issue**: The session from `signInAnonymously()` might not be used for the database operation.

**Solution**: The code now verifies the session exists before attempting the insert. If you see "Session not found on client after anonymous sign-in" in logs, this indicates a session persistence issue.

## Debugging Steps

### Step 1: Check Production Logs

Look for these log messages in your deployment platform:
- "Supabase config check" - Shows if environment variables are set
- "Anonymous sign-in successful" - Confirms sign-in worked
- "Anonymous sign-in error" - Shows why sign-in failed
- "Supabase error details" - Shows the actual error from Supabase

### Step 2: Verify Environment Variables

In your deployment platform, verify:
```bash
# Should be set and match Supabase dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

### Step 3: Test Anonymous Sign-In Directly

You can test if anonymous sign-in works by checking Supabase Dashboard → Authentication → Users. After a failed request, check if an anonymous user was created.

### Step 4: Check Supabase Project Settings

1. Go to Supabase Dashboard → Settings → API
2. Verify:
   - Project URL matches `NEXT_PUBLIC_SUPABASE_URL`
   - Publishable key matches `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Go to Authentication → Providers
4. Verify Anonymous is enabled

### Step 5: Check RLS Policies

Run in Supabase SQL Editor:
```sql
-- List all policies
SELECT * FROM pg_policies WHERE tablename = 'waitlist';

-- Check if anon role has INSERT permission
SELECT grantee, privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'waitlist' AND grantee = 'anon';
```

## Most Likely Causes (in order)

1. **Wrong API key in production** - Using secret key instead of publishable key, or wrong project
2. **Environment variables not set** - Missing or incorrect in deployment platform
3. **Anonymous authentication disabled** - Not enabled in Supabase dashboard
4. **RLS policy checking wrong role** - Policy expects `authenticated` instead of `anon`

## Quick Fix Checklist

- [ ] Verify `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is set in production (not `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] Verify the publishable key matches your Supabase project
- [ ] Enable Anonymous authentication in Supabase Dashboard
- [ ] Check RLS policy allows `anon` role (not `authenticated`)
- [ ] Redeploy after changing environment variables
- [ ] Check production logs for specific error messages
- [ ] Verify environment variables are available at runtime (not just build time)

## Production-Specific Considerations

### Vercel

- Environment variables must be set in Vercel dashboard
- Variables starting with `NEXT_PUBLIC_` are available at build time and runtime
- After adding/changing variables, you must redeploy
- Check deployment logs to see if variables are being read

### Other Platforms

- Ensure environment variables are set for the production environment
- Some platforms require separate configuration for build vs runtime
- Check platform-specific documentation for environment variable setup

## Still Not Working?

If you've checked all the above:

1. **Compare local vs production**:
   - Does it work locally?
   - What's different between local and production?
   - Are you using the same Supabase project?

2. **Check Supabase logs**:
   - Go to Supabase Dashboard → Logs → PostgREST
   - Look for the actual request and error details
   - This will show the exact SQL and role being used

3. **Test with a simple query**:
   - Try a SELECT query first to see if authentication works at all
   - This helps isolate if it's an INSERT-specific issue or general auth issue

4. **Contact Supabase support**:
   - If all else fails, Supabase support can check your project configuration
   - Provide them with the error code (45201) and your project details

