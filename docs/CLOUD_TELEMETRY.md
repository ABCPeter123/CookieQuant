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

1. Install the current `dist/cookie-quant.user.js` from GitHub in Tampermonkey or another userscript manager.
2. Open the official game at https://orteil.dashnet.org/cookieclicker/.
3. Open DevTools → Console, then run:

   ```js
   window.cookieClickToolkit.telemetry.connect("YOUR_PRIVATE_WRITE_KEY")
   ```

4. Verify `window.cookieClickToolkit.telemetry.status` shows **Connected**, then open the dashboard. It displays the live game automatically. No viewer key, sign-in, or CONNECT action is required.
5. The game uploads approximately once per minute while its tab is open and JavaScript is running. A successful connection initially uploads immediately.

To stop uploading:

```js
window.cookieClickToolkit.telemetry.disconnect()
```

To send a fresh snapshot manually:

```js
window.cookieClickToolkit.telemetry.push()
```

Browser background throttling, sleep, network failures and game updates can interrupt uploads. The dashboard displays its last-seen time and identifies stale data. The game continues working if the telemetry service is unavailable.

## Security

- The database connection lives only in the Vercel server environment, never in browser code.
- **Publishing is authenticated** with a private bearer write key. The `/api/telemetry` endpoint rejects requests without a valid key. **Read-only endpoints `/api/live` and `/api/history` are public** and require no credential.
- Browser-origin checks allow game-origin uploads and dashboard-origin reads, but **the bearer tokens are the actual access control**.
- The dashboard does not store a viewer key or ask visitors to connect. Do not publish the private **write key** in GitHub, screenshots, browser code, or website content.
- The game saves the writer key in its origin-scoped localStorage, which browser extensions and scripts with matching privileges may be able to read.
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
