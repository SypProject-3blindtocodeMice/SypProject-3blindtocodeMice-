# Sprint 04 - Create and edit a small plan with semantic openings in 3D

## Sprint Information
- Start: 2026-12-07
- End: 2026-12-20
- Goal: Create and edit a small plan with semantic openings in 3D.
- Planned capacity: 32 team person-hours; workload is deliberately kept within student availability.
- Estimated workload: 30 person-hours.

## Sprint Backlog

> Tracker sub-issue progress: not reported for the planned feature issues in the Downloads TSV. The task-detail bullets/acceptance criteria below are planning descriptions, not evidence that tracker sub-issues exist or are complete.

| ID | Task | Assignee | Priority | Estimate | Depends On | Status |
|----|------|----------|----------|----------|------------|--------|
| FV-005 (issue #24) | Add basic manual plan creation and correction controls | Audrey Wimmer (primary) | Must Have | 18 h* | FV-002, FV-003, FV-004 | Planned |
| FV-006 (issue #25) | Represent basic doors/windows and room occupancy | David Zwettler (primary) | Must Have | 12 h* | FV-002, FV-005 | Planned |

* Estimates are provisional planning estimates; issue tracker estimates/progress are not reported for these planned feature issues. Confirm before commitment.

## Task Details
### FV-005 - Add basic manual plan creation and correction controls
Description: Let a user create or adjust bounded wall geometry and inspect room geometry; avoid general-purpose CAD tools.

Implementation scope: Deliver the bounded MVP increment described here; integrate against the shared fixture or running app, not as an isolated prototype.

Dependencies: FV-002, FV-003, FV-004.

Acceptance criteria: A user can create/edit a small plan and see changes reflected in the 3D view.

Estimated effort: 18 person-hours.

Assignee: Audrey Wimmer (primary); David Zwettler 3 h, Audrey Wimmer 11 h, Aniket Tripathi 4 h including implementation, review, and integration.

### FV-006 - Represent basic doors/windows and room occupancy
Description: Attach simple semantic openings to walls and expose room occupancy as an analysis input.

Implementation scope: Deliver the bounded MVP increment described here; integrate against the shared fixture or running app, not as an isolated prototype.

Dependencies: FV-002, FV-005.

Acceptance criteria: One door/window can be represented on a valid boundary; occupancy accepts non-negative values.

Estimated effort: 12 person-hours.

Assignee: David Zwettler (primary); David Zwettler 7 h, Audrey Wimmer 2 h, Aniket Tripathi 3 h including implementation, review, and integration.

## Definition of Done

- Acceptance criteria demonstrated on the agreed fixture or sample.
- Relevant tests/build checks pass; failures and limitations are visible.
- The increment is integrated with the working application and does not break the previous usable path.

## Risks and Blockers

- Student workload and school examinations may reduce capacity; protect the end-to-end MVP path and defer non-core scope.
- Geometry and image recognition may exceed estimates; keep a manual fallback and limit supported input to the agreed sample.
- Integration across semantic model, renderer, and simulation is the primary technical dependency.

## Sprint Review / Results
