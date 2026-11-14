# JustNotes

A small browser-local notes app built with HTML, CSS and vanilla JavaScript.
Add, edit, delete and search plain-text notes. Notes remain in the same browser
after reload; there is no account, cloud sync or backend.

## Run locally

Use Node.js 22+, npm and Python 3:

    npm ci
    npm start

Open http://127.0.0.1:4175. There is no build step, API key or environment file.
Bootstrap CSS is loaded from jsDelivr with an integrity hash; local styles supply
basic layout if the CDN is unavailable. JavaScript has no runtime dependencies.

## Verify

    npx playwright install chromium
    npm run check
    CI=1 npm test

Local tests default to installed Google Chrome; CI=1 uses Playwright Chromium.
The suite covers desktop and 320px layouts, legacy storage, literal HTML content,
add/edit/reload, cancellation, search, storage failures, concurrent-tab changes
and draft protection. GitHub Actions runs syntax and browser checks on PRs/pushes.
There is no TypeScript compiler or separate bundler/linter.

## Storage and recovery

Notes use the existing localStorage key `notes`, containing an array of strings.
Existing notes remain compatible. Text is rendered literally, never as HTML.
Saving failures retain input. Invalid stored data disables writes so it is not
silently replaced. If storage is malformed, copy the raw `notes` value from
browser developer tools before repairing it; do not clear browser data without a
backup. For conflicts between tabs, copy unsaved input and reload the stale tab.

Storage belongs to a browser profile and origin. Localhost and the public demo
do not share notes. Clearing browser data removes notes. Avoid storing sensitive
information in this demo. There is no export, version history or deletion undo.

## Deployment

Existing free GitHub Pages hosting:
https://atishayjain005.github.io/JustNotes/

Pages publishes the repository root from `main`. A pushed feature branch or PR
does **not** update the live demo. Review and merge the PR, wait for the Pages
build, then verify add/edit/search/reload and mobile layout on the actual public
URL. No new hosting account or paid service is required.
