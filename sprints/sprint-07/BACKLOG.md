# Sprint 07 - Integrate, acceptance-test, document, and roll out the MVP by 31 January

## Sprint Information
- Start: 2027-01-18
- End: 2027-01-31
- Goal: Integrate, acceptance-test, document, and roll out the MVP by 31 January.
- Planned capacity: 34 team person-hours; workload is deliberately kept within student availability.
- Estimated workload: 32 person-hours.

## Sprint Backlog

> Tracker sub-issue progress: not reported for the planned feature issues in the Downloads TSV. The task-detail bullets/acceptance criteria below are planning descriptions, not evidence that tracker sub-issues exist or are complete.

| ID | Task | Assignee | Priority | Estimate | Depends On | Status |
|----|------|----------|----------|----------|------------|--------|
| FV-012 (issue #33) | Integrate manual model through analysis and results | David Zwettler (primary) | Must Have | 14 h* | FV-003, FV-004, FV-005, FV-006, FV-009, FV-010, FV-011 | Planned |
| FV-013 (issue #34) | Verify controlled import path and fix critical defects | David Zwettler (primary) | Must Have | 10 h* | FV-007, FV-008, FV-012 | Planned |
| FV-014 (issue #35) | Document, package and roll out the January MVP | David Zwettler (primary) | Must Have | 8 h* | FV-012, FV-013 | Planned |

* Estimates are provisional planning estimates; issue tracker estimates/progress are not reported for these planned feature issues. Confirm before commitment.

## Task Details
### FV-012 - Integrate manual model through analysis and results
Description: Connect manual creation, validation, 3D, scenario, analysis, visualization and a basic what-if comparison.

Implementation scope: Deliver the bounded MVP increment described here; integrate against the shared fixture or running app, not as an isolated prototype.

Dependencies: FV-003, FV-004, FV-005, FV-006, FV-009, FV-010, FV-011.

Acceptance criteria: Team demonstrates the complete manual-plan path on a repeatable sample.

Estimated effort: 14 person-hours.

Assignee: David Zwettler (primary); David Zwettler 8 h, Audrey Wimmer 3 h, Aniket Tripathi 3 h including implementation, review, and integration.

### FV-013 - Verify controlled import path and fix critical defects
Description: Test both manual and supported-import paths; close only MVP-blocking issues and record remaining limitations.

Implementation scope: Deliver the bounded MVP increment described here; integrate against the shared fixture or running app, not as an isolated prototype.

Dependencies: FV-007, FV-008, FV-012.

Acceptance criteria: Both paths pass a concise acceptance checklist; failed imports/runs preserve last valid model.

Estimated effort: 10 person-hours.

Assignee: David Zwettler (primary); David Zwettler 6 h, Audrey Wimmer 2 h, Aniket Tripathi 2 h including implementation, review, and integration.

### FV-014 - Document, package and roll out the January MVP
Description: Write concise run/use instructions and limitations, smoke test the agreed local/demo package, and present/share the MVP by 31 January 2027.

Implementation scope: Deliver the bounded MVP increment described here; integrate against the shared fixture or running app, not as an isolated prototype.

Dependencies: FV-012, FV-013.

Acceptance criteria: Package starts from documented instructions; core smoke checks pass; MVP is demonstrated/rolled out by 31 January 2027.

Estimated effort: 8 person-hours.

Assignee: David Zwettler (primary); David Zwettler 5 h, Audrey Wimmer 1 h, Aniket Tripathi 2 h including implementation, review, and integration.

## Definition of Done

- Acceptance criteria demonstrated on the agreed fixture or sample.
- Relevant tests/build checks pass; failures and limitations are visible.
- The increment is integrated with the working application and does not break the previous usable path.

## Risks and Blockers

- Student workload and school examinations may reduce capacity; protect the end-to-end MVP path and defer non-core scope.
- Geometry and image recognition may exceed estimates; keep a manual fallback and limit supported input to the agreed sample.
- Integration across semantic model, renderer, and simulation is the primary technical dependency.

## Sprint Review / Results
