# FurnaView — Architecture and integration contracts
**Status: RECOMMENDED TECHNICAL BASELINE, NOT APPROVED IMPLEMENTATION.** Read `AGENTS.md` first. These are defaults agents should propose rather than reopen without a requirement-based reason. Nothing here grants edit, install, commit or deployment permission.

## 1. Recommendation and rationale
- **Delivery:** browser-first single-page application (SPA); responsive desktop-oriented editor. Do **not** begin Electron/Tauri/native packaging until offline/native requirements justify it.
- **Frontend:** TypeScript strict mode, React, Vite, React Konva for 2D, Three.js via React Three Fiber for 3D, Drei for useful controls.
- **Backend:** C# on a currently supported .NET LTS release; ASP.NET Core Minimal APIs, modular monolith, OpenAPI contracts. Version/SDK pinned on adoption; do not guess exact version.
- **Domain:** authoritative semantic building model in C#; reusable independent of UI, databases and numerical engines.
- **Simulations:** first solver written in C# for zone CO₂. External CONTAM, EnergyPlus, and OpenFOAM remain **future adapters**, not required infrastructure.
- **Recognition:** first compare C# OpenCvSharp to Python OpenCV; choose Python only if tested advantages justify a separate runtime.
- **Persistence:** JSON fixture/storage first; SQLite + EF Core for persistent single-user prototype; PostgreSQL only if backed by multi-user/server needs.
- **Deployment:** local, no paid cloud requirement. Separate native engine worker processes only when actually adopted.

## 2. Logical flow
```text
2D editor / imported plan --candidate changes--> ASP.NET API
                                          |       |
                          validated C# building model (source of truth)
                          /               |                   \
                   render DTOs      scenario snapshots      recognition candidates
                        |                   |                   |
                Three.js meshes    simulation coordinator   correction overlay
                                            |
                                 C# zone solver (MVP)
                                            |
                         results: zone series + metadata + status
                                            |
                                charts and 3D zone overlays

FUTURE: coordinator -> separate CONTAM / EnergyPlus / CFD adapters
```

## 3. Initial bounded project layout (proposal)
```text
furnaview/
  AGENTS.md                          # root pointer to agent/AGENTS.md policy
  docs/architecture/                # decision records, schemas, unit conventions
  docs/team/                        # human guide and decisions
  apps/web/                          # TypeScript React Vite app
  src/FurnaView.Api/                 # endpoints, auth if later needed, composition root
  src/FurnaView.Application/         # workflows, validation, scenario/job coordination
  src/FurnaView.Domain/              # semantic building model and invariants
  src/FurnaView.Geometry/            # topology, geometry validation, mesh view input
  src/FurnaView.Simulation/          # engine interface, validated C# zone model
  src/FurnaView.Infrastructure/      # persistence, file handling, optional adapters
  workers/recognition-python/        # only IF Python worker approved
  tests/FurnaView.Domain.Tests/
  tests/FurnaView.Simulation.Tests/
  tests/FurnaView.Api.Tests/
  samples/fixtures/                 # synthetic or usage-cleared floor plans
  .github/workflows/                # CI only after separate approval
```
This is a **candidate layout**: propose actual file additions in a scoped plan. Do not create directories merely on reading this file. Avoid clean-architecture ceremony that adds empty projects without an immediate boundary need.

## 4. Domain schema: suggested V1
- `BuildingModel`: `Id`, `Revision`, `CoordinateSystem`, `Floors`, `Rooms`, `BoundaryElements`, `Openings`; immutable validated snapshot for analysis.
- `Room`: ID, polygon reference, elevation, height/volume, adjacency; no live simulation result as mutable geometry property.
- `BoundaryElement`: ID, endpoints or boundary geometry, thickness, inside/outside relation, optional physical properties.
- `Opening`: ID, host boundary ID, position, width/height, kind, state (scenario dependent).
- `AnalysisScenario`: ID, `ModelId+Revision`, initial states, occupancy/time schedule, outside conditions, ventilation assumptions, simulation parameters.
- `AnalysisRun`: ID, scenario snapshot/hash, engine ID/version, lifecycle state, start/end and warnings.
- `ZoneTimeSeries`: `[roomId,time,value,unit]`, semantic metric and assumptions.
- `SpatialField` (future): spatial coordinates or mesh reference, time and field components; not interchangeable with `ZoneTimeSeries`.

**Coordinate proposal requiring explicit ADR:** global meters, right-handed axes, ground plane X/Z and Y-up to align with Three.js; building north/rotation as separate metadata. Keep plan pixel coordinates and calibration transform distinct. Confirm coordinate mapping and unit semantics before implementation; do not silently choose alternatives in separate layers.

## 5. API and interface guidelines
- HTTP/JSON REST for initial workflows; ASP.NET OpenAPI document plus generated or validated TS types, not duplicate handwritten DTO assumptions.
- Candidate endpoints: `GET/PUT /api/projects/{id}`, `POST /api/projects/{id}/validate`, `POST /api/projects/{id}/recognition-runs`, `POST /api/scenarios/{id}/runs`, `GET /api/runs/{id}`, `POST /api/runs/{id}/cancel`.
- Model writes require revision/ETag-style conflict detection; invalid edits must not replace the last confirmed snapshot.
- Avoid server calls on every pointer move; frontend keeps transient draft interaction, commits bounded updates and resolves validation errors.
- Explicit solver capability reporting (`analysisType`, requiredInputs, outputKinds, constraints). No universal solver config.
- Long running states: `Queued`, `Running`, `Succeeded`, `Failed`, `Cancelled`; result access only when complete.

## 6. Cross-cutting acceptance gates
- A corrected wall retains semantic ID where logically the same object; room adjacency and volumes revalidate.
- A rejected plan import leaves previously saved project unchanged.
- A result remains tied to the exact model revision, parameter snapshot and engine provenance.
- Representative normal-student laptop: target >=30 FPS in 3D; selection indication <=200ms; analysis >500ms gives progress/active state (all provisional targets from system spec).
- Basic CO₂ validation includes analytic solution, conservation, dimensional checks and numerical convergence.
- Explicitly distinguish educational estimates from certified engineering analysis.

## 7. ADRs required before coding significant parts
ADR-001 product delivery; ADR-002 C#/TS split; ADR-003 model invariants/coordinates; ADR-004 renderer/editor; ADR-005 persistence; ADR-006 simulation contracts; ADR-007 recognition implementation; ADR-008 licensing; ADR-009 CI/deploy. Record rationale and owner. **An ADR is a technology decision, not permission for agents to run commands.**

## 8. Suggested first approved task
Approve one **two-room data contract and unit tests**, with exact model and test files; do not simultaneously scaffold backend, frontend, persistence and recognition. Follow task approval protocol in `AGENTS.md`.
