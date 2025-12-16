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

## Subscription Flow Constraint (web-only upgrades/downgrades)
- All upgrades/downgrades happen in the Next.js web app, not in native.  
- Native should emit paywall events (viewed) and deeplink users to web for checkout.  
- Event properties must include `source: web` for subscription_started/renewed/canceled.  
- Stripe webhooks remain the source of truth; native events are informational only.  
- Dashboards: break down paywall view→start by source; expect starts/renewals only from web.

## Pricing & Provider Notes (flexible/variable)
- Pricing inputs must stay configurable (admin-set, not hardcoded) since CPMs, API costs, and infra rates vary by region/time.
- Ad Providers (ethical/EU-centric priority):  
  - Didomi (consent-first CMP; pair with chosen ad networks)  
  - Ogury (privacy-first, EU focus)  
  - Seedtag (contextual, privacy-forward, strong EU presence)  
  - Equativ / Smart AdServer (EU-based)  
  - TripleLift (contextual/CTV; verify consent flows)  
  - Google AdMob / Ad Manager (ubiquitous; ensure GDPR/TCF compliance)  
  - IronSource / Unity Ads (mainstream; validate consent/brand suitability)  
- Rewarded-ads: verify each provider’s policy for this app category and GDPR/TCF support.

## Location Policy (no device location)
- Do not require device GPS. Users draw/select a zone (Idealista-style).  
- Store zone geometry (polygon/geojson) per match; avoid raw device coords.  
- Messaging: “We only use the area you draw to find restaurants.”  
- Query TripAdvisor using zone centroid/bounds; cache/dedupe to minimize calls.

## TripAdvisor Quotas & Variability
- Assume quotas/pricing will change; keep cost-per-call configurable and monitor usage vs admin-set rates.  
- Alerts on approaching configured quotas; allow throttling and graceful degradation (smaller batches, caching).  
- Keep dependency on endpoint mix (search/details/photos) visible in dashboards.

## Next Steps (implementation)
- Add Prisma models for the tables above; generate migrations.
- Implement `/metrics/events`, `/metrics/match`, `/metrics/ad` with auth + rate limit + idempotency.
- Add cron/queue for daily rollups.
- Add OpenTelemetry middleware and structured logging.
- Add dashboards for TripAdvisor success rate/latency, match funnel, paywall conversion, revenue vs cost.

## Dashboard Specs
Target slices by time (last 24h / 7d / 30d) and by platform (native/web) where relevant.

1) TripAdvisor Reliability & Cost
- KPIs: success rate (% 2xx), p50/p90/p99 latency, request volume, error codes.
- Breakdowns: endpoint (search/details/photos), platform, region (if available).
- Cost: requests * cost_per_call (from `cost_external`) — show estimated monthly run-rate.
Charts/Widgets:
- Single-value: Success rate (24h), p99 latency (24h)
- Time series: Latency p50/p90/p99 by endpoint
- Time series: Request volume & error rate by endpoint
- Table: Top error codes / messages (24h)
- Single-value: Est. monthly TripAdvisor cost (run-rate)

2) Match Funnel
- Steps: match_created → match_started → card_shown → match_completed.
- KPIs: drop-off per step, median time to decision, cards per match, likes/pass ratio.
- Breakdowns: mode (solo/group), vote_rule, participants bucket (1,2,3-5,6+).
Charts/Widgets:
- Funnel chart: created → started → shown → completed
- Time series: matches started/completed per day
- Distribution: time_to_decision (histogram/percentiles)
- Distribution: cards_presented per match (box/violin)
- Ratio: likes vs passes

3) Ad Gate (Rewarded)
- KPIs: ad_shown → ad_completed rate, average watched_ms, failures.
- Impact: % gated results unlocked, ad revenue estimate (if provider returns CPM).
- Breakdown: placement (results_gate), platform.
Charts/Widgets:
- Funnel: ad_shown → ad_completed
- Time series: completion rate & avg watched_ms
- Single-value: % gated results unlocked
- Table: failures by reason

4) Paywall & Subscription Conversion
- Funnel: paywall_viewed → subscription_started → subscription_renewed.
- KPIs: view→start %, start→renew %, cancellations.
- Breakdown: plan (monthly/yearly), platform, source (paywall vs settings vs gate).
Charts/Widgets:
- Funnel: paywall_viewed → started → renewed
- Time series: starts by plan; renewals by plan
- Single-value: view→start %, start→renew %
- Table: cancellations by reason (if collected)

5) Revenue vs Cost
- Revenue: net per day/week/month; split by plan (monthly/yearly) and ad revenue.
- Cost: TripAdvisor, Vercel/infra, Stripe fees, ads SDK (if any), other SaaS.
- KPI: margin = revenue_net - cost; margin %; MRR/ARR projections.
Charts/Widgets:
- Stacked bar: revenue vs cost by category (daily/weekly/monthly)
- Time series: margin and margin %
- Single-value: MRR, ARR, Runway (if burn known)
- Table: cost_external entries (latest period)

6) Reliability & Errors
- API error rate by route, p50/p90/p99 latency, top error codes.
- Client vs server error events; retry rates.
Charts/Widgets:
- Time series: latency p50/p90/p99 by route
- Time series: error rate by route/status
- Table: top routes by errors; top error messages
- Single-value: current overall error rate (24h)

7) Engagement
- DAU/WAU/MAU (from event users), sessions per user, matches per user, repeats.
- Repeat match rate week-over-week; favorites saved (if tracked later).
Charts/Widgets:
- Time series: DAU/WAU/MAU
- Time series: matches per user (avg/median)
- Cohort or retention-style view: repeat match rate
- Single-value: sessions per user (median), matches per user (median)

## Alerting Thresholds (initial guards)
- TripAdvisor success rate < 97% over 30m OR p99 latency > 2s over 30m.
- Match completion rate drop: completed/created < 60% over 1h (watch for traffic mix).
- Ad completion rate < 85% over 1h.
- Paywall view→start < 2% over 24h (investigate pricing/bugs).
- Revenue vs cost: margin negative for 7d moving window (notify finance).
- Error rate (server 5xx) > 1% over 15m; client error spike > 3% over 30m.

Data sources: `event`, `event_rollup_daily`, `match_stats`, `ad_impression`, `cost_external`, `revenue`. Use rollups for heavy queries.

