-- Fix "new row violates row-level security policy" Error
-- Run this in Supabase SQL Editor
-- 
-- If get_current_role() returns null, PostgREST isn't decoding the JWT role.
-- This policy should work even when role is null.

-- Step 1: Drop ALL existing policies
DROP POLICY IF EXISTS "Allow anonymous inserts with valid email" ON waitlist;
DROP POLICY IF EXISTS "Allow people to sign up for the waitlist" ON waitlist;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON waitlist;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON waitlist;
DROP POLICY IF EXISTS "Allow inserts for all" ON waitlist;
DROP POLICY IF EXISTS "Allow unauthenticated inserts" ON waitlist;

-- Step 2: Create policy that works even with null role
-- TO public should work for any role, including null/unauthenticated
CREATE POLICY "Allow unauthenticated inserts" 
ON "public"."waitlist"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (true);

-- Alternative: If TO public doesn't work, try this (allows any role including null)
-- CREATE POLICY "Allow unauthenticated inserts" 
-- ON "public"."waitlist"
-- AS PERMISSIVE
-- FOR INSERT
-- WITH CHECK (true);

-- Step 3: Verify the policy
SELECT 
  policyname,
  roles,
  cmd,
  with_check
FROM pg_policies 
WHERE tablename = 'waitlist';

-- Expected output:
-- policyname: "Allow inserts for all"
-- roles: {public}
-- cmd: INSERT
-- with_check: true

-- Step 4: Test the policy
-- This should work now
SET ROLE anon;
INSERT INTO waitlist (email, source) VALUES ('test@example.com', 'test');
RESET ROLE;

-- If Step 4 works but REST API still fails, the issue is with PostgREST JWT decoding
-- In that case, check Supabase Dashboard → Settings → API → JWT Secret

