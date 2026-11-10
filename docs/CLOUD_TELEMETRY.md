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

Dashboard: private Live Game mode
  ↳ GET https://cookiequant-dashboard.vercel.app/api/live
     Authorization: Bearer <private read key>
  ↳ Latest snapshot plus sampled 24h, 7d, 30d, 1y or all-time history
  ↳ 30-second refresh. No trade actions.
```

The publicly accessible dashboard opens in **Demo** mode. Demo data stays synthetic and is never mixed into live metrics.

## Connect your game

1. Install the current `dist/cookie-quant.user.js` from GitHub in Tampermonkey or another userscript manager.
2. Open the official game at https://orteil.dashnet.org/cookieclicker/.
3. Open DevTools → Console, then run:

   ```js
   window.cookieClickToolkit.telemetry.connect("YOUR_PRIVATE_WRITE_KEY")
   ```

4. Verify `window.cookieClickToolkit.telemetry.status` shows **Connected**, then go to the dashboard, switch to **LIVE GAME**, paste your **private read key**, and click CONNECT.
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
- Ingest and read use different 48-byte random bearer keys. The API rejects unauthenticated requests.
- Browser-origin checks allow game-origin uploads and dashboard-origin reads, but **the bearer tokens are the actual access control**.
- The dashboard stores the viewer key in sessionStorage only. Do not publish the keys in GitHub, issue reports, screenshots or website copy.
- The game saves the writer key in its origin-scoped localStorage, which browser extensions and scripts with matching privileges may be able to read.
- Only whitelisted fields are stored. **Game saves, Game.seed, authentication cookies, IP addresses, emails and the keys themselves are not written to the telemetry table.**
- The game communicates directly with the API over HTTPS. The browser dashboard cannot send commands, buy stock or change your game.
- One shared read key provides access to all collected history. Anyone you give the viewer key can view the telemetry. Rotate both keys in Vercel to revoke access.
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

The dashboard's historical line chart shows **actual captured market quotes**. You can choose **24H, 7D, 30D, 1Y, or ALL TIME**. The backend samples up to 450 chart points from the selected period, evenly by stored snapshot count. This is a chart-display limit, **not a database retention limit**. The newest tick also appears in the live summary. The forecast markers are estimates from the gameplay automation. The dashboard does not invent live orders.

Snapshots are stored once per `(game_run, market tick)`. A later upload for the same tick updates its existing row. Every distinct tick remains saved without application-level expiration. The `/api/live` endpoint provides the most recent 120 snapshots for lightweight refreshes; the authenticated `/api/history?range=all` endpoint produces representative samples from the entire stored period.

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
- `TELEMETRY_READ_KEY`: separate strong random read-only bearer key

They must remain encrypted in Vercel project settings and must not be exposed through `NEXT_PUBLIC_*` or `VITE_*` variables.

## Limits

The ingestion service is designed for one owner/game. It is not a multi-user platform. The game publishes roughly once a minute while running, but there is now **no automatic storage cap**. Monitor Neon usage and configure backups or archival exports for long-term recovery. A stolen write key could cause storage abuse until rotated. A later multi-user release should add account-based authentication, write quotas, session identity and an independent device-pairing flow.
