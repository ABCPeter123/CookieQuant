<div align="center">

# CookieQuant

**Automate the bakery. Model the market. Optimize the chaos.**

[![Build and test](https://github.com/ABCPeter123/CookieQuant/actions/workflows/ci.yml/badge.svg)](https://github.com/ABCPeter123/CookieQuant/actions/workflows/ci.yml) [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A browser-based strategy engine for [Cookie Clicker](https://orteil.dashnet.org/cookieclicker/), combining autonomous gameplay, Monte Carlo forecasting, constrained portfolio allocation, and a configurable in-game dashboard.

**[Explore the interactive research dashboard](https://cookiequant-dashboard.vercel.app)** · [Install userscript](https://raw.githubusercontent.com/ABCPeter123/CookieQuant/main/dist/cookie-quant.user.js) · [Get started](#quick-start) · [Features](#features) · [Strategy guide](docs/STRATEGIES.md) · [Architecture](docs/ARCHITECTURE.md)

</div>

---

## Private cloud telemetry

CookieQuant can stream **real gameplay telemetry** to its cloud research terminal using an opt-in userscript publisher, a private Neon database, and authenticated Vercel endpoints. Live mode shows actual market quotes, the trading engine's own forecasts and portfolio targets, stock positions, trade counts, and Garden / Godzamok / Ascension statuses.

Raw snapshots are now retained **indefinitely without application-level deletion**. The authenticated live dashboard offers 24H, 7D, 30D, 1Y, and ALL TIME price-history views. Long ranges are downsampled for charts, but the underlying records remain in Neon.

The public demo remains synthetic and does not expose anyone's game data. The **LIVE GAME** tab requires a private viewer key. Enable uploads in the game console with `cookieClickToolkit.telemetry.connect("YOUR_PRIVATE_WRITE_KEY")` after updating the userscript. Credentials are issued privately and are never published in this repository. See the [cloud telemetry installation and security guide](docs/CLOUD_TELEMETRY.md).

## Interactive research dashboard

**[Launch CookieQuant Research Terminal](https://cookiequant-dashboard.vercel.app)**

The public dashboard demonstrates the trading algorithm in an interactive research environment:

- Inspect forecast distributions generated from **256 joint Monte Carlo price simulations**.
- Change the forecast horizon, portfolio budget, and worst-5% downside risk limit.
- See how fee-aware buy signals feed into discrete, risk-constrained portfolio allocations.
- Explore smaller visual demos of Garden breeding, Godzamok combo economics, and ascension planning.

The demo runs entirely in the browser with **synthetic initial market states**. It uses a port of the toolkit's stochastic market model, not live Cookie Clicker data, historical returns, or a connection to your game save. See [dashboard documentation](dashboard/README.md).

## Overview

CookieQuant began as an autoclicker and grew into a multi-system automation toolkit. It makes decisions using live game state, handles several minigames, and exposes strategy controls through an overlay.

The most technical component is a **fully automated Stock Market trader**. It simulates future price paths, accounts for transaction fees, constructs a risk-constrained portfolio, and rebalances holdings on native market ticks. All prices, positions, and profits here are **Cookie Clicker's fictional in-game currency**.

**Built with:** Vanilla JavaScript, browser APIs, Web Workers, Monte Carlo simulation, greedy portfolio optimization, dynamic programming, localStorage, and the Cookie Clicker API. It integrates with [Cookie Monster](https://github.com/CookieMonsterTeam/CookieMonster) for purchase recommendations.

## Features

| System | What it does |
| :-- | :-- |
| **Quant stock trader** | Runs 256 joint Monte Carlo scenarios, estimates 10 to 20 market ticks ahead, accounts for brokerage fees, and allocates capital subject to a configurable tail-risk budget. |
| **Economy engine** | Auto-buys upgrades and buildings using Cookie Monster recommendations, projected income, purchase priorities, and configurable bank reserves. |
| **Autoclicking & events** | Clicks the big cookie, golden/wrath cookies, reindeer, and fortune ticker events. Supports a Web Worker-backed timer. |
| **Garden breeding** | Chooses seed goals, plans parent layouts, synchronizes maturity windows, manages soil, protects newly discovered seeds, and can repeat seed-log sacrifices. |
| **Godzamok optimizer** | Builds a discrete-cost optimization frontier, estimates click-combo gains, performs building sales and recovery, and maintains a measured result ledger. |
| **Grimoire & Pantheon** | Casts Force the Hand of Fate with active buff checks, optionally sells/restores Wizard Towers, and assigns Godzamok. |
| **Dragon & seasons** | Trains Krumblor, plans building replacement, switches auras, collects dragon drops, and can renew a chosen season. |
| **Ascension manager** | Supports planned and custom prestige targets, heavenly upgrade progression, permanent slots, and opt-in automatic ascension. |
| **Interactive dashboard** | Draggable, resizable in-game control panel with overview, stocks, strategy, midgame, late-game, ascension, target, and diagnostic sections. |

> Forecasts and optimization scores are model estimates. They do not predict Cookie Clicker's random outcomes with certainty.

## Quick start

### Option A: Browser console

1. Open the [official browser game](https://orteil.dashnet.org/cookieclicker/) and let it finish loading.
2. Open developer tools (typically **F12**) and select **Console**.
3. Open [`dist/cookie-quant.js`](dist/cookie-quant.js), copy its full contents, and paste it into the console.
4. Use the **Cookie Clicker Toolkit** control panel that appears in the game.

The console script starts immediately. Reloading the game removes the running instance; the saved control settings remain in the browser's localStorage.

### Option B: Userscript (automatic on page load)

1. Install a browser userscript manager such as Tampermonkey.
2. Open **[Install CookieQuant](https://raw.githubusercontent.com/ABCPeter123/CookieQuant/main/dist/cookie-quant.user.js)** and approve installation in the userscript manager. If your manager does not prompt, create a new script and paste the contents of [`dist/cookie-quant.user.js`](dist/cookie-quant.user.js).
3. Reload the official Cookie Clicker page. CookieQuant starts once the game is ready.

The userscript contains `@updateURL` and `@downloadURL` pointing at the generated script on `main` so supported userscript managers can check for updates.

The userscript targets the **official DashNet browser game** and does not include the underlying game. You do not need Node.js to run either option.

### Stop automation

Run this in the browser console:

```js
window.cookieClickToolkit?.stop();
```

To prevent startup on later visits, disable the userscript in your userscript manager. For a temporary pause, use the controls in the overlay. **Export a Cookie Clicker save before testing automatic ascensions, stock liquidation, or Garden sacrifices.**

## Inside the trading engine

```text
Live Stock Market state
         │
         ▼
Simulate 256 shared market scenarios
         │
         ▼
Estimate expected prices, fee-adjusted edges,
profit probabilities, and downside outcomes
         │
         ▼
Greedy portfolio construction with a tail-risk cap
         │
         ▼
Sell / rebalance / buy on the next native market tick
         │
         ▼
Record positions, cost basis, actions, and diagnostics
```

The simulation copies market state and uses its own seeded random number generator, so it does not consume the game's random stream. The portfolio evaluator estimates the average loss in its worst 5% of simulated outcomes. It then penalizes downside risk while searching for allocations. See [trading design](docs/TRADING.md) for formulas, assumptions, and limitations.

## Settings and strategy

There are early-game and mid-game strategy profiles, plus individual switches for purchasing, minigames, and ascension. Some actions such as Garden automation or repeating late-game ascensions are **opt-in**. Other automation, including autoclicking and the stock trader, starts enabled by default.

See the [strategy guide](docs/STRATEGIES.md) for the control panel, recommended first setup, and irreversible actions.

## Project layout

```text
CookieQuant/
├── src/cookie-quant.js             # Main browser-console source
├── dist/
│   ├── cookie-quant.js             # Ready-to-paste build
│   └── cookie-quant.user.js        # Auto-starting userscript build
├── scripts/build.mjs              # Dependency-free release generator
├── tests/build.test.mjs           # Syntax, integrity, feature checks
├── docs/
│   ├── ARCHITECTURE.md
│   ├── TRADING.md
│   ├── STRATEGIES.md
│   └── DEVELOPMENT.md
└── .github/workflows/ci.yml       # Automated checks for changes
```

The automation currently shares one runtime closure. This preserves cross-system interactions and avoids introducing behavior changes in a large, stateful script. The build generates two distribution formats from **one source of truth**.

## Development

Node.js 22 or newer is required only for building and checking the repository. There are no npm dependencies.

```bash
npm run build       # Regenerate both files in dist/
npm test            # Parse and verify the code and generated builds
npm run check       # Ensure the committed builds are current, then test
```

See [development notes](docs/DEVELOPMENT.md), [release instructions](docs/PUBLISHING.md), and [contributing](CONTRIBUTING.md).

## Compatibility and credits

- Designed around the **browser edition of Cookie Clicker v2.058** and its `Game` API. It has not been validated against every older version or the Steam edition.
- Uses [Cookie Monster](https://github.com/CookieMonsterTeam/CookieMonster) as an external mod for efficiency data and color-based recommendations.
- Cookie Clicker belongs to Orteil / DashNet. CookieQuant is an independent fan-made automation project and is not affiliated with the game's creators or the Cookie Monster team.
- The toolkit can load an external sound effect and Cookie Monster from their respective URLs. No third-party mod source code is bundled here.

**License:** [MIT](LICENSE), covering CookieQuant's original source. Cookie Clicker and Cookie Monster remain the property of their respective creators.