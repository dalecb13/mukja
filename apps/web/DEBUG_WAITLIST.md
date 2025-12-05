# Debugging Waitlist Issues

## Quick Debugging Steps

### 1. Check Environment Variables

Make sure `.env.local` exists in `apps/web/` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**To verify:**
- Check the browser console for errors
- Check the server logs (terminal where `pnpm dev` is running)
- The API route now logs detailed error information

### 2. Check Browser Console

Open DevTools (F12) → Console tab. You should see:
- `Waitlist API error:` with full error details
- Status code and error message

### 3. Check Server Logs

In your terminal running `pnpm dev`, look for:
- `Supabase error details:` - Shows error code, message, details, hint
- `Supabase configuration missing:` - If env vars aren't set

### 4. Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| `23505` | Duplicate email | User already on waitlist (expected) |
| `42P01` | Table doesn't exist | Run SQL from `WAITLIST_SETUP.md` |
| `42501` | Permission denied | Check RLS policies in Supabase |
| Missing env vars | Configuration error | Set `.env.local` variables |

### 5. Verify Supabase Setup

1. **Table exists?**
   - Go to Supabase Dashboard → Table Editor
   - Should see `waitlist` table

2. **RLS Policy exists?**
   - Go to Supabase Dashboard → Authentication → Policies
   - Should have policy allowing anonymous inserts

3. **Test directly in Supabase:**
   ```sql
   INSERT INTO waitlist (email, source) 
   VALUES ('test@example.com', 'website');
   ```

### 6. Development Mode

In development, the API now returns detailed error messages:
- Check the error message in the browser
- Check `details` field in the error response
- Full error logged to server console

### 7. Network Tab

Check Network tab in DevTools:
- Find the `/api/waitlist` request
- Check Response tab for full error details
- Check Headers to verify request format

## Testing the API Directly

You can test the API route directly with curl:

```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

