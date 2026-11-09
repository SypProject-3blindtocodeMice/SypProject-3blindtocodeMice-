# FurnaView Roadmap

> Replanned from the November 2026 baseline for MVP completion by January 2027. This replaces the earlier longer 2028 forecast.

## Milestones

| Sprint | Dates | Milestone |
|---|---|---|
| 01 | 02–22 Nov 2026 (provisional three-week target; overlaps existing Sprint 2 plan) | Initial viewport prototype extended with modular backend wall create/read/update (no delete), API-backed frontend multiwall creation/editing, wall connections, tests and CI on push + pull_request. 46 h reconstructed extension estimate; backend/API and frontend implementation present, 10 backend and 3 frontend tests, typecheck and build passed locally; CI configured, remote run unverified. |
| 02 | 09 Nov 2026 to 22 Nov 2026 | Agree on a small semantic model, lock the January MVP boundary, and establish website layout/visual design (30 h estimated; 24 h baseline capacity, so resolve +6 h overage) |
| 03 | 23 Nov 2026 to 06 Dec 2026 | Render and validate a connected two-room semantic model |
| 04 | 07 Dec 2026 to 20 Dec 2026 | Create and edit a small plan with semantic openings in 3D |
| 05 | 21 Dec 2026 to 03 Jan 2027 | Import one controlled plan, review candidate geometry, and retain manual fallback |
| 06 | 04 Jan 2027 to 17 Jan 2027 | Configure and run one validated room-level CO2 scenario and compare results |
| 07 | 18 Jan 2027 to 31 Jan 2027 | Integrate, acceptance-test, document, and roll out the MVP by 31 January |

## MVP scope

- **January MVP:** manually create/edit a small semantic building; inspect it in interactive 3D; import and review one controlled supported plan; configure occupancy and prescribed airflow; run a simple CO2 zone estimate; view and compare one scenario; package and demonstrate.
- **Completion and rollout:** finish implementation, acceptance checks and MVP rollout no later than **31 January 2027**.
- **Scope reduction:** the broad specification is larger than six student-capacity sprints. This schedule narrows recognition to a controlled sample, analysis to one room-average CO2 model, geometry to a small single-floor plan, and persistence/advanced features are deferred. These changes require team/supervisor agreement; they are not silently treated as satisfying full broad requirements.
- **February:** contingency only, not planned development. If the January gate slips, use contingency for release-blocking fixes and record the exception.

## Risks

- Recognition and geometric validation are uncertain; keep manual creation/correction as a viable fallback.
- Establish shared model units/IDs early: renderer, editor, import and simulation depend on the same semantic data.
- CO2 results depend on explicit flow assumptions; opening state/area alone does not determine ventilation flow. Results must be labeled planning estimates, not engineering-grade CFD.
- If behind schedule, simplify detection and UI presentation before cutting validation, result transparency or the core manual end-to-end flow.
- Styling issues #21, #26, #29, and #36 are present in the issue tracker but unestimated; they are not committed by this roadmap until sized and scheduled.
- Sprint 1's 46 h extension estimate is reconstructed, not actual effort (David 18 h, Audrey 14 h, Aniket 14 h). The original prototype and extension are one Sprint 1; no sprint dates are inferred from commit history.
- Sprint 1 wall connections overlap conceptually with existing issues #22–23. Keep the current Sprint 2–7 cadence and reconcile scope/acceptance in later grooming without automatically reassigning existing issues. The organization milestone #1 exists; issue creation was blocked by PAT permission (403), and no new issues are claimed.
