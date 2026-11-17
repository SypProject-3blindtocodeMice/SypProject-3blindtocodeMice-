# Sprint Overview

> Sprint 1 is the original prototype plus its wall-API extension—not a new sprint. Existing Sprint 2–7 planning cadence is retained; reconcile overlap with issues #22–23 during later grooming without automatically reassigning them. Dates below for Sprint 2–7 are the existing planning assumptions.

| Sprint | Dates | Main Goal | Estimated Hours | Main Deliverable |
|---|---|---|---:|---|
| 01 | 02–22 Nov 2026 (provisional three-week target) | Initial 3D prototype extended with modular wall API, multiwall frontend, connections, tests and CI | 13.5 h* extension estimate; 9 h 30 worked | Backend/API and frontend changes present; 10 backend and 3 frontend tests, typecheck and build passed locally; CI configured, remote run passed |
| 02 | 09 Nov to 22 Nov 2026 | Agree on a small semantic model, lock MVP boundary, and establish website visual design | 30 (baseline capacity 24; +6) | Shared model/scope agreement, two-room fixture, and website layout/design |
| 03 | 23 Nov to 06 Dec 2026 | Render and validate a connected two-room semantic model | 28 (capacity 32) | Render and validate a connected two-room semantic model |
| 04 | 07 Dec to 20 Dec 2026 | Create and edit a small plan with semantic openings in 3D | 30 (capacity 32) | Create and edit a small plan with semantic openings in 3D |
| 05 | 21 Dec to 03 Jan 2027 | Import one controlled plan, review candidate geometry, and retain manual fallback | 18 (capacity 18) | Import one controlled plan, review candidate geometry, and retain manual fallback |
| 06 | 04 Jan to 17 Jan 2027 | Configure and run one validated room-level CO2 scenario and compare results | 35 (capacity 35) | Configure and run one validated room-level CO2 scenario and compare results |
| 07 | 18 Jan to 31 Jan 2027 | Integrate, acceptance-test, document, and roll out the MVP by 31 January | 32 (capacity 34) | Integrate, acceptance-test, document, and roll out the MVP by 31 January |

## Capacity and schedule assessment

- The provisional Sprint 1 target (2–22 November) overlaps the existing Sprint 2 calendar (9–22 November). These are planning windows, not recorded work dates; team coordination must reconcile the overlap before treating both as simultaneous capacity commitments. Sprint 2–7 retain two-week cadence in the existing plan.

- Future scheduled effort: **173 person-hours** across six sprints (historical Sprint 1 excluded), including issue #20's 8 h estimate.
- Planned effort split including peer work: David Zwettler: 61 h; Audrey Wimmer: 62 h; Aniket Tripathi: 50 h (issue #20 assigned to Audrey for planning; confirm with assignees).
- Capacity is 24-36 team hours for normal school sprints; Sprint 5 is deliberately limited to 18 hours across the Christmas period. No holiday overtime is assumed.
- January completion is plausible only for this deliberately narrowed MVP, with manual editing, one controlled import sample, one simplified CO2 analysis, and a minimal comparison. Broad recognition, advanced analysis, and polish do not fit.
- All documented MVP use cases have a minimal path, but image recognition scope is constrained and should be confirmed with the supervisor. If recognition fails, deliver manual fallback and explicitly report the target-MVP deviation.
- Rollout is included in Sprint 7 and must be completed by 31 January 2027. No planned February development sprint.
- Sprint 2 is 6 h over its 24 h baseline. The tracker provides no estimate for styling issues #21, #26, #29, or #36; those remain unscheduled and are not included in the 173 h total.
- Historical issue effort values (14 h estimated / 9 h 46 worked, including 1 h server setup) are rescaled to the work blocks in the commit history, not independently measured. Repository history shows commits on 17 September, 4 November and 7–10 November 2026; it does not establish October sprint dates.
- Sprint 1 extension estimate is rescaled to the recorded work blocks, not tracker-confirmed: 13.5 h (David 8.5 h, Audrey 2 h, Aniket 3 h); recorded extension work is 9 h 30. It is the continuation of Sprint 1, not added as a new sprint to the existing Sprint 2–7 cadence or 173 h future total.
- Sprint 1 recorded effort across 4–10 November 2026 totals 31 h 16 (1,876 minutes): 19 h 16 on tracked issues (#2–#3, #9, #37–#40), 6 h on backlog documentation, and 6 h on unassigned planning/tooling. Shared issues #2 and #3 are split evenly across their three assignees; per-person totals are David 22 h 55, Audrey 4 h 10, Aniket 4 h 10.
- Sprint 1 has a modular wall API with create/read/update (no delete), API-backed multiwall frontend, and wall connection work. CI is configured for `push` and `pull_request`; a remote run has not been verified.
- The connected-wall increment overlaps conceptually with existing #22–23 (connected wall rendering and room validation). Preserve those issues and reconcile scope/acceptance later; do not automatically reassign or close them. Sprint 1 extension is tracked by parent issues #37–40 and 12 native sub-issues #41–52, all in milestone #1; these remain open pending team review and remote/browser verification.

