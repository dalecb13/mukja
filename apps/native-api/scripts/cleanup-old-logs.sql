-- Cleanup script for removing logs older than 30 days
-- Run this script periodically (e.g., via cron job or scheduled task) to maintain 30-day retention

-- Delete error logs older than 30 days
DELETE FROM error_log
WHERE created_at < NOW() - INTERVAL '30 days';

-- Delete API request logs older than 30 days
DELETE FROM api_request_log
WHERE created_at < NOW() - INTERVAL '30 days';

-- Delete database query logs older than 30 days
DELETE FROM database_query_log
WHERE created_at < NOW() - INTERVAL '30 days';

-- Delete performance bottleneck logs older than 30 days (only unresolved ones, keep resolved for longer if needed)
-- Option 1: Delete all logs older than 30 days
DELETE FROM performance_bottleneck_log
WHERE created_at < NOW() - INTERVAL '30 days';

-- Option 2: Delete only unresolved logs older than 30 days, keep resolved logs for 90 days
-- DELETE FROM performance_bottleneck_log
-- WHERE created_at < NOW() - INTERVAL '30 days'
--   AND (resolved = false OR resolved_at < NOW() - INTERVAL '90 days');

-- Optionally, get stats on how many records will be deleted before running:
-- SELECT 
--   (SELECT COUNT(*) FROM error_log WHERE created_at < NOW() - INTERVAL '30 days') as error_logs_to_delete,
--   (SELECT COUNT(*) FROM api_request_log WHERE created_at < NOW() - INTERVAL '30 days') as api_logs_to_delete,
--   (SELECT COUNT(*) FROM database_query_log WHERE created_at < NOW() - INTERVAL '30 days') as query_logs_to_delete,
--   (SELECT COUNT(*) FROM performance_bottleneck_log WHERE created_at < NOW() - INTERVAL '30 days') as bottleneck_logs_to_delete;

