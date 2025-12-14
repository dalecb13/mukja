# Observability, Metrics, and Cost/Revenue Model (native-api)

Goal: instrument the native-api to track usage, measure conversion, and understand cost vs. revenue. No code changes here—API and schema design only.

## High-Level Requirements
- Capture user, match, and monetization events with minimal PII.
- Support per-tenant/organization in future (design with `account_id` nullable for now).
- Durable storage in Postgres (Prisma), with daily rollups to reduce query cost.
- Ingestion APIs with auth + rate limiting; idempotent event writes.
- Export-friendly: events table is append-only; rollup tables for dashboards.
- Support external cost tracking for TripAdvisor, Stripe, Vercel (and future services).

## Data Model (tables)

### `event`
- `id` (uuid, pk)
- `user_id` (uuid, nullable for pre-auth events)
- `session_id` (text, required) – client-generated per app session
- `event_type` (text) – enum-like (see Event Types)
- `properties` (jsonb) – schemaless payload
- `account_id` (uuid, nullable) – future org/teams
- `source` (text) – e.g., `native-app`, `web`, `server`
- `created_at` (timestamptz, default now)
- `ingested_at` (timestamptz, default now)
- `idempotency_key` (text, unique, nullable) – to prevent duplicates from retries

Indexing: `(event_type, created_at)`, `(user_id, created_at)`, `(session_id)`.

### `event_rollup_daily`
- `event_date` (date, pk)
- `event_type` (text, pk)
- `count` (bigint)
- `unique_users` (bigint, nullable)
- `properties_agg` (jsonb, optional top-K fields if needed)

Materialization: cron job (or background worker) to aggregate from `event`.

### `cost_external`
- `id` (uuid, pk)
- `service` (text) – e.g., `tripadvisor`, `stripe`, `vercel`, `supabase` (if used), `hcaptcha`
- `unit` (text) – e.g., `per_request`, `per_1000_requests`, `percent_of_gmv`, `flat_monthly`
- `quantity` (numeric) – e.g., number of calls, GB, transactions
- `unit_cost` (numeric) – cost per unit in USD
- `period_start` (date)
- `period_end` (date)
- `notes` (text)
- `created_at` (timestamptz, default now)

Usage: periodically insert measured quantities to model costs and compare to revenue.

### `revenue`
- `id` (uuid, pk)
- `user_id` (uuid, nullable if aggregated)
- `source` (text) – e.g., `stripe`
- `plan` (text) – `free`, `monthly`, `yearly`
- `amount_gross` (numeric, USD)
- `fees` (numeric, USD) – Stripe fees, app store fees, etc.
- `amount_net` (numeric, USD)
- `period_start` (date, nullable) – for subscriptions
- `period_end` (date, nullable)
- `created_at` (timestamptz, default now)
- `external_ref` (text, nullable) – e.g., Stripe charge id

### `match_stats`
- `id` (uuid, pk)
- `match_id` (uuid, unique)
- `mode` (text) – `solo` | `group`
- `vote_rule` (text) – `majority` | `unanimous` | `first_to_x`
- `participants` (int)
- `cards_presented` (int)
- `cards_liked` (int)
- `time_to_decision_seconds` (int)
- `result_restaurant_id` (text, nullable) – TripAdvisor location id
- `completed` (bool)
- `created_at` (timestamptz)
- `completed_at` (timestamptz, nullable)

### `ad_impression`
- `id` (uuid, pk)
- `user_id` (uuid)
- `placement` (text) – e.g., `results_gate`
- `provider` (text) – to be determined
- `watched_ms` (int)
- `completed` (bool)
- `created_at` (timestamptz)

### `api_request_log` (optional if we rely on infra logs)
- `id` (uuid, pk)
- `route` (text)
- `method` (text)
- `status` (int)
- `latency_ms` (int)
- `user_id` (uuid, nullable)
- `created_at` (timestamptz)

## Event Types (client/server)
- `app_open`
- `auth_login`, `auth_signup`, `auth_logout`
- `match_created` (properties: mode, vote_rule, participants_planned)
- `match_joined`
- `match_started`
- `card_shown` (restaurant_id, rank)
- `card_liked` / `card_passed`
- `match_progress` (rule_state)
- `match_completed` (winner_id, duration, cards_seen)
- `ad_shown`, `ad_completed` (placement)
- `paywall_viewed`, `subscription_started`, `subscription_renewed`, `subscription_canceled`
- `tripadvisor_request` (endpoint, latency, status) – server-side
- `stripe_webhook_event` (type) – server-side
- `error_client`, `error_server`

## Ingestion API (native-api)
- `POST /metrics/events`  
  Body: `{ events: [{ event_type, session_id, user_id?, properties?, idempotency_key? }] }`  
  Auth: user token (required); rate limit per user/session; reject oversized payloads.  
  Behavior: store to `event`; upsert on `idempotency_key`.

- `POST /metrics/match`  
  Body: `{ match_id, mode, vote_rule, participants, cards_presented, cards_liked, time_to_decision_seconds, result_restaurant_id?, completed }`  
  Auth: user token (host or server-only); writes `match_stats`.

- `POST /metrics/ad`  
  Body: `{ placement, watched_ms, completed, user_id? }`  
  Auth: user token; writes `ad_impression`.

- `POST /metrics/costs` (admin/server-only)  
  Body: `{ service, unit, quantity, unit_cost, period_start, period_end, notes? }`  
  Auth: admin; writes `cost_external`.

- `POST /metrics/revenue` (admin/server-only, or via Stripe webhooks)  
  Body: `{ user_id?, source, plan, amount_gross, fees, amount_net, period_start?, period_end?, external_ref? }`.

## Rollups & Jobs
- Nightly job: populate `event_rollup_daily` from `event`.
- Weekly/monthly job: aggregate `cost_external` and `revenue` to compare net.
- Alerting: if error rates, ad failures, TripAdvisor failures exceed thresholds.

## Observability Stack (recommendations)
- Logging: structured JSON logs with trace/request ids; centralized in log drain.
- Tracing: OpenTelemetry for native-api (NestJS) with HTTP spans; propagate to clients later.
- Metrics: Prometheus-style counters/histograms for latency and error rates on key endpoints (`tripadvisor`, `metrics ingestion`, `auth`).
- Dashboards: latency/error for TripAdvisor calls; match funnel (created → started → completed); ad completion; paywall view→start conversion; revenue vs cost.

## External Service Costs (assumptions, adjust with real pricing)
- TripAdvisor Content API: often rate-limited; assume per-request cost or monthly tier. Track calls/request count per endpoint; add cost per call in `cost_external`.
- Stripe: assume ~2.9% + $0.30 per charge (card) and different rates for wallets; record gross, fee, net in `revenue`.
- Vercel: bandwidth + function invocations; track request volume and egress estimates; add monthly flat + overages in `cost_external`.
- Ads provider (TBD): track impressions/completions and CPM/CPC terms; record estimated revenue or cost (if any).
- hCaptcha (if used): generally free within limits; note if enterprise.
- Supabase (if used elsewhere): include tier/monthly + egress if applicable.

## Privacy & Governance
- Minimize PII in `event.properties`; prefer ids, not raw emails.
- Allow user delete/export: cascade delete user-linked events or anonymize.
- Retention: raw `event` keep 90–180 days; keep rollups long term.

## Break-even Modeling (data to collect)
- Revenue: subscription net (after fees), ad revenue per completed ad.
- Costs: TripAdvisor calls, infra (Vercel), auth/storage (Supabase if applicable), ads SDK fees (if any), Stripe fees.
- Unit economics:  
  - CAC/LTV requires marketing attribution (future).  
  - Per-match cost = (TripAdvisor calls * cost_per_call) + infra per request.  
  - Free tier impact: ad revenue per gated result vs cost of serving.

## Next Steps (implementation)
- Add Prisma models for the tables above; generate migrations.
- Implement `/metrics/events`, `/metrics/match`, `/metrics/ad` with auth + rate limit + idempotency.
- Add cron/queue for daily rollups.
- Add OpenTelemetry middleware and structured logging.
- Add dashboards for TripAdvisor success rate/latency, match funnel, paywall conversion, revenue vs cost.

