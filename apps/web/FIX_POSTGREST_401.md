# Fix PostgREST 401 When RLS Works

## Problem

- ✅ Step 4 (SQL insert as anon) works → RLS is configured correctly
- ❌ Step 3 (REST API curl) fails → PostgREST authentication issue

This means the database permissions are fine, but PostgREST (Supabase's REST API layer) isn't authenticating correctly.

## Solution 1: Verify API Key Format

The anon key should be a long JWT token. Check:

1. **Key Length:** Should be ~200+ characters
2. **Format:** Should start with `eyJ` (base64 encoded JWT)
3. **No Quotes:** Don't wrap it in quotes in Vercel

**Test:**
```bash
# Check if key looks like a JWT
echo $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | head -c 20
# Should output: eyJ...
```

## Solution 2: Check Supabase Project Settings

1. Go to Supabase Dashboard → Settings → API
2. Verify:
   - **Project URL** matches your `NEXT_PUBLIC_SUPABASE_URL`
   - **publishable** key matches your `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Check if **API is enabled** (should be by default)

## Solution 3: Test with Different Headers

Try this curl command with explicit role header:

```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/rest/v1/waitlist' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{"email":"test@example.com","source":"test"}'
```

## Solution 4: Check PostgREST Schema

PostgREST might not be exposing the table. Check:

```sql
-- Verify table is in public schema
SELECT schemaname, tablename 
FROM pg_tables 
WHERE tablename = 'waitlist';
-- Should show: public | waitlist
```

## Solution 5: Use Supabase Client with Explicit Options

Update the Supabase client to explicitly set the schema:

```typescript
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: 'public', // Explicitly set schema
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
```

## Solution 6: Check for API Rate Limiting

Supabase might be rate limiting. Check:
- Supabase Dashboard → Settings → API
- Look for rate limit settings
- Check if you've hit any limits

## Solution 7: Verify Table Name Case

PostgREST is case-sensitive. Make sure:
- Table name in database: `waitlist` (lowercase)
- Table name in code: `waitlist` (lowercase)
- No quotes around table name in queries

## Solution 8: Test with Service Role (Temporary)

**⚠️ WARNING: Only for debugging, never expose service_role key!**

Temporarily test with service_role key to see if it's an anon key issue:

```bash
# This should work (bypasses RLS)
curl -X POST 'https://YOUR_PROJECT.supabase.co/rest/v1/waitlist' \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"test"}'
```

If this works, the issue is specifically with the anon key authentication.

## Most Likely Fix

Based on your symptoms (SQL works, REST fails), try **Solution 5** - explicitly setting the schema in the Supabase client configuration.

