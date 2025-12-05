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

-- Allow inserts from anon users (for the signup form)
CREATE POLICY "Allow anonymous inserts" ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);
```

## 3. Add Environment Variables

Create a `.env.local` file in `apps/web/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
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

