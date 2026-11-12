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

## Cloudflare R2 storage migration (No Neon at runtime)

Neon's live telemetry database is a temporary source. R2 is designed for lower-cost long-lived storage. This deployment includes a **feature-flagged R2 adapter**, but Neon remains the active backend until you create and connect the Cloudflare bucket and copy history. Do not delete the Neon database before verification.

### Cloudflare setup

1. Sign in to [Cloudflare R2](https://dash.cloudflare.com/). Create a bucket named `cookiequant-telemetry` with Standard storage. Keep it private.
2. Under **R2 → Overview → Manage API Tokens**, create a bucket-scoped **Object Read & Write** token. Record the Cloudflare account ID, Access Key ID, and Secret Access Key in your password manager.
3. In the **Vercel cookiequant-dashboard** project, configure the following as encrypted **Production** environment variables: `R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY`. Don't paste them in GitHub, browser console, or ChatGPT. The current `DATABASE_URL` remains present during migration.
4. Keep `TELEMETRY_BACKEND=neon` (or unset) until the migration finishes. The app continues using Neon, so your live feed does not break during setup.
5. From the repository root, use `npm install --prefix dashboard`, then `npm run migrate:r2 --prefix dashboard` in a terminal with the same R2 variables and `DATABASE_URL` available **locally** as environment variables. Do not commit local .env files. The script copies existing rows in batches of 50 and reports progress. Rerun it to catch any final writes. The deterministic snapshot keys make retries safe. Verify stored objects via Cloudflare's R2 bucket browser.
6. Set `TELEMETRY_BACKEND=r2` in Vercel's **Production** environment and redeploy. Then check `/api/live`, `/api/history?range=all`, and `/api/health` return the expected snapshots. Confirm the next browser upload succeeds. Only after these checks should you consider removing `DATABASE_URL` or deleting the old Neon project.

### R2 data layout

- `cookiequant/v1/snapshots/YYYY-MM-DD/<run>-<tick>.json.gz`: compressed full raw snapshot per game run/tick/day. These preserve the Monte Carlo vectors for later backtesting.
- `cookiequant/v1/daily/YYYY-MM-DD.json.gz`: compressed market price index for charting. Atomically updated with an ETag check to protect against overlapping writes.
- `cookiequant/v1/latest.json.gz`: most recent snapshot, a 120-row recent history cache, the first date and an approximate record count.

The Vercel API still validates the publishing key. R2 credentials stay server-side, not in the public frontend or the userscript. Charts remain public and read-only. The R2 adapter can sample a long historical period without downloading every archived Monte Carlo vector. Historical day indexes are sampled across longer timespans to keep requests bounded. No automatic data deletion is configured.

### Estimated usage

The original Neon payload averaged about **30 KB per snapshot**, roughly 16 GB per year at a steady one-minute cadence before compression. R2 stores these compressed, plus small daily summary files. Cloudflare's current free tier includes 10 GB-month of Standard storage and 1 million Class A operations monthly. Storage beyond the free tier is billed, so indefinite retention is not equivalent to unlimited free storage. Keep independent backups if the history is valuable.
