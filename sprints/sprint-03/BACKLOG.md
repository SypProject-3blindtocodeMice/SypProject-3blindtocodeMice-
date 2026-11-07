# Sprint 03 - Render and validate a connected two-room semantic model

## Sprint Information
- Start: 2026-11-23
- End: 2026-12-06
- Goal: Render and validate a connected two-room semantic model.
- Planned capacity: 32 team person-hours; workload is deliberately kept within student availability.
- Estimated workload: 28 person-hours.

## Sprint Backlog

| ID | Task | Assignee | Priority | Estimate | Status |
|----|------|----------|----------|----------|--------|
| FV-003 | Render multiple connected walls and room surfaces | Audrey Wimmer (primary) | Must Have | 16 h | Planned |
| FV-004 | Calculate room boundaries and basic model validity | David Zwettler (primary) | Must Have | 12 h | Planned |

## Task Details
### FV-003 - Render multiple connected walls and room surfaces
Description: Adapt the current single-wall viewport to render the semantic fixture with basic camera interaction.

Implementation scope: Deliver the bounded MVP increment described here; integrate against the shared fixture or running app, not as an isolated prototype.

Dependencies: FV-002.

Acceptance criteria: The two-room fixture renders as connected geometry and can be navigated on team hardware.

Estimated effort: 16 person-hours.

Assignee: Audrey Wimmer (primary); David Zwettler 3 h, Audrey Wimmer 10 h, Aniket Tripathi 3 h including implementation, review, and integration.

### FV-004 - Calculate room boundaries and basic model validity
Description: Support closed rooms, shared boundaries, basic area/volume and actionable validation feedback for the constrained model.

Implementation scope: Deliver the bounded MVP increment described here; integrate against the shared fixture or running app, not as an isolated prototype.

Dependencies: FV-002.

Acceptance criteria: Valid two-room fixture has correct adjacency and room measures; an open/invalid room is flagged.

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
