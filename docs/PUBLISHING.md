# Releases and publishing

CookieQuant is published as a standalone userscript. There is no server to deploy, and the distribution files are committed so users can install directly from GitHub.

## Direct installation

Install with a userscript manager from:
https://raw.githubusercontent.com/ABCPeter123/CookieQuant/main/dist/cookie-quant.user.js

The generated userscript includes updateURL and downloadURL metadata pointing to the file on the main branch. Managers that support those directives can check for subsequent version updates.

## Making a new release

1. Edit src/cookie-quant.js and increase TOOLKIT_VERSION to a newer value.
2. Run npm run build, then npm run check.
3. Commit the source and generated dist files together.
4. Push to main and confirm the Build and test workflow passes.
5. Create and push a matching version tag such as v1.0.1.

The Publish release workflow runs on pushed version tags and creates a GitHub Release containing both downloadable JavaScript builds. It requires GitHub Actions to be enabled and write access to repository contents for that workflow.

## Repository presentation

Suggested short description:

Cookie Clicker strategy engine with Monte Carlo trading, risk-aware portfolio allocation, and autonomous gameplay.

Suggested topics: cookie-clicker, userscript, javascript, monte-carlo, portfolio-optimization, automation, simulation.

The main installation link always follows the main branch. Use versioned releases for reproducible historical builds. Do not submit game saves, secrets, or third-party proprietary game assets.
