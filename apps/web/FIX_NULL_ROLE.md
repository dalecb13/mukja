# Fix Null Role Issue in PostgREST

## Problem

`get_current_role()` returns `null` → PostgREST isn't decoding the JWT role properly.

This means:
- The JWT from the anon key isn't being decoded
- PostgREST can't determine what role to use
- RLS policies fail because there's no role to match

## Root Cause

PostgREST extracts the role from the JWT claim `role`. If it's null, either:
1. The JWT doesn't contain a `role` claim
2. PostgREST can't decode the JWT (wrong secret)
3. The JWT format is incorrect

## Solution 1: Create Policy That Works Without Role

Create a policy that works even when role is null:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Allow inserts for all" ON waitlist;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON waitlist;

-- Create policy that works for ANY role (including null/unauthenticated)
CREATE POLICY "Allow unauthenticated inserts" 
ON "public"."waitlist"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (true);
```

The `TO public` should work even if the role is null, but if it doesn't, try:

## Solution 2: Use DEFAULT Role Policy

PostgREST might be using a default role. Check Supabase settings:

1. Go to Supabase Dashboard → Settings → API
2. Look for "Default Role" or "Anonymous Role"
3. Make sure it's set to `anon`

## Solution 3: Check JWT Secret

The JWT secret might be misconfigured:

1. Go to Supabase Dashboard → Settings → API
2. Check "JWT Secret"
3. This should match what PostgREST uses to decode JWTs

If you changed the JWT secret, PostgREST won't be able to decode the anon key's JWT.

## Solution 4: Verify Anon Key Format

The anon key should be a valid JWT. Test it:

```sql
-- Decode the JWT to see what's in it
-- (You'll need to use a JWT decoder tool or check Supabase dashboard)
```

The anon key JWT should contain:
- `role: "anon"` or `role: "anon,authenticated"`
- Other standard JWT claims

## Solution 5: Use Service Role (Temporary Debug)

**⚠️ WARNING: Only for debugging!**

Temporarily test with service_role to confirm it's a role issue:

```typescript
// In API route, temporarily
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Bypasses RLS
  { auth: { persistSession: false } }
);
```

If this works, the issue is definitely with anon key JWT decoding.

## Solution 6: Check PostgREST Configuration

PostgREST might need explicit role configuration. Check if there's a way to set default role in Supabase project settings.

## Most Likely Fix

**Solution 1** should work - `TO public` should include requests with null role. But if it doesn't, the issue is that PostgREST needs to be configured to use `anon` as the default role for unauthenticated requests.

## Alternative: Disable RLS Temporarily

If nothing else works, you can temporarily disable RLS to confirm that's the issue:

```sql
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;
```

**⚠️ Only for testing!** Re-enable it after testing:
```sql
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
```




