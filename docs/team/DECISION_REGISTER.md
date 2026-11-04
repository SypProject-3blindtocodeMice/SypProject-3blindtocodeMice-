# FurnaView — technology and implementation decision register

**Status: all recommendations OPEN / awaiting team sign-off.** Adopting a technology does not authorize a coding agent to make file changes.

| ID | Decision | Recommended default | Acceptance evidence / risk | Status |
|---|---|---|---|---|
| ADR-001 | Delivery model | Web-first SPA | 3D and editing proof-of-concept on student laptops | OPEN |
| ADR-002 | Main languages | TypeScript UI + C# domain/server | Team skills, typed DTO spike | OPEN |
| ADR-003 | Frontend | React/Vite/Konva/Three.js R3F | Two-room selection/edit slice | OPEN |
| ADR-004 | Backend | ASP.NET Core Minimal APIs, modular monolith | Simple model+validation+API | OPEN |
| ADR-005 | Coordinate/data model | Semantic IDs/revisions, SI, XZ/Y-up suggested | Adopt explicit coordinate conventions | OPEN |
| ADR-006 | Persistence | JSON then SQLite/EF Core; Postgres optional | Measured project/collaboration need | OPEN |
| ADR-007 | Recognition | Compare OpenCvSharp to Python/OpenCV | Identical sample accuracy + correction time | OPEN |
| ADR-008 | MVP analysis | C# zone CO₂, prescribed flow | Analytic and mass-balance validation | OPEN |
| ADR-009 | Future analysis | CONTAM then EnergyPlus; OpenFOAM stretch | Separate research spikes and license review | OPEN |
| ADR-010 | CI and deployment | PR checks first, manual deployments later | Review workflow, permissions and costs | OPEN |
| ADR-011 | Licenses/privacy | Dependencies and sample plan licenses reviewed | Written register before distribution | OPEN |

## How to approve a decision
Record date, team approver(s), actual scope, rejected alternatives, benchmark evidence, open risks, link to ADR/task. A global technology decision approves the **direction**, not installation, scaffolding, or execution.

## Agent task approval entry (separate from ADR)
- Task ID and precise objective:
- Approved exact paths and commands:
- Dependency/license authorization:
- Tests to run:
- Approver, date and reference:
- Explicitly excluded operations:
- Completion/rollback evidence:
