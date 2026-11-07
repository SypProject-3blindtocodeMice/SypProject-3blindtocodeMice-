# Sprint 02 - Agree on a small semantic model and lock the January MVP boundary

## Sprint Information
- Start: 2026-11-09
- End: 2026-11-22
- Goal: Agree on a small semantic model and lock the January MVP boundary.
- Planned capacity: 24 team person-hours; workload is deliberately kept within student availability.
- Estimated workload: 22 person-hours.

## Sprint Backlog

| ID | Task | Assignee | Priority | Estimate | Status |
|----|------|----------|----------|----------|--------|
| FV-001 | Confirm minimum implementation boundary and team integration contract | David Zwettler (primary) | Must Have | 8 h | Planned |
| FV-002 | Define a small semantic model and representative fixture | David Zwettler (primary) | Must Have | 14 h | Planned |

## Task Details
### FV-001 - Confirm minimum implementation boundary and team integration contract
Description: Record agreed app/model boundary, units, ID conventions and one demonstrable January MVP path; keep recommendations distinct from adopted choices.

Implementation scope: Deliver the bounded MVP increment described here; integrate against the shared fixture or running app, not as an isolated prototype.

Dependencies: Current viewport; team agreement.

Acceptance criteria: Runnable scope and data handoff are agreed and recorded in the existing decision register.

Estimated effort: 8 person-hours.

Assignee: David Zwettler (primary); David Zwettler 5 h, Audrey Wimmer 1 h, Aniket Tripathi 2 h including implementation, review, and integration.

### FV-002 - Define a small semantic model and representative fixture
Description: Represent a single-floor building with rooms, connected walls, doors/windows and stable IDs; provide one two-room fixture and validation checks.

Implementation scope: Deliver the bounded MVP increment described here; integrate against the shared fixture or running app, not as an isolated prototype.

Dependencies: FV-001.

Acceptance criteria: Two-room fixture retains semantic IDs and validates; invalid dimensions/relationships are rejected.

Estimated effort: 14 person-hours.

Assignee: David Zwettler (primary); David Zwettler 8 h, Audrey Wimmer 3 h, Aniket Tripathi 3 h including implementation, review, and integration.

## Definition of Done

- Acceptance criteria demonstrated on the agreed fixture or sample.
- Relevant tests/build checks pass; failures and limitations are visible.
- The increment is integrated with the working application and does not break the previous usable path.

## Risks and Blockers

- Student workload and school examinations may reduce capacity; protect the end-to-end MVP path and defer non-core scope.
- Geometry and image recognition may exceed estimates; keep a manual fallback and limit supported input to the agreed sample.
- Integration across semantic model, renderer, and simulation is the primary technical dependency.

## Sprint Review / Results
