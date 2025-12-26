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
- **For local development**: Use local PostgreSQL (postgresql://postgres:postgres@localhost:5432/mukja?schema=public)
- **For Supabase production**: Use Supabase connection string (see below)
- **Supabase Configuration:**
  - `SUPABASE_URL`: Your Supabase project URL (found in Project Settings > API)
  - `SUPABASE_JWT_SECRET`: JWT secret for validating Supabase tokens (found in Project Settings > API > JWT Secret)
  - `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations (optional, for user syncing)
- The API now uses Supabase authentication. Users are automatically created/synced from Supabase when they authenticate.

## Database Migrations with Supabase

### Getting your Supabase Database URL
1. Go to Supabase Dashboard → Project Settings → Database
2. Under "Connection string", copy the "URI" format
3. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require`
4. Replace `[YOUR-PASSWORD]` with your database password (found in Project Settings → Database → Database password)

### Applying Migrations to Supabase
1. Set `DATABASE_URL` in `.env` to your Supabase connection string
2. Run migrations: `pnpm db:migrate:prod` (uses `prisma migrate deploy`)
   - This applies all pending migrations from `prisma/migrations/` to Supabase
   - Safe for production - only applies migrations that haven't been run yet

### Development Workflow
- **Creating new migrations**: Use `pnpm db:migrate` (with local DATABASE_URL) to create migration files
- **Applying to Supabase**: Use `pnpm db:migrate:prod` (with Supabase DATABASE_URL) to deploy migrations
- **Quick prototyping**: Use `pnpm db:push` (not recommended for production - doesn't create migration files)



