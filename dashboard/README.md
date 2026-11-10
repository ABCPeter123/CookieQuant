# CookieQuant Research Terminal

A static interactive research dashboard that explains the CookieQuant strategy engine. It intentionally does **not** connect to a live Cookie Clicker save or execute in-game actions.

## Market Lab

- Stochastic 256-path price simulation, up to 20 market ticks
- Common market shocks across assets
- 5th/50th/95th percentile forecasts with sample trajectory visualization
- Fee-aware trading signals
- Greedy discrete portfolio allocation with expected log-growth objective and worst-5% expected-shortfall limit
- Controllable forecast horizon, tail-loss budget, and capital allocation
- Reproducible reruns with an explicit pseudorandom seed

The stochastic transition code is adapted from `stockSimulateTick` in `src/cookie-quant.js`. The dashboard starts from **illustrative synthetic market states** and models zero existing positions. The full browser controller also includes game-state integration, reserve checks, transaction verification, and persisted cost basis.

## Additional modules

The Garden, Godzamok, and ascension cards illustrate the structure of the actual algorithms. Their diagrams and example numbers are not live game-state snapshots or measured performance.

## Local development

Open `index.html` through a static HTTP server, for example:

```sh
cd dashboard
python3 -m http.server 8000
```

Then browse `http://localhost:8000`. ES modules generally require an HTTP origin.

From the repository root, run `npm test` to verify both the toolkit and dashboard models.

## Deployment

This folder is the root directory of the `cookiequant-dashboard` Vercel project. It requires no environment variables, backend functions, or API keys. Pushes to the production branch deploy the latest static dashboard.

## License and attribution

The original dashboard and CookieQuant implementation are MIT-licensed. Cookie Clicker and Cookie Monster are separate third-party projects with their own authors and terms.
