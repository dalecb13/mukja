-- CreateTable
CREATE TABLE "error_log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "session_id" TEXT,
    "error_type" TEXT NOT NULL,
    "error_message" TEXT NOT NULL,
    "stack_trace" TEXT,
    "context" JSONB,
    "severity" TEXT NOT NULL DEFAULT 'error',
    "source" TEXT NOT NULL DEFAULT 'server',
    "route" TEXT,
    "method" TEXT,
    "status_code" INTEGER,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolved_at" TIMESTAMP(3),
    "resolved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "error_log_error_type_created_at_idx" ON "error_log"("error_type", "created_at");

-- CreateIndex
CREATE INDEX "error_log_user_id_created_at_idx" ON "error_log"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "error_log_severity_created_at_idx" ON "error_log"("severity", "created_at");

-- CreateIndex
CREATE INDEX "error_log_resolved_created_at_idx" ON "error_log"("resolved", "created_at");

-- CreateIndex
CREATE INDEX "error_log_source_created_at_idx" ON "error_log"("source", "created_at");
