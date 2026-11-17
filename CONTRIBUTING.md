# Contributing to O.A. - O.S

Read README.md, AGENTS.md and STATE.md. Choose a small issue or describe the concrete problem in a pull request. Branch from current `main`, use Node.js 24+, run `npm test` and `npm run dev`. The current core needs no dependency installation.

Explain the trigger, resulting behavior, source/scoping boundaries, tests and any migration. Keep synthetic fixtures separate from observations. Preserve unknown values, explicit opt-ins and saved layouts. Do not turn a metadata adapter into a command executor implicitly.

For connectors, follow docs/INTEGRATIONS.md: contract, minimal scope, explicit check, freshness, readable failure, provenance and cross-context tests. For UI changes, capture real screenshots with synthetic data and check keyboard/mobile behavior. Mockups are not runtime evidence.

Never include credentials, private memory, customer data, browser profiles or runtime folders. Use SECURITY.md for vulnerability reporting. Preserve license notices, attribute third-party code/assets and discuss new dependencies before broad refactors.

Useful starting contributions: English UI localization, mobile interaction checks, a read-only external adapter, stronger provenance and accessible status/navigation improvements. The roadmap separates delivered and proposed work.
