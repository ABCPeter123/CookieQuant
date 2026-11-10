# CookieQuant Research Terminal

A static interactive research dashboard explaining the CookieQuant strategy engine. It does **not** connect to a live Cookie Clicker save or execute game actions.

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

Vercel project: `cookiequant-dashboard`, rooted at `dashboard`. Vercel runs `npm run build` and serves `public`. Changes to `main` deploy the latest static site automatically. No backend, environment variables, or third-party frontend packages are required.

## License

The original project code is MIT-licensed. Cookie Clicker and Cookie Monster remain distinct third-party projects.
