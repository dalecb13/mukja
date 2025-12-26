-- AlterTable
ALTER TABLE "api_request_log" ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "request_size" INTEGER,
ADD COLUMN     "response_size" INTEGER,
ADD COLUMN     "user_agent" TEXT;

-- CreateTable
CREATE TABLE "database_query_log" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "params" JSONB,
    "execution_time" INTEGER NOT NULL,
    "model" TEXT,
    "operation" TEXT,
    "user_id" TEXT,
    "route" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "database_query_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_bottleneck_log" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'warning',
    "threshold_ms" INTEGER NOT NULL,
    "actual_value_ms" INTEGER NOT NULL,
    "resource" TEXT,
    "details" JSONB,
    "user_id" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolved_at" TIMESTAMP(3),
    "resolved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performance_bottleneck_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "database_query_log_model_created_at_idx" ON "database_query_log"("model", "created_at");

-- CreateIndex
CREATE INDEX "database_query_log_operation_created_at_idx" ON "database_query_log"("operation", "created_at");

-- CreateIndex
CREATE INDEX "database_query_log_execution_time_created_at_idx" ON "database_query_log"("execution_time", "created_at");

-- CreateIndex
CREATE INDEX "database_query_log_user_id_created_at_idx" ON "database_query_log"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "database_query_log_route_created_at_idx" ON "database_query_log"("route", "created_at");

-- CreateIndex
CREATE INDEX "database_query_log_success_created_at_idx" ON "database_query_log"("success", "created_at");

-- CreateIndex
CREATE INDEX "performance_bottleneck_log_type_created_at_idx" ON "performance_bottleneck_log"("type", "created_at");

-- CreateIndex
CREATE INDEX "performance_bottleneck_log_severity_created_at_idx" ON "performance_bottleneck_log"("severity", "created_at");

-- CreateIndex
CREATE INDEX "performance_bottleneck_log_resource_created_at_idx" ON "performance_bottleneck_log"("resource", "created_at");

-- CreateIndex
CREATE INDEX "performance_bottleneck_log_resolved_created_at_idx" ON "performance_bottleneck_log"("resolved", "created_at");

-- CreateIndex
CREATE INDEX "api_request_log_latency_ms_created_at_idx" ON "api_request_log"("latency_ms", "created_at");

-- CreateIndex
CREATE INDEX "api_request_log_user_id_created_at_idx" ON "api_request_log"("user_id", "created_at");
