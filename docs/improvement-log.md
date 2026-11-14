# Improvement log — 14 November 2026 IST

Repository: atishayjain005/JustNotes. Baseline: 9109fb5, last updated May 2021.
No existing issues, PRs or rejected proposals were found. Dedicated Project #11:
https://github.com/users/atishayjain005/projects/11

All ideas below are recommended safe, scoped fixes. Status: Review / Testing.
Each requires merging to main and verifying the existing free Pages deployment.

| Problem | Proposed improvement | Reason and expected impact | Complexity | Risk |
| --- | --- | --- | --- | --- |
| Stored note text interpolated into HTML; malformed storage crashes | Safe DOM rendering and guarded storage | Prevent markup execution and preserve unreadable data/input | Small | Low; legacy array format retained |
| Contenteditable changes disappear on reload | Explicit edit/save/cancel | Make existing editing behavior durable and keyboard usable | Small | Low; reload tests |
| Case-sensitive contents, form reload and stale filtered cards | Normalize search, prevent navigation, reapply filters | Consistent results after add/edit/delete with empty feedback | Small | Low |
| Hidden mobile search, wrong label, overflow and low contrast | Visible search, correct labels/focus, responsive grid and readable heading | Usable notes flow at 320px and with keyboard | Small | Low; visual and browser checks |
| Other tabs overwrite new notes; mutations discard open edits | Check storage snapshot and guard open drafts | Preserve user work and expose recoverable conflicts | Small | Low; two-page tests |
| No tests, setup docs or regression gate | Browser tests, syntax checks and GitHub Actions | Reproducible review and deployment validation | Small | Low; no production dependency |

Deployment follow-up (Backlog): review/merge PR, verify Pages build and real public
flows. Complexity small; risk low; recommendation proceed after review. No new
infrastructure required. The live site still served the 2021 version during this
run; no updated deployment is claimed.

No approval requests, approval deadlines or auto-approvals in this run.
No secrets or environment files added. Notes remain browser-local. The UI now
describes this accurately instead of presenting an inert Login/SignUp button.
The existing purple/wave visual direction is retained.
