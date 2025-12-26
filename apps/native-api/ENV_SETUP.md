## Native API Environment Setup

Set the following in `apps/native-api/.env` before running Prisma commands or the server:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mukja?schema=public"
TRIPADVISOR_API_KEY=your_tripadvisor_key
PORT=3002

# Supabase Authentication (Required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase-dashboard
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Legacy JWT_SECRET (optional, fallback if SUPABASE_JWT_SECRET not set)
JWT_SECRET=replace-with-secret
```

Notes:
- `DATABASE_URL` is required for `prisma generate` / `prisma migrate`.
- Ensure Postgres is running locally on port 5432 with database `mukja`.
- For other environments, adjust credentials/host as needed.
- **Supabase Configuration:**
  - `SUPABASE_URL`: Your Supabase project URL (found in Project Settings > API)
  - `SUPABASE_JWT_SECRET`: JWT secret for validating Supabase tokens (found in Project Settings > API > JWT Secret)
  - `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations (optional, for user syncing)
- The API now uses Supabase authentication. Users are automatically created/synced from Supabase when they authenticate.



