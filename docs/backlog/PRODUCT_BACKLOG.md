# FurnaView Product Backlog

**Effort and progress:** Estimates and recorded effort are person-hours. Estimates are not actuals; the Downloads TSV is the source for recorded actual effort and reported sub-issue progress. Where the TSV has no estimate or progress (most planned feature issues), the hours below are provisional planning estimates and sub-issue progress is unreported—not assumed to be zero or complete. Confirm estimates and task breakdowns in the issue tracker before commitment. Estimates include focused test/debug/integration work unless noted.
**Planning window:** 9 November 2026 - 31 January 2027; six upcoming sprints. Capacity must be checked against the team’s actual school calendar and is not a substitute for the issue-level estimates.

The backlog is task-based: each row is a bounded work item with a unique ID. Sprint plans select these same IDs; do not duplicate or count the same work twice. 

## Sprint 1 - Initial 3D prototype and wall API extension

| ID | Work Task | Estimate | Priority | Primary Owner | Depends On | Status |
|---|---|---:|---|---|---|---|
| FV-016 | Modular backend wall service/API: create, read, update (no delete) | 16 h* | Must Have | David Zwettler | Shared wall contract | Implemented in working tree; 10 backend tests passed locally |
| FV-017 | Frontend API client, wall creation and multiwall display/edit | 14 h* | Must Have | Audrey Wimmer | FV-016 API contract | Implemented in working tree; typecheck reported passing |
| FV-018 | Represent and validate wall-to-wall connections | 8 h* | Must Have | Aniket Tripathi | FV-016 wall model; FV-017 render integration | Implemented in working tree; limited topology |
| FV-019 | Backend/frontend test coverage and CI for push + pull_request | 8 h* | Must Have | Aniket Tripathi (tests); David Zwettler (CI) | FV-016–018; stable commands | 10 backend, 3 frontend tests pass locally; CI configured, remote run unverified |

*Reconstructed estimates, not measured effort or tracker-confirmed subtask estimates. Total 46 h: David 18 h, Audrey 14 h, Aniket 14 h, including tests, review and CI. Backend tests (10) and frontend tests (3), typecheck and build passed locally; remote CI remains unverified. See `sprints/sprint-1/BACKLOG.md` for subtasks and limitations.*

## Historical Sprint 1 - Initial 3D viewport prototype

| ID | Work Task | Estimate | Priority | Status / sub-issue progress |
|---|---|---:|---|---|
| FV-H01 (issue #2) | Bootstrap the frontend and show an initial wall in a navigable 3D viewport | 16 h estimate; 17 h actual | Must Have | Complete; 5/5 sub-issues (100%) |
| FV-H02 (issue #3) | Prepare the Sprint 1 review presentation and next room milestone | 6 h estimate; 5.5 h actual | Should Have | Complete; sub-issue progress not reported |
| FV-H03 (issue #9) | Set up the server | 4 h estimate; 4 h actual | Must Have | Done; sub-issue progress not reported |

*Historical issue time and estimates here are tracker-recorded only (26 h estimated; 26.5 h actual across recorded work). No October sprint dates are inferred: commit history documents the initial repository on 17 September, frontend work on 4 November, and planning document changes on 5 and 9 November 2026. The viewport and presentation are evidenced in the repository; server setup completion is recorded in the tracker data.*

## Sprint 2 - Agree on the narrow MVP scope and semantic building model

| ID | Work Task | Estimate | Priority | Primary Owner | Depends On | Status |
|---|---|---:|---|---|---|---|
| FV-001 (issue #10) | Confirm the January MVP boundary, model units/IDs, and team integration contract | 8 h | Must Have | David Zwettler | Current viewport; team agreement | Planned; 0/4 sub-issues (0%) |
| FV-002 (issue #11) | Define a single-floor semantic building model and two-room fixture | 14 h | Must Have | David Zwettler | FV-001 | Planned; 0/4 sub-issues (0%) |
| FV-015 (issue #20) | Define website layout and visual design | 8 h | Should Have | Audrey Wimmer | Team agreement | Planned; sub-issue progress not reported |

## Sprint 3 - Render and validate a connected two-room model

| ID | Work Task | Estimate | Priority | Primary Owner | Depends On | Status |
|---|---|---:|---|---|---|---|
| FV-003 (issue #22) | Render connected walls and room surfaces from the semantic fixture | 16 h* | Must Have | Audrey Wimmer | FV-002 | Planned |
| FV-004 (issue #23) | Validate closed rooms, shared boundaries, adjacency, area, and volume | 12 h* | Must Have | David Zwettler | FV-002 | Planned |

The product backlog also includes styling work from issue #21 (3D viewport), issue #26 (editor page), issue #29 (upload page), and issue #36 (final website polish). The reference TSV does not estimate these items; they are **unestimated and unscheduled**, not zero-effort work. Size and schedule them with the team before commitment.

## Sprint 4 - Create/edit a small plan with semantic openings

| ID | Work Task | Estimate | Priority | Primary Owner | Depends On | Status |
|---|---|---:|---|---|---|---|
| FV-005 (issue #24) | Create and correct a small floor plan with simple building-specific controls | 18 h* | Must Have | Audrey Wimmer | FV-002, FV-003, FV-004 | Planned |
| FV-006 (issue #25) | Add semantic doors/windows and basic room occupancy properties | 12 h* | Must Have | David Zwettler | FV-002, FV-005 | Planned |

## Sprint 5 - Import one controlled floor plan and review candidates

| ID | Work Task | Estimate | Priority | Primary Owner | Depends On | Status |
|---|---|---:|---|---|---|---|
| FV-007 (issue #27) | Import one controlled floor-plan image and produce candidate wall geometry | 12 h* | Must Have | Aniket Tripathi | FV-002, FV-004 | Planned |
| FV-008 (issue #28) | Review and correct imported candidate geometry before model confirmation | 6 h* | Must Have | Audrey Wimmer | FV-005, FV-007 | Planned |

## Sprint 6 - Run a simplified CO2 scenario and compare results

| ID | Work Task | Estimate | Priority | Primary Owner | Depends On | Status |
|---|---|---:|---|---|---|---|
| FV-009 (issue #30) | Configure a room-level CO2 scenario with explicit units and flow assumptions | 8 h* | Must Have | Aniket Tripathi | FV-002, FV-006 | Planned |
| FV-010 (issue #31) | Calculate a deterministic simplified room-average CO2 time series | 17 h* | Must Have | Aniket Tripathi | FV-009 | Planned |
| FV-011 (issue #32) | Visualize CO2 results and compare one changed scenario input | 10 h* | Must Have | Audrey Wimmer | FV-009, FV-010 | Planned |

## Sprint 7 - Integrate, verify, document, and roll out the MVP

| ID | Work Task | Estimate | Priority | Primary Owner | Depends On | Status |
|---|---|---:|---|---|---|---|
| FV-012 (issue #33) | Integrate the manual-plan path through validation, 3D, analysis, and comparison | 14 h* | Must Have | David Zwettler | FV-003, FV-004, FV-005, FV-006, FV-009, FV-010, FV-011 | Planned |
| FV-013 (issue #34) | Verify controlled import and manual paths and fix MVP-blocking defects | 10 h* | Must Have | David Zwettler | FV-007, FV-008, FV-012 | Planned |
| FV-014 (issue #35) | Prepare instructions, package, smoke-test, and roll out the MVP | 8 h* | Must Have | David Zwettler | FV-012, FV-013 | Planned |

## Work item acceptance criteria

*The issue tracker currently has blank estimate/effort and sub-issue progress fields for these future feature issues. The starred figures are provisional estimates retained from the planning breakdown, not tracker-confirmed estimates or actual effort. Confirm estimates and add/track sub-issues in the tracker before sprint commitment.*

### FV-016 - Establish modular backend solution and wall API
- **Description:** Implement a modular backend wall service/API for create, read and update using a shared request/response contract; delete is out of scope.
- **Acceptance criteria:** Wall operations validate input, return consistent errors, and leave valid data unchanged on rejected updates; API contract is used by frontend. Backend suite passes.
- **Estimate / priority:** 16 person-hours, reconstructed / Must Have.
- **Primary owner:** David Zwettler. **Dependencies:** Shared wall contract. **Target:** Sprint 1 extension. **Status:** Implemented in working tree; tests reported passing.

### FV-017 - Connect frontend to wall API and support create/multiwall editing
- **Description:** Replace isolated wall-only interaction with API-backed wall creation and display/edit of multiple walls.
- **Acceptance criteria:** User can create multiple walls through the interface, see server validation feedback, and render returned walls with stable IDs.
- **Estimate / priority:** 14 person-hours, reconstructed / Must Have.
- **Primary owner:** Audrey Wimmer. **Dependencies:** FV-016 contract. **Target:** Sprint 1 extension. **Status:** Implemented in working tree; frontend typecheck reported passing.

### FV-018 - Represent wall connections and validate connected multiwall input
- **Description:** Define and validate explicit connections between walls without claiming room/topology support beyond the bounded wall case.
- **Acceptance criteria:** Connected walls retain stable identities and connections; malformed or dangling references are rejected with actionable feedback; tests cover connected and disconnected cases.
- **Estimate / priority:** 8 person-hours, reconstructed / Must Have.
- **Primary owner:** Aniket Tripathi. **Dependencies:** FV-016 wall model; FV-017 render integration. **Target:** Sprint 1 extension. **Status:** Implemented in working tree; limited topology, no room validation claim.

### FV-019 - Tests and integration checks
- **Description:** Add focused backend/frontend tests and CI checks triggered by both pushes and pull requests. Add CI last after commands stabilize.
- **Acceptance criteria:** Backend tests (10 passing), frontend tests (3 passing), typecheck and build pass locally; CI runs equivalent checks on push and pull_request without deployment.
- **Estimate / priority:** 8 person-hours, reconstructed / Must Have.
- **Primary owner:** Aniket Tripathi (tests); David Zwettler (CI integration). **Dependencies:** FV-016–018 and stable commands. **Target:** Sprint 1 extension. **Status:** Tests pass locally; CI configured, remote run unverified.

### FV-001 - Confirm the January MVP boundary, model units/IDs, and team integration contract
- **Description:** Confirm the January MVP boundary, model units/IDs, and team integration contract.
- **Acceptance criteria:** Agreed MVP boundary and shared model handoff are recorded in the decision register.
- **Estimate / priority:** 8 person-hours / Must Have.
- **Primary owner:** David Zwettler. **Dependencies:** Current viewport; team agreement. **Target:** Sprint 2. **Status:** Planned.

### FV-002 - Define a single-floor semantic building model and two-room fixture
- **Description:** Define a single-floor semantic building model and two-room fixture.
- **Acceptance criteria:** Two-room fixture preserves IDs and room/wall/opening relationships; invalid values are rejected.
- **Estimate / priority:** 14 person-hours / Must Have.
- **Primary owner:** David Zwettler. **Dependencies:** FV-001. **Target:** Sprint 2. **Status:** Planned.

### FV-003 - Render connected walls and room surfaces from the semantic fixture
- **Description:** Render connected walls and room surfaces from the semantic fixture.
- **Acceptance criteria:** Two connected rooms render at the expected scale and can be explored with basic camera controls.
- **Estimate / priority:** 16 person-hours / Must Have.
- **Primary owner:** Audrey Wimmer. **Dependencies:** FV-002. **Target:** Sprint 3. **Status:** Planned.

### FV-004 - Validate closed rooms, shared boundaries, adjacency, area, and volume
- **Description:** Validate closed rooms, shared boundaries, adjacency, area, and volume.
- **Acceptance criteria:** Valid fixture produces room measures/adjacency; an open or malformed room is flagged.
- **Estimate / priority:** 12 person-hours / Must Have.
- **Primary owner:** David Zwettler. **Dependencies:** FV-002. **Target:** Sprint 3. **Status:** Planned.

### FV-005 - Create and correct a small floor plan with simple building-specific controls
- **Description:** Create and correct a small floor plan with simple building-specific controls.
- **Acceptance criteria:** A user can create or adjust a small plan and see the change in the 3D view.
- **Estimate / priority:** 18 person-hours / Must Have.
- **Primary owner:** Audrey Wimmer. **Dependencies:** FV-002, FV-003, FV-004. **Target:** Sprint 4. **Status:** Planned.

### FV-006 - Add semantic doors/windows and basic room occupancy properties
- **Description:** Add semantic doors/windows and basic room occupancy properties.
- **Acceptance criteria:** A door/window can attach to a valid wall; room occupancy accepts non-negative values.
- **Estimate / priority:** 12 person-hours / Must Have.
- **Primary owner:** David Zwettler. **Dependencies:** FV-002, FV-005. **Target:** Sprint 4. **Status:** Planned.

### FV-007 - Import one controlled floor-plan image and produce candidate wall geometry
- **Description:** Import one controlled floor-plan image and produce candidate wall geometry.
- **Acceptance criteria:** The agreed high-contrast, known-scale sample yields editable candidates or a clear failure; unsupported input leaves the current model unchanged.
- **Estimate / priority:** 12 person-hours / Must Have.
- **Primary owner:** Aniket Tripathi. **Dependencies:** FV-002, FV-004. **Target:** Sprint 5. **Status:** Planned.

### FV-008 - Review and correct imported candidate geometry before model confirmation
- **Description:** Review and correct imported candidate geometry before model confirmation.
- **Acceptance criteria:** Candidates are visibly provisional; correction and manual fallback are available.
- **Estimate / priority:** 6 person-hours / Must Have.
- **Primary owner:** Audrey Wimmer. **Dependencies:** FV-005, FV-007. **Target:** Sprint 5. **Status:** Planned.

### FV-009 - Configure a room-level CO2 scenario with explicit units and flow assumptions
- **Description:** Configure a room-level CO2 scenario with explicit units and flow assumptions.
- **Acceptance criteria:** Required initial/outdoor concentration, occupancy, duration and prescribed flow inputs validate with clear errors.
- **Estimate / priority:** 8 person-hours / Must Have.
- **Primary owner:** Aniket Tripathi. **Dependencies:** FV-002, FV-006. **Target:** Sprint 6. **Status:** Planned.

### FV-010 - Calculate a deterministic simplified room-average CO2 time series
- **Description:** Calculate a deterministic simplified room-average CO2 time series.
- **Acceptance criteria:** A fixed scenario produces repeatable values and passes an analytical reference/boundary check; output is labeled a planning estimate.
- **Estimate / priority:** 17 person-hours / Must Have.
- **Primary owner:** Aniket Tripathi. **Dependencies:** FV-009. **Target:** Sprint 6. **Status:** Planned.

### FV-011 - Visualize CO2 results and compare one changed scenario input
- **Description:** Visualize CO2 results and compare one changed scenario input.
- **Acceptance criteria:** Room result values/time/units and disclosure are visible; two runs show a basic difference without overwriting either.
- **Estimate / priority:** 10 person-hours / Must Have.
- **Primary owner:** Audrey Wimmer. **Dependencies:** FV-009, FV-010. **Target:** Sprint 6. **Status:** Planned.

### FV-012 - Integrate the manual-plan path through validation, 3D, analysis, and comparison
- **Description:** Integrate the manual-plan path through validation, 3D, analysis, and comparison.
- **Acceptance criteria:** Team demonstrates the manual plan-to-results workflow on a repeatable fixture.
- **Estimate / priority:** 14 person-hours / Must Have.
- **Primary owner:** David Zwettler. **Dependencies:** FV-003, FV-004, FV-005, FV-006, FV-009, FV-010, FV-011. **Target:** Sprint 7. **Status:** Planned.

### FV-013 - Verify controlled import and manual paths and fix MVP-blocking defects
- **Description:** Verify controlled import and manual paths and fix MVP-blocking defects.
- **Acceptance criteria:** A concise acceptance checklist passes for both paths; failures preserve the last valid model.
- **Estimate / priority:** 10 person-hours / Must Have.
- **Primary owner:** David Zwettler. **Dependencies:** FV-007, FV-008, FV-012. **Target:** Sprint 7. **Status:** Planned.

### FV-014 - Prepare instructions, package, smoke-test, and roll out the MVP
- **Description:** Prepare instructions, package, smoke-test, and roll out the MVP.
- **Acceptance criteria:** Package starts using documented steps; core smoke checks pass; demonstration/rollout is complete by 31 January 2027.
- **Estimate / priority:** 8 person-hours / Must Have.
- **Primary owner:** David Zwettler. **Dependencies:** FV-012, FV-013. **Target:** Sprint 7. **Status:** Planned.

## Post-MVP backlog (not scheduled in the January plan)

| ID | Work Task | Estimate (h) | Priority | Primary Owner | Depends On | Target | Status |
|---|---|---:|---|---|---|---|---|
| FV-F01 | Save, reopen, and recover versioned local building projects | 16 | Should Have | David Zwettler | FV-002, FV-012 | Post-MVP | Deferred |
| FV-F02 | Support additional plan formats and robust import error handling | 24 | Should Have | Aniket Tripathi | FV-007, FV-008 | Post-MVP | Deferred |
| FV-F03 | Measure recognition quality and improve detection across controlled plan styles | 30 | Should Have | Aniket Tripathi | FV-F02 | Post-MVP | Deferred |
| FV-F04 | Extend building geometry/editor for multiple floors, dimensions, undo/redo, and richer openings | 32 | Should Have | Audrey Wimmer | FV-005, FV-006 | Post-MVP | Deferred |
| FV-F05 | Add temperature/humidity indicators and validate assumptions | 30 | Could Have | Aniket Tripathi | FV-010 | Post-MVP | Deferred |
| FV-F06 | Add advanced airflow or thermal analysis through a separately validated engine | 50+ | Could Have | Aniket Tripathi | FV-F05; technical research | Post-MVP | Deferred |
| FV-F07 | Add sensor telemetry and simulation-versus-measurement views | 40 | Won't Have for MVP | David Zwettler | FV-F01, FV-F06; privacy review | Post-MVP | Deferred |
| FV-F08 | Add an approved optional extension: VR walkthrough, collaboration, or room booking | 32 (provisional) | Won't Have for MVP | Audrey Wimmer | User validation and separate scope approval | Post-MVP | Deferred |
| FV-F09 | Build professional CAD/BIM authoring or certified engineering calculations | Not estimated | Won't Have for MVP | Team | Separate product decision and specialist validation | Not planned | Out of scope |

## Unestimated product backlog items from the issue tracker

The following product work exists in the Downloads TSV but has no issue estimate and is not included in sprint totals. Groom and estimate before scheduling.

| Issue | Work Task | Estimate | Status |
|---|---|---:|---|
| #21 | Style the 3D viewport on the website | Not estimated | Unscheduled |
| #26 | Style editor page (toolbar, settings, and errors) | Not estimated | Unscheduled |
| #29 | Style upload page (upload area, progress/errors, suggested-wall legend) | Not estimated | Unscheduled |
| #36 | Final website polish (loading/empty states, smaller screens, demo readiness) | Not estimated | Unscheduled |

## Scope and schedule note

This is a deliberate minimum integrated MVP for January 2027, not the full scope of every longer-term idea in the proposal. It includes a narrow supported recognition sample and a single room-average CO2 analysis. More robust recognition and broader environmental analysis remain visible in the post-MVP backlog rather than being implied complete. Issue #20 adds 8 h of Sprint 2 website layout/design work; this takes Sprint 2 to 30 h, above the previously stated 24 h capacity, and requires explicit capacity approval or scope movement. Unestimated styling issues are excluded from the January commitment until estimated. Confirm scope and capacity with the supervisor.


## Post-MVP acceptance notes

- **FV-F01:** Save and reopen a versioned project without losing semantic IDs; corrupt/unsupported files fail without replacing the last valid project.
- **FV-F02:** Each added input format has fixtures, file validation, scale handling, and clear unsupported-input errors.
- **FV-F03:** Recognition precision/recall, correction time, and failure cases are measured on usage-cleared plans; no universal accuracy claim.
- **FV-F04:** Expanded edits preserve semantic identity and pass topology/model validation.
- **FV-F05:** Additional metrics show units, assumptions, and validated reference cases.
- **FV-F06:** Engine choice, licensing, reproducibility, accuracy boundaries, and hardware needs are assessed before implementation.
- **FV-F07:** Sensor data is mapped to semantic rooms with a documented privacy/retention model and clear separation from simulated values.
- **FV-F08:** Any selected extension has an approved user need and acceptance scope before work is scheduled.
- **FV-F09:** This is explicitly outside FurnaView's intended MVP; do not represent planning estimates as certified engineering results.
