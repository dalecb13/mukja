# Waitlist Setup with Supabase

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from Settings → API

## 2. Create the Waitlist Table

Run this SQL in the Supabase SQL Editor:

```sql
-- Create waitlist table
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Allow anonymous inserts" ON waitlist;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON waitlist;
DROP POLICY IF EXISTS "Enable insert for all users" ON waitlist;

-- Allow ONLY inserts from anonymous users (for the signup form)
-- This policy allows anonymous users to insert rows, but NOT read, update, or delete
CREATE POLICY "Enable insert for anonymous users" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Note: No SELECT policy for anonymous users = they cannot read any data
-- Only authenticated users (or service role) can read waitlist entries

-- Create index for faster lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);
```

### Troubleshooting RLS Issues

If you're still getting permission errors:

1. **Check if RLS is enabled:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' AND tablename = 'waitlist';
   ```
   Should show `rowsecurity = true`

2. **Check existing policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'waitlist';
   ```

3. **Verify the policy is correct:**
   - Policy should target `anon, authenticated` roles
   - `WITH CHECK (true)` means any data can be inserted
   - `FOR INSERT` means it only applies to inserts

4. **Test the policy:**
   ```sql
   -- This should work if RLS is set up correctly
   SET ROLE anon;
   INSERT INTO waitlist (email, source) VALUES ('test@example.com', 'test');
   RESET ROLE;
   ```

5. **If still not working, try a more permissive policy:**
   ```sql
   -- More permissive: allows all operations for anonymous users
   CREATE POLICY "Allow all for anonymous" ON waitlist
     FOR ALL
     TO anon
     USING (true)
     WITH CHECK (true);
   ```

## 3. Add Environment Variables

Create a `.env.local` file in `apps/web/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## 4. Install Dependencies

```bash
pnpm install
```

## 5. Test the Waitlist

Start the dev server and submit an email. Check the Supabase Table Editor to see entries.

## Viewing Waitlist Entries

You can view all waitlist entries in the Supabase dashboard:
1. Go to Table Editor → waitlist
2. Or run: `SELECT * FROM waitlist ORDER BY created_at DESC;`

