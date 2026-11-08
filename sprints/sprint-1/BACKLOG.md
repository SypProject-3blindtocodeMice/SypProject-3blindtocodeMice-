# Sprint 1 — Initial 3D viewport prototype

## Sprint Information
- Start: October 2026 (planning assumption: 12 October 2026).
- End: October 2026 (planning assumption: 25 October 2026).
- Goal: Establish a runnable visualization proof of concept and present the project direction.
- Planned capacity: 24 team person-hours (retrospective planning assumption; actual recorded effort exceeded it).
- Estimated workload: 26 team person-hours from the issue tracker; recorded effort: 26.5 team person-hours.

## Sprint Backlog

| ID | Task | Assignee | Priority | Estimate | Status / sub-issue progress |
|----|------|----------|----------|----------|--------|
| FV-H03 (issue #9) | Server setup | Jimmy0rban | Must Have | 4 h estimated / 4 h actual | Done; sub-issue progress not reported |
| FV-H01 (issue #2) | Bootstrap frontend and render an initial wall in a navigable 3D viewport | Aniket Tripathi, Audrey Wimmer, Jimmy0rban | Must Have | 16 h estimated / 17 h actual | Evidence present; initial prototype only; 5/5 sub-issues (100%) |
| FV-H02 (issue #3) | Prepare the Sprint 1 review presentation and next room milestone | Aniket Tripathi, Audrey Wimmer, Jimmy0rban | Should Have | 6 h estimated / 5.5 h actual | Presentation artifact present; sub-issue progress not reported |

## Task Details

### FV-H01 — Runnable initial-wall viewport
Description: Create the first visible 3D proof of concept for FurnaView.

Implementation scope: The repository contains a React/Vite frontend with a scene, wall mesh, ground grid, and camera controls. The Sprint 1 presentation README explicitly describes the screenshot as showing the initial wall, not a completed room.

Dependencies: None documented.

Acceptance criteria: 

Estimated effort: 16 person-hours; recorded effort: 17 person-hours (Downloads TSV).

Assignee: Audrey Wimmer (primary frontend/3D responsibility).

#### Issue #2 sub-issues (all complete)

The parent issue's 16 h estimate / 17 h actual is the only recorded effort breakdown available; the tracker does not report per-sub-issue estimates, actual hours, or dependencies. Do not divide the parent hours across children or treat their sequence below as a tracker dependency.

| Issue | Sub-issue | Stated completion condition | Estimate / actual | Status |
|---|---|---|---|---|
| #4 | Bootstrap React/Vite frontend project | `frontend/` builds and runs with the dev server; dependencies are committed | Not reported | Closed / complete |
| #5 | Set up the 3D scene, renderer and lighting | A scene renders in the browser viewport with visible lighting | Not reported | Closed / complete |
| #6 | Add a ground grid for spatial orientation | A grid is visible under the scene origin | Not reported | Closed / complete |
| #7 | Create the initial wall mesh | One wall mesh renders at a defined position and size | Not reported | Closed / complete |
| #8 | Add camera navigation controls (orbit/zoom/pan) | The user can rotate, zoom and pan around the wall | Not reported | Closed / complete |

**Parent roll-up:** 16 h estimated / 17 h actual; 5/5 child issues complete (100%). The tracker records no issue dependencies for these children.

### FV-H02 — Review presentation
Description: Summarize project purpose, Plan → Explore → Understand vision, actual Sprint 1 work, and next room milestone.

Implementation scope: Existing Reveal.js presentation in this directory.

Dependencies: FV-H01.

Acceptance criteria: Presentation source, README, and viewport screenshot are present.

Estimated effort: 6 person-hours; recorded effort: 5.5 person-hours (Downloads TSV).

Assignee: David Zwettler (project coordination and review artifact).

## Definition of Done

- Relevant source and review artifacts are present in the repository.

## Risks and Blockers

- The prototype currently demonstrates one wall; connected rooms and the semantic building model remain the next implementation milestone.

## Sprint Review / Results

The team established a runnable 3D viewport showing an initial wall and prepared the Sprint 1 review presentation. The screenshot is explicitly an initial-wall prototype; the next milestone was a room. Evidence: `README.md`, `src/main.js`, `assets/prototype-viewport.png`, and frontend source under `../../frontend/src/`.
