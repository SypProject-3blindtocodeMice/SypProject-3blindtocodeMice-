# Sprint 05 - Import one controlled plan, review candidate geometry, and retain manual fallback

## Sprint Information
- Start: 2026-12-21
- End: 2027-01-03
- Goal: Import one controlled plan, review candidate geometry, and retain manual fallback.
- Planned capacity: 18 team person-hours; workload is deliberately kept within student availability.
- Estimated workload: 18 person-hours.

## Sprint Backlog

> Tracker sub-issue progress: not reported for the planned feature issues in the Downloads TSV. The task-detail bullets/acceptance criteria below are planning descriptions, not evidence that tracker sub-issues exist or are complete.

| ID | Task | Assignee | Priority | Estimate | Depends On | Status |
|----|------|----------|----------|----------|------------|--------|
| FV-007 (issue #27) | Support one controlled floor-plan image import with candidate walls | Aniket Tripathi (primary) | Must Have | 12 h* | FV-002, FV-004 | Planned |
| FV-008 (issue #28) | Review and correct imported candidates before confirmation | Audrey Wimmer (primary) | Must Have | 6 h* | FV-005, FV-007 | Planned |

* Estimates are provisional planning estimates; issue tracker estimates/progress are not reported for these planned feature issues. Confirm before commitment.

## Task Details
### FV-007 - Support one controlled floor-plan image import with candidate walls
Description: Implement a narrow, high-contrast supported image path (known scale/sample), output candidate geometry for review; treat recognition as assistive.

Implementation scope: Deliver the bounded MVP increment described here; integrate against the shared fixture or running app, not as an isolated prototype.

Dependencies: FV-002, FV-004.

Acceptance criteria: Supported sample produces editable candidates or clear failure; unsupported images are rejected without replacing the current model.

Estimated effort: 12 person-hours.

Assignee: Aniket Tripathi (primary); David Zwettler 2 h, Audrey Wimmer 3 h, Aniket Tripathi 7 h including implementation, review, and integration.

### FV-008 - Review and correct imported candidates before confirmation
Description: Display the controlled source image and candidate geometry; allow correction or fall back to manual plan creation.

Implementation scope: Deliver the bounded MVP increment described here; integrate against the shared fixture or running app, not as an isolated prototype.

Dependencies: FV-005, FV-007.

Acceptance criteria: Candidate geometry remains unconfirmed until user review; user can correct or abandon import.

Estimated effort: 6 person-hours.

Assignee: Audrey Wimmer (primary); David Zwettler 1 h, Audrey Wimmer 4 h, Aniket Tripathi 1 h including implementation, review, and integration.

## Definition of Done

- Acceptance criteria demonstrated on the agreed fixture or sample.
- Relevant tests/build checks pass; failures and limitations are visible.
- The increment is integrated with the working application and does not break the previous usable path.

## Risks and Blockers

- Student workload and school examinations may reduce capacity; protect the end-to-end MVP path and defer non-core scope.
- Geometry and image recognition may exceed estimates; keep a manual fallback and limit supported input to the agreed sample.
- Integration across semantic model, renderer, and simulation is the primary technical dependency.

## Sprint Review / Results
