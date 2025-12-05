# Fix RLS (Row Level Security) Issues in Supabase

## Quick Fix

Run this SQL in your Supabase SQL Editor to fix RLS issues:

```sql
-- Step 1: Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Allow anonymous inserts" ON waitlist;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON waitlist;
DROP POLICY IF EXISTS "Allow all for anonymous" ON waitlist;

-- Step 2: Create the correct policy for anonymous inserts ONLY
-- This allows anonymous users to INSERT but NOT read, update, or delete
CREATE POLICY "Enable insert for anonymous users" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

**Important:** This policy only allows `INSERT` operations. Anonymous users cannot:
- Read any waitlist entries (no SELECT policy)
- Update entries (no UPDATE policy)
- Delete entries (no DELETE policy)

## Verify It's Working

1. **Check the policy exists:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'waitlist';
   ```

2. **Test the insert (as anonymous user):**
   ```sql
   SET ROLE anon;
   INSERT INTO waitlist (email, source) VALUES ('test@example.com', 'test');
   RESET ROLE;
   ```

3. **If the test insert works, try your web app again**

## Common Issues

### Issue: "new row violates row-level security policy"

**Solution:** Make sure the policy uses `WITH CHECK (true)` and targets `anon` role (not `authenticated`):

```sql
CREATE POLICY "Enable insert for anonymous users" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

Note: Using `TO anon` (not `TO anon, authenticated`) ensures only anonymous users can insert via the public API. Authenticated users would need their own policy if needed.

### Issue: Policy exists but still getting errors

**Solution:** The policy might be targeting the wrong role. Check:

```sql
-- See all policies
SELECT 
  policyname, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE tablename = 'waitlist';
```

Make sure:
- `roles` includes `{anon}` for anonymous inserts
- `cmd` is `INSERT` (not `ALL` or `SELECT`)
- `with_check` is `true`

### Issue: "permission denied for table waitlist"

**Solution:** RLS might be enabled but no policy exists. Create the policy above.

## Security Notes

✅ **Current Setup (Recommended):**
- Anonymous users can **INSERT** only
- Anonymous users **CANNOT** read, update, or delete
- Only you (via Supabase dashboard or service role) can read entries

This is the most secure setup for a waitlist - users can sign up but cannot see other emails.

## Alternative: Disable RLS (Not Recommended for Production)

If you need a quick fix for testing (NOT recommended for production):

```sql
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;
```

**Warning:** This allows anyone to read/write all data. Only use for testing.

