# Sprint 1 — Initial 3D prototype and wall API extension

> One Sprint 1 with an initial prototype and its implementation extension—not a new sprint. Git history evidences the initial repository on 17 September 2026, frontend wall interaction on 4 November, and planning-doc updates on 5 and 9 November. These are commit dates, not asserted sprint boundaries.

## Sprint Information
- Goal: Extend the initial one-wall viewport into a modular backend-backed multiwall workflow, with wall connections, automated checks and CI.
- Planning window: **2–22 November 2026 (provisional three-week Sprint 1 target)**. This is an illustrative schedule, not a claim that all historical development occurred on these dates; the existing Sprint 2 plan overlaps and needs team scheduling reconciliation.
- Estimate: 46 person-hours reconstructed for the extension, not measured actual effort. See the owner/subtask roll-up below.
- Status: Backend/API and tests are present; 10 backend tests, 3 frontend tests, frontend typecheck and build passed locally. CI workflow includes the same checks; no remote GitHub Actions execution evidence yet.
- Tracker: Historical issue estimates/actuals below are tracker-recorded only. No new issues are claimed as created. Organization milestone [#1](https://github.com/SypProject-3blindtocodeMice/SypProject-3blindtocodeMice-/milestone/1) exists; issue creation was blocked by PAT permission (403).

## Sprint Backlog — extension work

| ID | Task | Assignee | Priority | Estimate | Dependencies | Status / evidence |
|---|---|---|---|---:|---|---|
| FV-016 | Modular backend wall service/API: create, read, update; no delete | David Zwettler | Must Have | 16 h | Shared wall request/response shape | Implemented in working tree; backend API/service/repository split present; tests cover API/service behavior |
| FV-017 | Frontend API client, wall creation and multiwall display/edit | Audrey Wimmer | Must Have | 14 h | FV-016 endpoint contract | Implemented in working tree; API module and frontend edits present; typecheck reported passing |
| FV-018 | Model and validate wall-to-wall connections | Aniket Tripathi | Must Have | 8 h | FV-016 wall representation; FV-017 render integration | Implemented in working tree; see current wall model; connection scope remains limited (known limitations below) |
| FV-019 | Backend/frontend test coverage and CI workflow | Aniket Tripathi (tests); David Zwettler (CI integration) | Must Have | 8 h | FV-016–018; stable commands | 10 backend and 3 frontend tests plus typecheck/build passed locally; workflow updated, remote run pending. |
|  | **Total** | **David 18 h; Audrey 14 h; Aniket 14 h** |  | **46 h** |  | Reconstructed planning allocation; not actual effort |

### Reconstructed subtask allocation (person-hours)

| ID | Subtask | Owner | Estimate | Status / evidence |
|---|---|---|---:|---|
| FV-016a | Define wall DTOs and modular API/service/repository boundary | David | 5 h | Present in backend project structure |
| FV-016b | Implement create/read/update endpoints, validation and error handling | David | 7 h | Wall endpoints/service present; no delete operation in scope |
| FV-016c | Review API contract and wire configuration | David | 4 h | API consumed by frontend; estimate reconstructed |
| FV-017a | Implement typed frontend API calls and failure handling | Audrey | 4 h | `frontend/src/api/` present |
| FV-017b | Add wall creation and multiwall state/rendering | Audrey | 7 h | Frontend working-tree edits present |
| FV-017c | Verify frontend typecheck and integration behavior | Audrey | 3 h | Typecheck reported passing; no independent end-to-end result recorded |
| FV-018a | Define wall connection representation and constraints | Aniket | 3 h | Wall model changes present |
| FV-018b | Connect/render adjacent walls and handle invalid connections | Aniket | 3 h | Working-tree implementation; limited topology, not room validation |
| FV-018c | Add connection-focused tests/review | Aniket | 2 h | Included in reported backend suite; detailed per-case run record not captured |
| FV-019a | Add service and API tests | Aniket | 3 h | 10 backend tests passed locally |
| FV-019b | Add/verify frontend checks and test coverage | Aniket | 2 h | 3 frontend model/API tests plus typecheck/build passed locally; no browser automation |
| FV-019c | Extend existing CI last for push and pull_request | David | 3 h | Workflow updated with restore/build/tests/typecheck; GitHub run not verified |

Estimates are reconstructed from this task decomposition to total 46 h (David 18, Audrey 14, Aniket 14). They are neither measured actuals nor tracker-confirmed subtask estimates. Do not derive historical issue actuals from them.

### Acceptance criteria
- Backend exposes create, read and update for walls, with input validation and useful error responses; delete is explicitly out of scope.
- Frontend creates and displays multiple walls through the API, and visibly handles API failures.
- Wall connections are represented consistently across API/model/frontend; malformed or dangling connections are rejected where implemented.
- Automated backend tests pass (10); frontend tests pass (3), typecheck and build pass locally. Workflow config runs these checks on both `push` and `pull_request`, without deployment; remote execution remains unverified.
- Demonstration uses a small multiwall case. This does not imply closed rooms, room adjacency/area/volume validation, persistence, arbitrary geometry, or engineering simulation.

### Priority, dependencies and known limitations
- FV-016–019 are Must Have for this Sprint 1 extension. FV-016 is the contract dependency for frontend and connection integration; FV-019 CI setup follows stable test commands and is intentionally last.
- Current backend uses an in-memory repository: data does not persist across process restarts. This is a prototype boundary, not durable project storage.
- Wall connections are not equivalent to validated room topology; #22–23 still cover rendering/validation of connected rooms. Reconcile overlap and acceptance boundaries with those existing issues in later planning; do not automatically reassign or close them.
- No issue creation is asserted: PAT returned 403 for issue creation. Existing organization milestone #1 is linked above.

## Historical prototype and tracker evidence

## Sprint Information
- Historical dates: commit dates are recorded above; the provisional 2–22 November Sprint 1 window is for planning only, not measured activity.
- Goal: Establish a runnable visualization proof of concept and present the project direction.
- Historical tracker effort: 26 h estimated / 26.5 h actual across the recorded issues; these figures are tracker-recorded, not independently measured in this reconstruction.

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
