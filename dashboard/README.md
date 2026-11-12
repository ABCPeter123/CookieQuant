# CookieQuant Research Terminal

A research dashboard explaining the CookieQuant strategy engine. It supports a **public, read-only live cloud telemetry view**, plus a separate simulated demo. The dashboard does not execute game actions.

## Market Lab

- 256 joint stochastic simulation paths, with shared market shocks, over 10–20 future ticks
- 5th/50th/95th percentile forecasts, sample trajectories, and a replayable random seed
- Fee-aware buying signals
- Greedy discrete portfolio allocation with expected log-growth objective and worst-5% expected-shortfall constraint
- Controls for forecast horizon, tail-risk limit, and capital allocation

The stochastic transition code is adapted from `stockSimulateTick` in `src/cookie-quant.js`. The demo uses **synthetic asset states** and assumes zero starting positions. The browser controller includes additional guards, reserve calculations, live game state, and position ledgers.

The Garden, Godzamok, and ascension modules explain the other algorithms with illustrative data, not measured performance.

## Local development

```sh
cd dashboard
npm run build
cd public
python3 -m http.server 8000
```

Open `http://localhost:8000`. Serve the generated `public` folder so browser ES module imports work.

Run `npm test` at the repository root for source and model checks.

## Deployment

Vercel project: `cookiequant-dashboard`, rooted at `dashboard`. Vercel runs `npm run build` and serves `public`. Changes to `main` deploy the latest static site automatically. The static frontend needs no secret. Vercel runs a read-only API backed by Neon; the ingest API requires a private publishing key.

## License

The original project code is MIT-licensed. Cookie Clicker and Cookie Monster remain distinct third-party projects.

## Live quantitative terminal

In the public **LIVE GAME** mode (the default, without a viewer key), the market page renders all Cookie Clicker products in a single price-tape chart with synchronized timestamps. The default view plots each product's percentage return since its first observed quote in the chosen date range, with an option for raw market-dollar prices. Choose an asset in the legend, forecast interval chart or execution matrix to emphasize it. Toggle **ISOLATE** to inspect only that product on the historical price chart.

The quantitative forecast surface displays each stock's expected terminal return and modeled 5th to 95th percentile interval from the **256 real shared-shock Monte Carlo terminal scenarios** uploaded by the CookieQuant userscript. A per-stock histogram, fee-aware chance of profit, conditional worst-5% terminal return, terminal volatility, position targets and cross-asset correlation diagnostics provide detailed analysis.

The projected terminal outcomes are model scenarios, not observed prices, future timestamps, or guaranteed returns. The dashboard does not manufacture intermediate forecast paths. All real quote history remains in the Neon database without application-side expiry.

## Telemetry health monitoring

The default LIVE GAME view has a public, read-only telemetry health monitor. It reports the latest server-received upload, recorded snapshot minutes over the last hour, 24-hour snapshot volume, and detailed recovery statistics reported by the game publisher when available. Data arrives from `/api/health` with 30-second polling.

The monitor classifies data as active (last upload within 150 seconds), delayed (150–600 seconds), or no recent data (over 600 seconds). This is not a guarantee that a device is online or that the browser is running, because uploads stop when a tab sleeps or closes. Failed requests are only visible in the game itself until it reconnects and uploads the next snapshot. The server API and website do not contain the publisher write credential or issue commands to the game.

## Object storage backend

The dashboard supports `TELEMETRY_BACKEND=r2` backed by a private Cloudflare R2 bucket. The Vercel function adapter writes compressed minute-resolution hourly indexes, small daily rollups, and periodic full Monte Carlo scenario archives. Every imported Neon snapshot retains its original complete scenarios. The latest simulation remains complete. Public API paths remain unchanged. Until bucket credentials and migration are configured, the default storage backend remains Neon. Instructions: [Cloud telemetry and R2 migration](../docs/CLOUD_TELEMETRY.md#cloudflare-r2-storage-migration-no-neon-at-runtime).

## R2 cost guard

When configured for R2, CookieQuant requires `R2_COST_GUARD=enforced` and an initialized ledger in an otherwise-empty bucket. The adapter conservatively caps cumulative compressed storage growth at 7 GB, Class A operations at 650,000 and Class B at 3,000,000 in any rolling 31-day window. It stops R2 work when limits are reached. This is not a provider-enforced Cloudflare $0 spending cap. Setup and limitations: [R2 cost protection](../docs/CLOUD_TELEMETRY.md#r2-cost-protection-and-hard-stop-limits).


### One-minute live ingest and browser scheduling

The **publisher target is one upload every 60 seconds**, while Cookie Clicker is open, running and its userscript is connected. Version `2026.11.12.3` uses three redundant wake sources: a main-thread timer, a dedicated Web Worker timer where supported, and the active game's logic loop. All share the same single-flight scheduler, which schedules the next attempt from the *previous attempt* instead of waiting another full minute after each successful network response. The R2 ingest function has a 30-second execution limit, the publisher waits up to 25 seconds, and retries are still bounded. The cost guard continues protecting every R2 write.

The health API reports a last-10-completed-minutes cadence alongside the existing 60-minute histogram. A recently received snapshot with gaps is labeled **LIVE · GAPS**, not a healthy minute-by-minute stream. Recovery details now include the browser visibility and how late the publishing scheduler was at the last successful report. These are observations, **not proof that the game is currently active**.

**A browser cannot guarantee 24/7 sampling**. Closing the game, sleeping the computer, suspended tabs, or browser throttling stop or delay JavaScript. A server scheduler cannot sample the private live game state without an independently running game source. To approach full minute coverage, keep Cookie Clicker open and the machine awake, allow the site to remain active in browser Memory Saver / sleeping-tab settings, and install/update the latest userscript, then refresh the game. Do not create fake minute records to conceal missing game observations.

In the running game's developer console, `cookieClickToolkit.telemetry.health` shows the last successful transmission, failure count, next attempt and scheduler lag, without exposing the write key. Use the dashboard health monitor for authoritative server-received snapshots. During testing, check **LAST 10 MIN COVERAGE** and the actual minute bars; 60-minute coverage naturally takes up to an hour to recover after a long outage.
