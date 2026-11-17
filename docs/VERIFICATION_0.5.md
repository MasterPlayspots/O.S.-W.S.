# Verification — v0.5 English / OurArk brand

Date: 17 November 2026 (Europe/Berlin). Environment: Node.js 24.22.1, Linux, Chromium.

- `npm test`: **55 passed, 0 failed**. Existing API/scoping/concurrency/usage/planner/integration coverage retained; assertions now use English messages.
- Added regression: English defaults do not rewrite existing German titles or notes after store restart; both main UI and setup declare `lang=en`.
- Browser: fresh English demo, three code and three session panes; save layout → revision 1. Explicit local repository read and synthetic JSON-memory check → checked status; all four memory entries displayed with provenance.
- Three actual English screenshots saved under `docs/screenshots/`. Synthetic data is prominently identified.
- No production Linux instance changed. No live model invocation or external connector execution was tested. This is not a complete accessibility or mobile-device audit.

The core has no npm dependencies or build step. Private `.local/` state is ignored. Development uses a separate `.local/development-v05` directory so screenshots do not overwrite a prior personal profile. Old stored user text remains in its existing language.
