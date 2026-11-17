# Sprint 02 - Agree on a small semantic model and lock the January MVP boundary

## Sprint Information
- Start: 2026-11-09
- End: 2026-11-22
- Goal: Agree on a small semantic model and lock the January MVP boundary.
- Planned capacity: 24 team person-hours (baseline; requires approval/replanning if all tracker items remain committed).
- Estimated workload: 30 person-hours including issue #20; this exceeds baseline capacity by 6 hours.

## Sprint Backlog

| ID | Task | Assignee | Priority | Estimate | Depends On | Status / sub-issue progress |
|----|------|----------|----------|----------|------------|--------|
| FV-001 (issue #10) | Confirm minimum implementation boundary and team integration contract | David Zwettler (primary) | Must Have | 8 h | Current viewport; team agreement | Planned; 0/4 sub-issues (0%) |
| FV-002 (issue #11) | Define a small semantic model and representative fixture | David Zwettler (primary) | Must Have | 14 h | FV-001 | Planned; 0/4 sub-issues (0%) |
| FV-015 (issue #20) | Website layout and visual design | Audrey Wimmer (primary) | Should Have | 8 h | Team agreement | Planned; sub-issue progress not reported |

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

### FV-015 - Website layout and visual design
Description: Establish the website's page layout and visual direction as recorded in tracker issue #20.

Dependencies: Team agreement on MVP scope and target pages.

Acceptance criteria: A reviewed layout/visual design is available to guide implementation; this is design work, not completion of all page styling issues (#21, #26, #29, #36).

Estimated effort: 8 person-hours (Downloads TSV).

Assignee: Audrey Wimmer (primary); issue tracker lists 8 h estimate and no actual effort.

## Definition of Done

- Acceptance criteria demonstrated on the agreed fixture or sample.
- Relevant tests/build checks pass; failures and limitations are visible.
- The increment is integrated with the working application and does not break the previous usable path.

## Risks and Blockers

- Student workload and school examinations may reduce capacity; protect the end-to-end MVP path and defer non-core scope.
- Geometry and image recognition may exceed estimates; keep a manual fallback and limit supported input to the agreed sample.
- Integration across semantic model, renderer, and simulation is the primary technical dependency.
- Sprint 2 currently totals 30 h against a 24 h baseline. Reconfirm capacity or explicitly move/de-scope work before treating the sprint as committed.

## Sprint Review / Results
