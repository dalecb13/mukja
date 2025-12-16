# Debug RLS Role Issue

## Problem

Getting "new row violates row-level security policy" even though SQL insert as `anon` works.

This means PostgREST (REST API) is using a different role than `anon`.

## Solution 1: Check What Role PostgREST Is Using

Run this in Supabase SQL Editor to see what role is being used:

```sql
-- Create a function to log the current role
CREATE OR REPLACE FUNCTION get_current_role()
RETURNS text AS $$
BEGIN
  RETURN current_setting('request.jwt.claim.role', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check current role
SELECT get_current_role();
```

## Solution 2: Make Policy More Permissive

If PostgREST isn't recognizing the anon role, try making the policy work for all roles:

```sql
-- Drop existing policy
DROP POLICY IF EXISTS "Allow anonymous inserts with valid email" ON waitlist;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON waitlist;

-- Create policy that works for any role (including unauthenticated)
CREATE POLICY "Allow inserts for all" 
ON "public"."waitlist"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (true);
```

## Solution 3: Check JWT Secret Configuration

The issue might be that Supabase's JWT secret doesn't match. Check:

1. Go to Supabase Dashboard → Settings → API
2. Look for "JWT Secret" 
3. Make sure it matches what PostgREST expects

## Solution 4: Use Service Role for API Routes (Not Recommended)

**⚠️ Only for debugging - never expose service_role in client code!**

Temporarily test if the issue is with anon key:

```typescript
// In your API route, temporarily use service_role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role bypasses RLS
  {
    auth: { persistSession: false },
  }
);
```

If this works, the issue is specifically with anon key authentication.

## Solution 5: Verify Policy Targets Correct Role

Check your current policy:

```sql
SELECT 
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'waitlist';
```

Make sure `roles` includes `{anon}` or `{public}`.

## Solution 6: Try Policy Without Email Validation

Temporarily remove email validation to see if that's the issue:

```sql
DROP POLICY IF EXISTS "Allow anonymous inserts with valid email" ON waitlist;

CREATE POLICY "Allow anonymous inserts" 
ON "public"."waitlist"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (true);
```

If this works, the email regex in the policy might be the issue.

## Most Likely Fix

Try **Solution 2** first - make the policy work for `TO public` with `WITH CHECK (true)`. This should work regardless of what role PostgREST is using.




