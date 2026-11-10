# Development

## Requirements and workflow

Use Node.js 22 or newer to build and test CookieQuant. Gameplay itself needs no Node.js process or npm dependencies.

- npm run build: regenerate both distributables from src/cookie-quant.js.
- npm test: execute source syntax, distribution, and bootstrap checks.
- npm run check: reject stale generated output and run the test suite.

Change the maintained file in src/, then run the build before committing. Do not edit dist/ by hand. Keep the version in TOOLKIT_VERSION current for userscript update detection.

## Manual regression checklist

1. Open the official browser edition of Cookie Clicker and export your save.
2. Install the userscript and verify the panel appears after Game readiness.
3. Toggle auto-clicking; inspect active target selection once Cookie Monster loads.
4. Inspect Stock Market forecast output after unlocking the Bank minigame.
5. Inspect Garden, Pantheon, Grimoire, and Dragon statuses if those minigames are unlocked.
6. Test the stop() function and confirm timers and the panel disappear.
7. Reload and confirm saved UI settings return.
8. Install the script a second time and confirm there are no duplicate panels.

## Testing limits

The current tests verify packaging, syntax, essential subsystem identifiers, and startup readiness with a minimal mocked browser. They are not end-to-end game simulation tests. No claim of live gameplay validation is made by a passing CI run.

## Changes from the original console version

The repository import preserves the original single-closure implementation. It adds a persisted default for research-upgrade automation and recognizes the existing late-game panel tab when restoring state.

## Dependencies and license

No third-party source is vendored. The program optionally loads Cookie Monster from its upstream location. Original CookieQuant code is MIT licensed. See THIRD_PARTY_NOTICES.md for independent external works.
