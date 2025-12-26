# 30-Day Log Retention Policy

This application implements a 30-day retention policy for all logging tables. Logs older than 30 days should be cleaned up periodically.

## Log Tables with 30-Day Retention

1. **error_log** - Application error logs
2. **api_request_log** - API request/response logs
3. **database_query_log** - Database query performance logs
4. **performance_bottleneck_log** - Performance bottleneck detection logs

## Implementation

### Automatic Filtering

All query methods in `MetricsService` default to 30-day retention:
- `getErrorLogs()` - Defaults to 30 days
- `getDatabaseQueryLogs()` - Defaults to 30 days
- `getPerformanceBottleneckLogs()` - Defaults to 30 days
- `getPerformanceStats()` - Defaults to 30 days

You can override the retention period by passing a `days` parameter, but the default ensures queries don't accidentally retrieve very old data.

### Manual Cleanup

To manually clean up old logs, use the SQL script:

```bash
# Connect to your Supabase database and run:
psql $DATABASE_URL -f scripts/cleanup-old-logs.sql
```

### Automated Cleanup

#### Option 1: Supabase Cron Job (Recommended)

Set up a cron job in Supabase to run the cleanup script:

1. Go to Supabase Dashboard → Database → Extensions
2. Enable `pg_cron` extension
3. Create a cron job:

```sql
-- Run cleanup daily at 2 AM UTC
SELECT cron.schedule(
  'cleanup-old-logs',
  '0 2 * * *', -- Daily at 2 AM
  $$
  DELETE FROM error_log WHERE created_at < NOW() - INTERVAL '30 days';
  DELETE FROM api_request_log WHERE created_at < NOW() - INTERVAL '30 days';
  DELETE FROM database_query_log WHERE created_at < NOW() - INTERVAL '30 days';
  DELETE FROM performance_bottleneck_log WHERE created_at < NOW() - INTERVAL '30 days';
  $$
);
```

#### Option 2: Application-Level Scheduled Task

Create a NestJS scheduled task (requires `@nestjs/schedule`):

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class LogCleanupService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupOldLogs() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await Promise.all([
      this.prisma.errorLog.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } },
      }),
      this.prisma.apiRequestLog.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } },
      }),
      this.prisma.databaseQueryLog.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } },
      }),
      this.prisma.performanceBottleneckLog.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } },
      }),
    ]);
  }
}
```

#### Option 3: External Cron Job

Set up a cron job on your server:

```bash
# Add to crontab (runs daily at 2 AM)
0 2 * * * psql $DATABASE_URL -f /path/to/apps/native-api/scripts/cleanup-old-logs.sql
```

## Monitoring

Check log table sizes periodically:

```sql
SELECT 
  'error_log' as table_name,
  COUNT(*) as total_rows,
  MIN(created_at) as oldest_log,
  MAX(created_at) as newest_log
FROM error_log
UNION ALL
SELECT 
  'api_request_log' as table_name,
  COUNT(*) as total_rows,
  MIN(created_at) as oldest_log,
  MAX(created_at) as newest_log
FROM api_request_log
UNION ALL
SELECT 
  'database_query_log' as table_name,
  COUNT(*) as total_rows,
  MIN(created_at) as oldest_log,
  MAX(created_at) as newest_log
FROM database_query_log
UNION ALL
SELECT 
  'performance_bottleneck_log' as table_name,
  COUNT(*) as total_rows,
  MIN(created_at) as oldest_log,
  MAX(created_at) as newest_log
FROM performance_bottleneck_log;
```

## Notes

- The cleanup script uses `NOW() - INTERVAL '30 days'` which is timezone-aware
- Consider running cleanup during low-traffic hours
- Monitor disk space before and after cleanup
- You may want to archive old logs before deletion for compliance/audit purposes

