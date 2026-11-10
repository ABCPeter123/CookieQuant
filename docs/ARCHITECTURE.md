# Architecture

## Runtime model

CookieQuant runs in the browser as a single immediately invoked JavaScript function that accesses the Cookie Clicker global Game API. The controller is exposed as window.cookieClickToolkit, with a compatibility alias at window.clickIncomeMeter.

On startup, it shuts down earlier copies, loads saved settings, optionally loads Cookie Monster, schedules the automation loops, and renders its in-game control panel. The stop() method clears timers, terminates the Web Worker, removes the panel, and unhooks runtime callbacks.

## Subsystems

| Subsystem | Main responsibilities |
| --- | --- |
| Settings and strategies | Persist control state in localStorage and apply early/mid-game profiles |
| Purchase planner | Read Cookie Monster efficiency signals, rank purchases, account for reserves |
| Click scheduler | Use a Web Worker timer when supported, with browser-timer fallback |
| Stock Market | Simulate price paths, optimize target allocations, trade on native market ticks |
| Garden | Plan parent arrangements and maturity overlap, harvest target mutations, manage soil |
| Godzamok | Estimate combo gains, optimize sale quantities, restore buildings, account for outcomes |
| Grimoire and Pantheon | Cast during valuable buffs and manage Godzamok placement |
| Ascension | Move through staged progression with separately armed automatic mode |
| Control panel | Report state, diagnostics, and persistent per-system controls |

## Integration boundaries

The simulator copies state and uses its own local pseudorandom generator for estimates. Forecasting is separate from execution. Actual purchases, stock trades, and other game actions use the game's browser API.

Cookie Monster is loaded from its upstream URL at runtime and remains an external dependency. Its data is used for purchase recommendations. CookieQuant does not bundle Cookie Monster.

Browsers throttle timers in background tabs. The Web Worker improves scheduling consistency but cannot bypass browser or operating-system restrictions.

## Source and distribution

- src/cookie-quant.js is the maintained, single-file source.
- dist/cookie-quant.js is a byte-for-byte browser-console copy.
- dist/cookie-quant.user.js adds an auto-start bootstrap and userscript metadata.
- scripts/build.mjs generates both distributables. CI rejects stale generated files.

## Future refactoring

The single shared runtime is preserved to avoid altering game-state interactions during initial publication. Future work can extract pure mathematical models, introduce a mocked Game API, add behavioral integration tests, and consolidate periodic scheduling.
