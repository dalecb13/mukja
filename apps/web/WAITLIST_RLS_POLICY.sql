-- RLS Policy for Waitlist Table
-- Allows anonymous users to insert rows with valid email addresses

-- Step 1: Enable Row Level Security (if not already enabled)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow anonymous inserts with valid email" ON waitlist;
DROP POLICY IF EXISTS "Allow people to sign up for the waitlist" ON waitlist;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON waitlist;

-- Step 3: Create the policy
-- This policy allows anonymous users (public) to insert rows
-- but only if the email is valid (not null and matches email pattern)
CREATE POLICY "Allow anonymous inserts with valid email" 
ON "public"."waitlist"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (
  email IS NOT NULL 
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- Alternative: Simpler version without email validation in RLS
-- (validation happens in your API, but RLS allows all inserts)
-- CREATE POLICY "Allow anonymous inserts" 
-- ON "public"."waitlist"
-- AS PERMISSIVE
-- FOR INSERT
-- TO public
-- WITH CHECK (true);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'waitlist';






