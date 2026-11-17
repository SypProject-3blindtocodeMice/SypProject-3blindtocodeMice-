# Sprint 06 - Configure and run one validated room-level CO2 scenario and compare results

## Sprint Information
- Start: 2027-01-04
- End: 2027-01-17
- Goal: Configure and run one validated room-level CO2 scenario and compare results.
- Planned capacity: 35 team person-hours; workload is deliberately kept within student availability.
- Estimated workload: 35 person-hours.

## Sprint Backlog

> Tracker sub-issue progress: not reported for the planned feature issues in the Downloads TSV. The task-detail bullets/acceptance criteria below are planning descriptions, not evidence that tracker sub-issues exist or are complete.

| ID | Task | Assignee | Priority | Estimate | Depends On | Status |
|----|------|----------|----------|----------|------------|--------|
| FV-009 (issue #30) | Configure one CO2 analysis scenario | Aniket Tripathi (primary) | Must Have | 8 h* | FV-002, FV-006 | Planned |
| FV-010 (issue #31) | Implement a deterministic room-level CO2 estimate | Aniket Tripathi (primary) | Must Have | 17 h* | FV-009 | Planned |
| FV-011 (issue #32) | Display results and compare one changed scenario | Audrey Wimmer (primary) | Must Have | 10 h* | FV-009, FV-010 | Planned |

* Estimates are provisional planning estimates; issue tracker estimates/progress are not reported for these planned feature issues. Confirm before commitment.

## Task Details
### FV-009 - Configure one CO2 analysis scenario
Description: Collect room occupancy, initial/outdoor CO2, simulation duration and explicitly prescribed ventilation/flow values with units.

Implementation scope: Deliver the bounded MVP increment described here; integrate against the shared fixture or running app, not as an isolated prototype.

Dependencies: FV-002, FV-006.

Acceptance criteria: Valid scenario inputs pass validation; missing/out-of-range values show actionable errors.

Estimated effort: 8 person-hours.

Assignee: Aniket Tripathi (primary); David Zwettler 1 h, Audrey Wimmer 2 h, Aniket Tripathi 5 h including implementation, review, and integration.

### FV-010 - Implement a deterministic room-level CO2 estimate
Description: Implement a small well-mixed zone calculation and tests against an analytical reference; disclose the prescribed-flow assumption.

Implementation scope: Deliver the bounded MVP increment described here; integrate against the shared fixture or running app, not as an isolated prototype.

Dependencies: FV-009.

Acceptance criteria: Repeatable time series passes a reference case and dimensional/boundary checks; no CFD accuracy claims.

Estimated effort: 17 person-hours.

Assignee: Aniket Tripathi (primary); David Zwettler 3 h, Audrey Wimmer 4 h, Aniket Tripathi 10 h including implementation, review, and integration.

### FV-011 - Display results and compare one changed scenario
Description: Show room CO2 over time with units/disclaimer and allow a basic occupancy or flow scenario comparison.

Implementation scope: Deliver the bounded MVP increment described here; integrate against the shared fixture or running app, not as an isolated prototype.

Dependencies: FV-009, FV-010.

Acceptance criteria: User can inspect values and see differences between two inputs without overwriting the first result.

Estimated effort: 10 person-hours.

Assignee: Audrey Wimmer (primary); David Zwettler 2 h, Audrey Wimmer 6 h, Aniket Tripathi 2 h including implementation, review, and integration.

## Definition of Done

- Acceptance criteria demonstrated on the agreed fixture or sample.
- Relevant tests/build checks pass; failures and limitations are visible.
- The increment is integrated with the working application and does not break the previous usable path.

## Risks and Blockers

- Student workload and school examinations may reduce capacity; protect the end-to-end MVP path and defer non-core scope.
- Geometry and image recognition may exceed estimates; keep a manual fallback and limit supported input to the agreed sample.
- Integration across semantic model, renderer, and simulation is the primary technical dependency.

## Sprint Review / Results
