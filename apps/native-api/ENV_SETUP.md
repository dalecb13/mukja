## Native API Environment Setup

Set the following in `apps/native-api/.env` before running Prisma commands or the server:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mukja?schema=public"
TRIPADVISOR_API_KEY=your_tripadvisor_key
JWT_SECRET=replace-with-secret
PORT=3002
```

Notes:
- `DATABASE_URL` is required for `prisma generate` / `prisma migrate`.
- Ensure Postgres is running locally on port 5432 with database `mukja`.
- For other environments, adjust credentials/host as needed.

