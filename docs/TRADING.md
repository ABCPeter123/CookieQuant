# Stock Market: modeling and execution

CookieQuant trades in Cookie Clicker's fictional Stock Market minigame. All currencies, returns, and risk measures described here are in-game quantities, not financial recommendations.

## Forecasting pipeline

1. Read market prices, trends, regime, resting values, brokers, Bank level, and relevant auras.
2. Generate 256 joint Monte Carlo scenarios across all available goods. Shared simulated market shocks create cross-asset dependence.
3. Simulate up to 20 ticks using copied state and a dedicated seeded random number generator.
4. Estimate the mean price, fifth-percentile price, and probability of exceeding fee-inclusive entry cost.
5. Require a positive margin beyond fees and sampling uncertainty before allowing new positions.
6. Construct a portfolio subject to a risk budget and available cookie surplus.
7. Rebalance only once per native game tick, instead of on every fast timer iteration.

## Allocation objective

The greedy portfolio allocator evaluates a vector of scenario returns and computes:

- Average log(1 + scenario return), favoring compounding.
- Expected shortfall estimated as average loss in the worst 5% of scenarios.
- A penalty for downside loss, with a hard user-selected risk cap.
- Marginal benefit per unit of capital for candidate lot additions.

The allocator is a heuristic search over discrete lots. It is not a proof of globally optimal allocation. With only 256 scenarios, small changes to simulated draws can change the selected target portfolio.

## Trading controls

New purchases include brokerage fees. The model treats sales as fee-free, consistent with the in-game rules used by this implementation. Sizing respects bank reserves and a configurable portfolio budget. It does not repeatedly buy a good within the same market tick.

The controller stores a local position ledger, estimated cost basis, realized returns, and the last trade. Positions with externally changed quantities receive an unknown-cost-basis marker rather than fabricated historical data.

The dashboard reports forecast prices, simulated probability of profit after fees, allocation targets, and estimated downside. Automatic ascension can liquidate market holdings first.

## Limits and assumptions

The forecast is a model of the game's random process, not an oracle. Game updates, other installed mods, sampling noise, and unmodeled transitions can change the actual outcome. No real-world orders or broker APIs are used.
