# Sprint 1 — Initial 3D viewport prototype

## Sprint Information
- Start: October 2026 (planning assumption: 12 October 2026).
- End: October 2026 (planning assumption: 25 October 2026).
- Goal: Establish a runnable visualization proof of concept and present the project direction.
- Planned capacity: 24 team person-hours (retrospective planning estimate).
- Estimated workload: 24 team person-hours (retrospective estimate for the evidenced prototype and review artifact).

## Sprint Backlog

| ID | Task | Assignee | Priority | Estimate | Status |
|----|------|----------|----------|----------|--------|
| FV-H01 | Bootstrap frontend and render an initial wall in a navigable 3D viewport | Audrey Wimmer | Must Have | 18 h (retrospective estimate) | Evidence present; initial prototype only |
| FV-H02 | Prepare the Sprint 1 review presentation and next room milestone | David Zwettler | Should Have | 6 h (retrospective estimate) | Presentation artifact present |

## Task Details

### FV-H01 — Runnable initial-wall viewport
Description: Create the first visible 3D proof of concept for FurnaView.

Implementation scope: The repository contains a React/Vite frontend with a scene, wall mesh, ground grid, and camera controls. The Sprint 1 presentation README explicitly describes the screenshot as showing the initial wall, not a completed room.

Dependencies: None documented.

Acceptance criteria: **Historical evidence only:** viewport source files and screenshot exist. This does not meet the later multi-room semantic 3D acceptance criteria.

Estimated effort: 18 person-hours (retrospective estimate).

Assignee: Audrey Wimmer (primary frontend/3D responsibility).

### FV-H02 — Review presentation
Description: Summarize project purpose, Plan → Explore → Understand vision, actual Sprint 1 work, and next room milestone.

Implementation scope: Existing Reveal.js presentation in this directory.

Dependencies: FV-H01.

Acceptance criteria: Presentation source, README, and viewport screenshot are present.

Estimated effort: 6 person-hours (retrospective estimate).

Assignee: David Zwettler (project coordination and review artifact).

## Definition of Done

- Relevant source and review artifacts are present in the repository.

## Risks and Blockers

- The prototype currently demonstrates one wall; connected rooms and the semantic building model remain the next implementation milestone.

## Sprint Review / Results

The team established a runnable 3D viewport showing an initial wall and prepared the Sprint 1 review presentation. The screenshot is explicitly an initial-wall prototype; the next milestone was a room. Evidence: `README.md`, `src/main.js`, `assets/prototype-viewport.png`, and frontend source under `../../frontend/src/`.
