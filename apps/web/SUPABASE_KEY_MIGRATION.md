# Supabase Key Migration Guide

## The Issue

If you've migrated from Supabase's legacy API keys to the new publishable/secret keys, this could be causing your RLS (Row Level Security) issues.

## Key Types

### Legacy Keys (Deprecated)
- **anon key**: Used for client-side operations, respects RLS
- **service_role key**: Server-side only, bypasses RLS

### New Keys
- **publishable key**: Replaces the `anon` key - use for client-side operations, respects RLS
- **secret key**: Replaces the `service_role` key - server-side only, bypasses RLS

## Critical Point

**For anonymous sign-in and RLS policies, you MUST use the PUBLISHABLE key (not the secret key).**

- ✅ **PUBLISHABLE key**: Works with RLS, allows anonymous sign-in, safe for client-side
- ❌ **SECRET key**: Bypasses RLS entirely, should only be used for admin operations

## How to Verify Your Setup

### 1. Check Your Environment Variables

In your Supabase dashboard:
- Go to **Settings → API**
- Look for:
  - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
  - **Publishable key** (formerly anon key) → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - **Secret key** (formerly service_role key) → **DO NOT USE** for waitlist operations

### 2. Verify in Your Code

The code now supports both naming conventions:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (legacy name)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (new name)

Both will work, but make sure you're using the **publishable** key, not the secret key.

### 3. Check Your Vercel Environment Variables

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Verify:
   - `NEXT_PUBLIC_SUPABASE_URL` is set
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) contains the **publishable** key
   - Make sure it's NOT the secret key

### 4. How to Tell the Difference

**Publishable key:**
- Shorter (typically ~100-150 characters)
- Safe to expose in client-side code
- Works with RLS policies
- Allows anonymous sign-in

**Secret key:**
- Longer (typically ~200+ characters)
- Should NEVER be in `NEXT_PUBLIC_` environment variables
- Bypasses RLS entirely
- Should only be used server-side for admin operations

## Common Issues After Migration

### Issue 1: Using Secret Key Instead of Publishable Key

**Symptoms:**
- RLS policies not working
- Anonymous sign-in fails
- 401 errors

**Solution:**
- Verify you're using the **publishable** key in `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- The secret key should only be used for admin operations (and never in `NEXT_PUBLIC_` vars)

### Issue 2: Environment Variable Not Updated

**Symptoms:**
- Old anon key still in environment variables
- "Legacy API keys are disabled" errors

**Solution:**
- Update your environment variables to use the new publishable key
- The code supports both `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Issue 3: Anonymous Authentication Not Enabled

**Symptoms:**
- Anonymous sign-in fails
- RLS policies don't work

**Solution:**
- Go to Supabase Dashboard → **Authentication → Providers**
- Enable **Anonymous** sign-in

## Testing

After updating your keys:

1. Check the development logs - you should see:
   ```
   Supabase config check: {
     hasAnonKey: true,
     hasPublishableKey: false,
     keyType: "ANON_KEY",
     ...
   }
   ```

2. Try signing up for the waitlist
3. Check that anonymous sign-in succeeds (check logs)
4. Verify the email is inserted into the waitlist table

## Migration Checklist

- [ ] Identified which key you're currently using (publishable vs secret)
- [ ] Updated environment variables to use publishable key
- [ ] Verified in Supabase dashboard that you're using the correct key
- [ ] Updated Vercel environment variables
- [ ] Enabled anonymous authentication in Supabase
- [ ] Tested waitlist signup
- [ ] Verified RLS policies work correctly

## Need Help?

If you're still having issues:

1. Check the development logs for the "Supabase config check" output
2. Verify the key length and type match a publishable key
3. Ensure anonymous authentication is enabled in Supabase
4. Double-check your RLS policies allow anonymous inserts

