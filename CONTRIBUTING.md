# Contributing to CookieQuant

Bug reports, test cases, and focused pull requests are welcome.

## Before contributing

Check existing issues, describe your observed Cookie Clicker version, and explain the feature or bug. Use a copy of your save when testing potentially irreversible actions.

## Code contributions

1. Work in src/cookie-quant.js, not the generated files.
2. Increment TOOLKIT_VERSION when delivering a behavior change to installed users.
3. Run npm run build and npm run check using Node.js 22 or later.
4. Include the updated dist files with the source.
5. Explain any effect on stock trading, reserves, Garden sacrifice, building sales, or ascension.
6. Provide a minimal reproduction or a manual verification description for game-dependent behavior.

The CI suite checks packaging and syntax, not the full game's live state machine. Avoid uploading Cookie Clicker saves, private data, or unlicensed third-party assets.
