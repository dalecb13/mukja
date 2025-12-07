# Troubleshooting 403 42501 Error with Supabase RLS

## The Problem

You're getting a `403` error with PostgreSQL error code `42501` (permission denied) when trying to insert into the waitlist table, even though:
- PostgREST is configured correctly
- RLS policies are set up
- Environment variables are correct
- Anonymous sign-in succeeds

## Potential Causes & Solutions

### 1. Session Not Being Used After Anonymous Sign-In

**Issue**: The session from `signInAnonymously()` might not be automatically attached to subsequent database operations.

**Solution**: The Supabase client should automatically use the session after `signInAnonymously()`, but there might be a timing issue. Try explicitly setting the session:

```typescript
// After signInAnonymously()
if (authData.session) {
  // The session should be automatically set, but verify it's there
  const { data: sessionData } = await supabase.auth.getSession();
  console.log("Current session:", sessionData.session?.access_token ? "EXISTS" : "MISSING");
}
```

### 2. RLS Policy Checking for Wrong Role

**Issue**: Your RLS policy might be checking for `authenticated` role, but anonymous users have the `anon` role.

**Check your RLS policy**:
```sql
-- Check what role the policy expects
SELECT * FROM pg_policies WHERE tablename = 'waitlist';

-- The policy should allow 'anon' role, not 'authenticated'
-- Correct policy for anonymous inserts:
CREATE POLICY "Allow anonymous inserts" 
ON waitlist 
FOR INSERT 
TO anon  -- NOT 'authenticated' or 'public'
WITH CHECK (true);
```

### 3. Anonymous Authentication Not Enabled

**Issue**: Anonymous authentication might not be enabled in Supabase.

**Solution**:
1. Go to Supabase Dashboard → **Authentication → Providers**
2. Find **Anonymous** provider
3. Ensure it's **enabled**
4. Save changes

### 4. RLS Policy Using `auth.uid()` on Anonymous Users

**Issue**: If your RLS policy uses `auth.uid()`, it might return `NULL` for anonymous users, causing the policy to fail.

**Check your policy**:
```sql
-- This might fail for anonymous users:
CREATE POLICY "Allow inserts" 
ON waitlist 
FOR INSERT 
TO anon
WITH CHECK (auth.uid() IS NOT NULL);  -- ❌ This will fail for anonymous users

-- Correct policy for anonymous users:
CREATE POLICY "Allow anonymous inserts" 
ON waitlist 
FOR INSERT 
TO anon
WITH CHECK (true);  -- ✅ Allow all anonymous inserts
```

### 5. Session Token Not Being Passed to PostgREST

**Issue**: The access token from the anonymous session might not be included in the database request headers.

**Debug**: Add logging to verify the session is being used:

```typescript
// After signInAnonymously()
if (authData.session) {
  console.log("Session token exists:", !!authData.session.access_token);
  console.log("Session user ID:", authData.user?.id);
  
  // Verify the client has the session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.error("Session not found on client after sign-in!");
  }
}
```

### 6. Multiple Supabase Client Instances

**Issue**: Creating a new client instance might not share the session from the previous sign-in.

**Solution**: Make sure you're using the same client instance for both sign-in and database operations:

```typescript
// ✅ Correct: Use the same client
const supabase = createServerClient();
await supabase.auth.signInAnonymously();
await supabase.from("waitlist").insert([...]);

// ❌ Wrong: Creating new clients
const supabase1 = createServerClient();
await supabase1.auth.signInAnonymously();
const supabase2 = createServerClient();  // New instance won't have the session
await supabase2.from("waitlist").insert([...]);
```

### 7. RLS Policy Using `current_setting('request.jwt.claim.role')`

**Issue**: The role might not be set correctly in the JWT for anonymous users.

**Debug**: Check what role PostgREST sees:

```sql
-- Run this in Supabase SQL Editor to see what role is being used
SELECT current_setting('request.jwt.claim.role', true) as role;
-- Should return 'anon' for anonymous users
```

### 8. Schema Permissions Not Granted

**Issue**: The `anon` role might not have INSERT permissions on the table.

**Solution**: Grant explicit permissions:

```sql
-- Grant INSERT permission to anon role
GRANT INSERT ON TABLE waitlist TO anon;

-- Also ensure USAGE on the schema
GRANT USAGE ON SCHEMA public TO anon;
```

### 9. Column-Level Permissions

**Issue**: Even if table-level permissions are correct, column-level restrictions might block the insert.

**Check**: Verify all columns you're inserting are accessible:

```sql
-- Check column permissions
SELECT column_name, privilege_type 
FROM information_schema.column_privileges 
WHERE table_name = 'waitlist' AND grantee = 'anon';
```

### 10. RLS Policy Using `auth.role()` Instead of Role Name

**Issue**: Some RLS policies check `auth.role()` which might not work as expected.

**Solution**: Use explicit role names in policies:

```sql
-- ✅ Correct: Explicit role name
CREATE POLICY "Allow anonymous inserts" 
ON waitlist 
FOR INSERT 
TO anon
WITH CHECK (true);

-- ❌ Might not work: Using auth.role()
CREATE POLICY "Allow anonymous inserts" 
ON waitlist 
FOR INSERT 
WITH CHECK (auth.role() = 'anon');
```

## Debugging Steps

### Step 1: Verify Anonymous Sign-In Works

Add detailed logging:

```typescript
const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

console.log("Sign-in result:", {
  hasUser: !!authData.user,
  hasSession: !!authData.session,
  userId: authData.user?.id,
  hasAccessToken: !!authData.session?.access_token,
  error: authError,
});
```

### Step 2: Verify Session Persists

```typescript
// After sign-in, check if session is on the client
const { data: { session } } = await supabase.auth.getSession();
console.log("Client session:", {
  exists: !!session,
  userId: session?.user?.id,
  hasToken: !!session?.access_token,
});
```

### Step 3: Check RLS Policy

Run in Supabase SQL Editor:

```sql
-- List all policies on waitlist table
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
```

### Step 4: Test RLS Policy Directly

```sql
-- Test if the policy allows inserts
-- This simulates what PostgREST does
SET ROLE anon;
INSERT INTO waitlist (email, source) VALUES ('test@example.com', 'test');
RESET ROLE;
```

### Step 5: Check PostgREST Logs

In Supabase Dashboard → **Logs → PostgREST**, look for:
- The actual SQL query being executed
- The role being used
- Any permission errors

## Recommended Fix

Based on common issues, try this updated approach:

```typescript
// Sign in anonymously
const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

if (authError || !authData.session) {
  // Handle error
}

// Verify session is set
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  throw new Error("Session not available after anonymous sign-in");
}

// Now perform the insert
const { data, error } = await supabase
  .from("waitlist")
  .insert([{ email, source }])
  .select()
  .single();
```

## Most Likely Causes

Based on the error code `42501` and your setup:

1. **RLS policy checking wrong role** - Policy might be checking `authenticated` instead of `anon`
2. **Session not persisting** - The session from sign-in might not be used for the insert
3. **Anonymous auth disabled** - Anonymous provider might not be enabled in Supabase

## Next Steps

1. Check Supabase Dashboard → Authentication → Providers → Anonymous (should be enabled)
2. Verify your RLS policy uses `TO anon` (not `TO authenticated` or `TO public`)
3. Add the debugging code above to see if the session is being used
4. Check PostgREST logs in Supabase Dashboard for the actual error details

