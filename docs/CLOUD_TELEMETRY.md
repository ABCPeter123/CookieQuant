# Cloud telemetry

CookieQuant supports **opt-in, read-only cloud telemetry** from the official browser edition of Cookie Clicker. It publishes real stock prices, holdings, the trading engine's own forecast distributions and target allocations, plus concise statuses from the Garden, Godzamok, Ascension and Dragon systems.

**Live dashboard:** https://cookiequant-dashboard.vercel.app

## Architecture

```
Official Cookie Clicker browser tab
  ↳ CookieQuant userscript, opt-in publisher
  ↳ POST https://cookiequant-dashboard.vercel.app/api/telemetry
     Authorization: Bearer <private write key>
  ↳ Vercel serverless API validates, sanitizes and stores data
  ↳ Neon PostgreSQL, raw snapshots retained without an application-level expiry

Public dashboard: default Live Game mode
  ↳ GET https://cookiequant-dashboard.vercel.app/api/live
     No credential needed for viewing
  ↳ Latest snapshot plus sampled 24h, 7d, 30d, 1y or all-time history
  ↳ 30-second refresh. No trade actions.
```

The public dashboard opens in **LIVE GAME** mode automatically. It fetches live snapshots and historical price data without any viewer key. Visitors can switch to **DEMO** mode, whose synthetic data stays separate. **All published game and trading telemetry is visible to anyone who knows the dashboard URL or the read-only API URLs.**

## Connect your game

1. **For the personal, automatic version:** Install the private `CookieQuant-Personal-Auto-Telemetry.user.js` file generated locally for the account owner. It contains the write key and uses `@require` to load CookieQuant from the public repository. Disable the older, separate CookieQuant userscript in Tampermonkey so the game only runs one engine. Never commit or share the personal installer.

   **For the public version:** Install the normal `dist/cookie-quant.user.js` from GitHub. This public source deliberately contains **no write key**. Pair the publisher once using `telemetry.connect(...)` as shown below, after which the connection persists in the game's localStorage.
2. Open the official game at https://orteil.dashnet.org/cookieclicker/.
3. If using the **public** script for the first time, open DevTools → Console and run (skip this for the private auto installer):

   ```js
   window.cookieClickToolkit.telemetry.connect("YOUR_PRIVATE_WRITE_KEY")
   ```

4. Confirm that `window.cookieClickToolkit.telemetry.status` shows **Connected**, then open the dashboard. It displays the live game automatically. No viewer key, sign-in, or CONNECT action is required.
5. The game starts publishing automatically on every game reload when it has a stored write key. It uploads about once per minute while the tab is running and also checks publisher health every 15 seconds.

To stop uploading:

```js
window.cookieClickToolkit.telemetry.disconnect()
```

To send a fresh snapshot manually:

```js
window.cookieClickToolkit.telemetry.push()
```

### Public website telemetry health

The live dashboard includes a **Telemetry health** panel above the trading charts. It uses public read-only `/api/health` to show:

- Feed freshness from the most recent server-received snapshot: **FEED ACTIVE** (within 150 seconds), **DELAYED** (150 to 600 seconds), or **NO RECENT DATA** (over 600 seconds).
- Last successful snapshot timestamp, number of observed snapshot minutes in the last 60 minutes, recent-ingest timeline, and stored snapshot count in the last 24 hours.
- With the updated publisher (v2026.11.12.2 or later), the version, count of failed attempts, number of recoveries, and the last reported failure and recovery timestamps under **Recovery details**.
- The website refreshes health every 30 seconds and ages the display every 5 seconds, even when there are no new uploads.

The health panel reports **server observations**, not proof that the browser tab is open. Because a failed publisher cannot send diagnostics, its **current retry countdown and errors remain unknown until the next successful upload**. Recent gaps can also occur when the game is closed or asleep. The browser script retries independently; the website cannot remotely restart it.

### Automatic recovery

- A 12-second request timeout detects stalled uploads.
- On failed uploads, the client retries with randomized exponential backoff from about 8 seconds to a maximum of about 5 minutes. Failures do **not** stop game automation.
- A 15-second watchdog detects a stale connection (more than 150 seconds since the last successful upload) and restarts sending.
- `online`, browser `focus`, `pageshow`, and visible-tab events trigger recovery when the browser reconnects or the device wakes. Duplicate bursts are suppressed.
- After a game reload, the saved publisher settings start uploading automatically. The personal installer can restore the stored publisher key if localStorage was reset.
- Use `window.cookieClickToolkit.telemetry.health` in the game console to inspect last successful upload, retry time, error count, and whether the connection is stale. To force a new attempt: `window.cookieClickToolkit.telemetry.reconnect()`.

Network failures, sleeping tabs, and lost connectivity can still leave gaps in time-series capture. The dashboard shows the last-seen timestamp and identifies stale data. The game continues working if the telemetry service is unavailable.

The publisher adds only sanitized, non-secret delivery diagnostics to new snapshots. Previous records without the diagnostics remain valid. The public website can read these summaries, so they should not contain private credentials.

## Security

- The database connection lives only in the Vercel server environment, never in browser code.
- **Publishing is authenticated** with a private bearer write key. The `/api/telemetry` endpoint rejects requests without a valid key. **Read-only endpoints `/api/live` and `/api/history` are public** and require no credential.
- Browser-origin checks allow game-origin uploads and dashboard-origin reads, but **the bearer tokens are the actual access control**.
- The dashboard does not store a viewer key or ask visitors to connect. Do not publish the private **write key** in GitHub, screenshots, browser code, or website content.
- The public game script never contains the write key. The **personal installer** embeds it locally, and the game saves it in origin-scoped localStorage. Other locally installed scripts or browser extensions with matching privileges may read it. Never publish or share the personal installer.
- Only whitelisted fields are stored. **Game saves, Game.seed, authentication cookies, IP addresses, emails and the keys themselves are not written to the telemetry table.**
- The game communicates directly with the API over HTTPS. The browser dashboard cannot send commands, buy stock or change your game.
- Anyone can view the published telemetry and stored history. Do not enable publishing if your game data must remain private. Rotate the **write key** in Vercel if it is compromised.
- **No automatic deletion or expiration.** Snapshot history persists across browser restarts and is kept as long as the Neon database and account remain active.
- Storage consumption and backup policies depend on your Neon plan. Configure regular exports or backups separately if you need disaster recovery guarantees.

## Included fields

| Category | Data |
| --- | --- |
| Timestamp / run | Client run identifier, market tick, server receive time |
| Game | Version, ascension count, cookies, CpS, prestige |
| Market | Goods, actual prices and holdings, trends, regimes, current trading budget and fee |
| Model | Mean, 5th-percentile and terminal-scenario prices, win-rate, buy recommendation and target shares |
| Performance | Realized simulated-market-dollar P&L, trade count and the latest action |
| Automation | Short stock, Garden, Godzamok, Ascension and Dragon status summaries |

The dashboard's **cross-asset price tape** shows every stock on a common time axis. RETURN % rebases each stock to its first observed price in the selected time range; PRICE $ shows raw market-dollar quotes. All 18 stocks are visible by default, with an optional isolate/focus mode. Click any ticker to emphasize it and open its full forecast distribution.

A **cross-sectional forecast surface** displays all 18 products as their Monte Carlo P05–P95 terminal return intervals with expected return, median and after-buy-fee profit probability. An 18-row forecast/execution matrix exposes each asset's price, mean, expected edge, P05–P95, modeled gain probability, held shares, target shares and buy/trim/hold recommendation. The selected stock's histogram is constructed directly from the engine's 256 terminal price scenarios.

An optional **joint-scenario correlation diagnostic** estimates cross-product correlations from the aligned 256 Monte Carlo outcomes using the common random shocks. Correlation refers to the simulation, not observed market returns.

The dashboard's historical line chart shows **actual captured market quotes**. You can choose **24H, 7D, 30D, 1Y, or ALL TIME**. The backend samples up to 450 chart points from the selected period, evenly by stored snapshot count. This is a chart-display limit, **not a database retention limit**. The newest tick also appears in the live summary. The forecast markers are estimates from the gameplay automation. The dashboard does not invent live orders.

Snapshots are stored once per `(game_run, market tick)`. A later upload for the same tick updates its existing row. Every distinct tick remains saved without application-level expiration. The `/api/live` endpoint provides the most recent 120 snapshots for lightweight refreshes; the public `/api/history?range=all` endpoint produces representative samples from the entire stored period.

## Hosting and operations

The database schema is provisioned separately in Neon:

```sql
CREATE TABLE cq_telemetry_snapshots (
  id BIGSERIAL PRIMARY KEY,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  tick BIGINT,
  game_run TEXT,
  payload JSONB NOT NULL,
  UNIQUE (game_run, tick)
);
CREATE INDEX cq_telemetry_received_desc ON cq_telemetry_snapshots(received_at DESC);
```

The Vercel project is linked to the repository with root directory `dashboard` and production branch `main`. These production environment variables are required:

- `DATABASE_URL`: private Neon Postgres URL
- `TELEMETRY_WRITE_KEY`: strong random write-only bearer key

Keep `DATABASE_URL` and `TELEMETRY_WRITE_KEY` encrypted in Vercel project settings. Never expose them through `NEXT_PUBLIC_*` or `VITE_*` variables.

## Limits

The ingestion service is designed for one owner/game. It is not a multi-user platform. The game publishes roughly once a minute while running, but there is now **no automatic storage cap**. Monitor Neon usage and configure backups or archival exports for long-term recovery. A stolen write key could cause storage abuse until rotated. A later multi-user release should add account-based authentication, write quotas, session identity and an independent device-pairing flow.

## R2 cost protection and hard-stop limits

Cloudflare does **not** supply a zero-dollar spend cutoff for R2. Budget alerts only notify and do not suspend service. A private R2 bucket also has no default storage cap. The following is an **application-level guard**, not a contractual billing guarantee.

**The adapter is fail-closed until explicitly initialized:** An R2 deployment with missing `R2_COST_GUARD=enforced`, missing budget ledger, invalid budget ledger, or exhausted allowances returns HTTP 507 and does not issue data reads or writes. Inactive deployments use Neon as before.

The guard records conservative reservations for each API request and object write in a single, conditionally updated R2 ledger. Reservations are serialized and spaced within each warm server process to reduce R2's one-write-per-second same-key contention. Under heavy concurrent traffic the service fails closed rather than bypassing the guard. A rolling 31-day window covers billing periods that cross calendar months. The maximum reservations are:

- **7,000,000,000 bytes** in cumulative positive compressed storage growth. Replacing a larger object with a smaller one does not refund budget. This ceiling is below the R2 Standard 10 GB-month free tier.
- **650,000 Class A requests per rolling 31 days**, below the free 1,000,000 monthly allowance.
- **3,000,000 Class B requests per rolling 31 days**, below the free 10,000,000 monthly allowance.
- Extra request reservations cover conditional-write retries, the ledger updates themselves and operation-count uncertainty. Exhaustion suspends reads and uploads without deleting records.

**Initialize an empty, exclusive bucket before migration.** With the bucket-scoped R2 environment variables available locally, set `R2_COST_GUARD=enforced` and run `npm run init:r2-budget --prefix dashboard`. The initialization script refuses a non-empty bucket. It creates `cookiequant/v1/.budget-guard.json`. Then run the backfill and switch to R2 after verification. Set `R2_COST_GUARD=enforced` as an encrypted Production environment variable on Vercel alongside the bucket credentials. Use Standard storage only. The app refuses to run against R2 without this ledger.

These limits apply **only to R2 operations issued by this CookieQuant adapter**, not direct R2 API access, other buckets, other Cloudflare projects or a compromised access token. A flood of failed guard checks could still consume R2 Class B operations, and Cloudflare may bill for unrelated usage. **No application code can promise an absolute $0 Cloudflare bill.** For the strongest isolation use a dedicated Cloudflare account, an empty private bucket, a bucket-scoped credential, no other usage, Cloudflare usage notifications and a budget alert. Cloudflare budget alerts are not automatic shutdown switches.

When the guard stops uploads, the game continues functioning and retries its telemetry connection. The website may show stale data until usage falls within the rolling operation budgets or the storage budget is manually reviewed. Do not reset the guard ledger or delete it to bypass a limit without independently reviewing the Cloudflare bill.

## Cloudflare R2 storage migration (No Neon at runtime)

Neon's live telemetry database is a temporary source. R2 is designed for lower-cost long-lived storage. The adapter stores every market observation in compact hourly blocks, while full 256-path simulation arrays are sampled approximately hourly. This deployment includes a **feature-flagged R2 adapter**, but Neon remains the active backend until you create and connect the Cloudflare bucket and copy history. Do not delete the Neon database before verification.

### Cloudflare setup

1. Sign in to [Cloudflare R2](https://dash.cloudflare.com/). Create a bucket named `cookiequant-telemetry` with Standard storage. Keep it private.
2. Under **R2 → Overview → Manage API Tokens**, create a bucket-scoped **Object Read & Write** token. Record the Cloudflare account ID, Access Key ID, and Secret Access Key in your password manager.
3. In the **Vercel cookiequant-dashboard** project, configure the following as encrypted **Production** environment variables: `R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY`. Don't paste them in GitHub, browser console, or ChatGPT. The current `DATABASE_URL` remains present during migration.
4. Configure `R2_COST_GUARD=enforced` locally and in Vercel, then run `npm run init:r2-budget --prefix dashboard` against the **new empty bucket** before any migration. Keep `TELEMETRY_BACKEND=neon` (or unset) until the migration finishes. The app continues using Neon, so your live feed does not break during setup.
5. The bucket's fail-closed cost ledger has been initialized. **460 historical snapshots through Neon source ID 1695** were copied successfully in protected batches. To resume locally, clone the repository, run `npm install --prefix dashboard`, link the Vercel project using `npx vercel link`, and pull retrievable production variables into a local ignored file using `npx vercel env pull .env.r2 --environment=production`. **Vercel marks both R2 credential variables as sensitive and does not allow reading them back.** Add `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` to `.env.r2` locally from your private saved Cloudflare token values. If you did not retain the secret key when creating the token, create and save a new bucket-scoped R2 token, then replace the two Vercel environment variables. Never paste the token in ChatGPT or GitHub. If the diagnostic reports HTTP 400 `InvalidArgument`, the local S3 request was rejected before the guard could be read. The read-only diagnostic checks **ListObjectsV2**, **HeadObject**, then **GetObject** separately and uses conservative S3 SDK checksum settings. It also warns if your S3 Access Key ID or Secret Access Key has an unusual length. If all three operations fail, check the locally stored **S3 key pair** from the same bucket-scoped R2 token, not the generic Cloudflare API token. If listing succeeds but the object read fails, look at the metadata/read-stage error, rather than rotating working credentials. No R2 writes occur during diagnosis. Never print or paste either credential.

Before resuming, run `node --env-file=.env.r2 dashboard/scripts/diagnose-r2.mjs` from the repository root. It performs **one read-only GET** of `cookiequant/v1/.budget-guard.json`, reports missing local values and safe AWS/S3 error categories, and never prints the key values or changes your bucket. Require `R2 COST GUARD: READABLE` before migration. If it says AccessDenied, InvalidAccessKeyId or SignatureDoesNotMatch, fix the local Access Key ID / Secret Access Key pair and token bucket scope. The guard already exists, so **do not rerun init:r2-budget or delete/reset the guard**. Run `node --env-file=.env.r2 dashboard/scripts/migrate-neon-r2.mjs 1695`. The script copies only rows beyond ID 1695 in gzip-compressed batches, preserving their full original Monte Carlo paths. It does not delete or mutate Neon. If stopped, resume using the last copied ID printed. Keep `.env.r2` private and never commit it. Verify all rows using `node --env-file=.env.r2 dashboard/scripts/verify-r2-history.mjs` and require `missing: 0`.
6. **Only after** the verification script reports no missing Neon ticks, set `TELEMETRY_BACKEND=r2` as a Production environment variable in Vercel and redeploy. Confirm `/api/live`, `/api/history?range=all`, and `/api/health` work and that the next browser upload succeeds. Retain Neon until those checks pass.
### R2 data layout

- `cookiequant/v1/hourly/YYYY-MM-DD/HH.json.gz`: lossless compact observation index. It preserves every market quote, position, trade statistic, per-asset forecast summary, and automation status, excluding only the 256 random scenario outcomes. Hourly blocks bound write size.
- `cookiequant/v1/daily/YYYY-MM-DD.json.gz`: one latest observation and observation count per hour, for efficient 7D/30D/1Y/all-time charts. The minute-resolution hourly index remains intact and can be queried directly.
- `cookiequant/v1/snapshots/YYYY-MM-DD/<run>-<tick>.json.gz`: gzip-compressed full simulations from approximately hourly samples, plus future periodic snapshots. Historical Neon snapshots are retained losslessly in grouped objects under `cookiequant/v1/legacy-full/YYYY-MM-DD/HH/<firstId>-<lastId>.json.gz`.
- `cookiequant/v1/latest.json.gz`: most recent full snapshot with all 256 Monte Carlo scenario values, a compact 120-row recent history cache, and timeline metadata. This is overwritten on each upload; archived observations remain separately in hourly blocks.

R2 uses HTTP conditional ETag writes for its shared indexes to reduce races. Full history is not automatically deleted. In long chart ranges, the API samples hourly rollups and a bounded selection of days. That reduces read operations without deleting minute-level history.

The Vercel API still validates the publishing key. R2 credentials stay server-side, not in the public frontend or the userscript. Charts remain public and read-only. The R2 adapter can sample a long historical period without downloading every archived Monte Carlo vector. Historical day indexes are sampled across longer timespans to keep requests bounded. No automatic data deletion is configured. The free-tier circuit breaker can suspend further reads/writes to protect the account. Review the R2 cost protection section above.

### Estimated usage

Measurements from actual Neon snapshots (November 12, 2026): approximately **44.8 KB per snapshot as JSON**, of which all but **6.7 KB** can be removed from minute-by-minute records by omitting raw Monte Carlo trajectories. That is about **85% less uncompressed data per market observation**. Instead, periodic full-scenario archives preserve the stochastic model for research and the newest live snapshot always includes all scenarios.

At one minute per observation, there are roughly 43,200 observations in a 30-day month. This implementation creates about **two compact index updates per minute plus one latest-snapshot update**, and approximately 1–2 full-scenario archive objects per hour. That is roughly **130,000–135,000 Class A operations in 30 days**, excluding retries, migrations and other operations, well below the current one-million-operation free monthly allowance. R2 Standard also provides 10 million free Class B read-type operations monthly, with no egress fee. **10 GB-month is an average recurring storage allowance, not an extra 10 GB added every month.** Compressed object sizes vary; measure actual R2 usage after cutover. The free tier cannot guarantee indefinite free storage. Keep independent backups if the history is valuable.

### Migration progress (November 12, 2026)

- R2 endpoint and scoped credentials verified. Bucket was empty before initialization.
- The R2 budget ledger was initialized with the 7 GB / 650,000 Class A / 3,000,000 Class B conservative guard.
- **460 of 838** Neon snapshots were acknowledged by the R2 migration, through source ID **1695**. Another **378** existed at the time of verification.
- Production remains on Neon. The protected remote migration process stopped before the remaining data could be copied. Use the safe local resume instructions above. Never enable R2 or delete Neon until `verify-r2-history.mjs` reports `missing: 0`.
