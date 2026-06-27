import { Registry, Histogram, Counter, Gauge } from "prom-client";

export const metricsRegistry = new Registry();

export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [metricsRegistry],
});

export const rateLimitRejections = new Counter({
  name: "http_rate_limit_rejections_total",
  help: "Total number of requests rejected by the rate limiter (HTTP 429)",
  labelNames: ["bucket"] as const,
  registers: [metricsRegistry],
});

export const sorobanRetryTotal = new Counter({
  name: "soroban_retry_total",
  help: "Total number of Soroban RPC retry attempts",
  labelNames: ["operation"] as const,
  registers: [metricsRegistry],
});

export const sorobanRetryBudgetExhaustedTotal = new Counter({
  name: "soroban_retry_budget_exhausted_total",
  help: "Total number of Soroban retry attempts refused because the retry budget was exhausted",
  registers: [metricsRegistry],
});

// Webhook dead-letter queue depth (rows pending retry).
// Scraped by a background collector; alert fires when backlog grows.
export const webhookDlqDepth = new Gauge({
  name: "webhook_dlq_depth",
  help: "Number of unprocessed entries in the webhook dead-letter queue",
  labelNames: ["provider"] as const,
  registers: [metricsRegistry],
});

// DB connection pool utilisation ratio (active / max).
// Derived at scrape time; expose numerator and denominator for PromQL flexibility.
export const pgPoolActiveConnections = new Gauge({
  name: "pg_pool_active_connections",
  help: "Number of active (checked-out) connections in the pg pool",
  registers: [metricsRegistry],
});

export const pgPoolMaxConnections = new Gauge({
  name: "pg_pool_max_connections",
  help: "Configured maximum size of the pg connection pool",
  registers: [metricsRegistry],
});

// Soroban submit lag: seconds between attestation creation and on-chain confirmation.
export const sorobanSubmitLagSeconds = new Histogram({
  name: "soroban_submit_lag_seconds",
  help: "Time in seconds between attestation creation and Soroban on-chain confirmation",
  buckets: [1, 5, 15, 30, 60, 120, 300],
  registers: [metricsRegistry],
});
