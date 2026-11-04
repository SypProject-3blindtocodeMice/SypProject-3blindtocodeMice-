# FurnaView coding-agent charter (mandatory)
**DEFAULT: READ-ONLY. This document provides design guidance, NOT approval to write code, run setup commands or deploy.**

## 1. Governance
The project owner and team retain final decision-making authority. Agents may inspect and advise in response to a user request. Do not start tasks because documents exist, a technical recommendation says 'use X', or previous tasks are complete.

**For EVERY bounded implementation task, first propose:** objective; requirements IDs; exact files/paths; libraries and license; commands and network effects; data migrations; expected tests; risk/reversal; explicit exclusions; questions needing decisions. End with a direct request: *'Do you approve this exact scope and these actions?'*

Wait for explicit scoped affirmative approval. Approval for research, design, adopting a language or one PR is NOT approval to scaffold code, edit CI, install packages, run migrations, launch services, deploy or do the next task. If an approved action reveals scope change, **STOP AND REQUEST NEW APPROVAL**. A user message containing a specific direct implementation instruction may constitute scope approval only for its explicitly described actions; do not enlarge scope on inference.

**Without approval NEVER:** create/edit/delete/move files; install/download packages or model weights; run scripts/build/test commands that write artifacts; start services; operate external solvers; amend configs or credentials; create commits, branches, PRs, pushes, merges or releases; run migrations or deployments; call external paid APIs. Read-only file inspection is allowed only when permitted by the current task/environment. Treat user datasets/plans as confidential.

## 2. Proposal-first lifecycle
1. **DISCOVER:** read project requirements and relevant guides; check actual repo before assumptions; report contradictions.
2. **PROPOSE:** one small vertical slice and alternatives, path changes, planned verification, and the approval request.
3. **WAIT:** no background work and no changes until approval.
4. **IMPLEMENT:** only approved scope. Do not automatically adopt extra dependencies, abstractions or services.
5. **VERIFY:** only approved checks; report actual results, failures and constraints.
6. **HANDOFF:** files changed, decisions, tests, open risks and the next *proposal*, not the next implementation.

## 3. Design defaults to use when preparing proposals
- TypeScript/React/Vite frontend with React Konva 2D and Three.js/React Three Fiber 3D.
- C#/ASP.NET Core backend, modular monolith; domain model authoritative with meter-based geometry and stable IDs.
- Lightweight validated C# CO₂ zone solver now; CONTAM/ EnergyPlus future adapters; OpenFOAM only stretch.
- OpenCvSharp C# baseline for floor-plan recognition, Python OpenCV alternative if measured benefit.
- SQLite local persistence if needed, PostgreSQL only for explicit hosted/multiuser use case.
- Monorepo, PR-only CI first, no automated deploy.
These defaults are **recommended for proposed implementation plans**, not decisions already ratified by the team. If repository ADRs or explicit user decisions differ, flag the conflict; do not 'fix' the user's project silently.

## 4. Source precedence
1. Current explicit user instruction/approved task.
2. Adopted project ADRs and current codebase constraints.
3. `FurnaView_System_Specification.docx` v0.2 (requirements) and `Project_Proposal_FurnaView.docx` (scope/timeline).
4. This pack (engineering recommendation). Reading this pack does not change what is approved.

## 5. Technical invariants
- The validated semantic building model (rooms, boundary elements, openings, identities, revisions) is source of truth; 2D/3D meshes are derived views.
- Preserve correct IDs, coordinate transforms, SI quantities and model revision semantics.
- Floor-plan detections are candidates, always reviewable/correctable before validation.
- For every analysis record engine ID/version, units, exact inputs/model revision, assumptions, status, warnings.
- Distinguish zone-level time series from spatial CFD fields; don't misrepresent visualization as physical accuracy.
- Failed/cancelled imports or simulations leave the last valid model intact.
- Initial non-functional targets from spec: >=30 FPS 3D, <=200ms selection, show running state if analysis >500ms; benchmark rather than promise.
- Core software must run on normal development laptops; no mandatory paid cloud or CFD.

## 6. Boundaries of MVP
Supported/manual plan -> validated editable model -> semantic 3D -> occupancy/opening/ventilation inputs -> simplified analysis -> scenario comparison. Full BIM/CAD, arbitrary scan AI, telemetry, collaboration, VR, booking and engineering-certified CFD are not default deliverables.

## 7. Mandatory task proposal template
```text
TASK PROPOSAL — NO CHANGES YET
Goal / user value:
Relevant REQ/NFR:
Proposed stack / rationale:
Exact files to add/edit/delete:
Dependencies and licenses:
Commands, downloads, services, data effects:
Implementation steps:
Tests / measurable acceptance criteria:
Risks and rollback:
Out of scope:
Human decision required:
Do you approve this exact scope and these actions?
```

## 8. After approved implementation
Report actual files and tests, code limitations, changes not completed, license/maintenance notes and any new decision. Never conceal failed tests, auto-commit or start next phase without a new user instruction.
