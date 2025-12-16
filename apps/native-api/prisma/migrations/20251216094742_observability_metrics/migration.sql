-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "session_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "properties" JSONB,
    "account_id" TEXT,
    "source" TEXT NOT NULL DEFAULT 'native-app',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ingested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotency_key" TEXT,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_rollup_daily" (
    "event_date" DATE NOT NULL,
    "event_type" TEXT NOT NULL,
    "count" BIGINT NOT NULL,
    "unique_users" BIGINT,
    "properties_agg" JSONB,

    CONSTRAINT "event_rollup_daily_pkey" PRIMARY KEY ("event_date","event_type")
);

-- CreateTable
CREATE TABLE "cost_external" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DECIMAL(20,6) NOT NULL,
    "unit_cost" DECIMAL(20,6) NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cost_external_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "source" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "amount_gross" DECIMAL(20,6) NOT NULL,
    "fees" DECIMAL(20,6) NOT NULL,
    "amount_net" DECIMAL(20,6) NOT NULL,
    "period_start" DATE,
    "period_end" DATE,
    "external_ref" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_stats" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "vote_rule" TEXT NOT NULL,
    "participants" INTEGER NOT NULL,
    "cards_presented" INTEGER NOT NULL,
    "cards_liked" INTEGER NOT NULL,
    "time_to_decision_seconds" INTEGER,
    "result_restaurant_id" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "match_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_impression" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "provider" TEXT,
    "watched_ms" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ad_impression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_request_log" (
    "id" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "latency_ms" INTEGER NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_request_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_idempotency_key_key" ON "event"("idempotency_key");

-- CreateIndex
CREATE INDEX "event_event_type_created_at_idx" ON "event"("event_type", "created_at");

-- CreateIndex
CREATE INDEX "event_user_id_created_at_idx" ON "event"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "event_session_id_idx" ON "event"("session_id");

-- CreateIndex
CREATE INDEX "cost_external_service_period_start_idx" ON "cost_external"("service", "period_start");

-- CreateIndex
CREATE INDEX "revenue_user_id_idx" ON "revenue"("user_id");

-- CreateIndex
CREATE INDEX "revenue_source_created_at_idx" ON "revenue"("source", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "match_stats_match_id_key" ON "match_stats"("match_id");

-- CreateIndex
CREATE INDEX "match_stats_mode_created_at_idx" ON "match_stats"("mode", "created_at");

-- CreateIndex
CREATE INDEX "match_stats_completed_created_at_idx" ON "match_stats"("completed", "created_at");

-- CreateIndex
CREATE INDEX "ad_impression_user_id_created_at_idx" ON "ad_impression"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "ad_impression_placement_created_at_idx" ON "ad_impression"("placement", "created_at");

-- CreateIndex
CREATE INDEX "api_request_log_route_created_at_idx" ON "api_request_log"("route", "created_at");

-- CreateIndex
CREATE INDEX "api_request_log_status_created_at_idx" ON "api_request_log"("status", "created_at");
