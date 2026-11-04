# FurnaView — C# backend, geometry, data and API
**Recommended defaults only. No code/file creation or commands without scoped approval under `AGENTS.md`.**

## Proposed stack
- C# on a supported .NET LTS SDK, pinned via `global.json` once adopted.
- ASP.NET Core **Minimal APIs** with endpoint groups for project model, recognition proposals, scenarios, runs and results.
- `System.Text.Json` for transport/fixture serialization; explicit DTOs separate from internal domain entities.
- Domain/pure geometry computations decoupled from EF or HTTP. Use `NetTopologySuite` for 2D topology/geometry operations *after testing its behavior for model constraints*; do not assume it is a full CAD constraint solver.
- Persistence: serialized fixture in initial proof of concept; **SQLite + EF Core** preferred for first persistent local server. PostgreSQL/Npgsql only after requirements demand it.
- Validation: type-safe domain invariants and explicit validation results; no automatic `FluentValidation`, Mediatr or AutoMapper requirement.
- Testing: xUnit or existing team's standard (propose xUnit); integration tests against disposable SQLite database where necessary.

## Model entities and invariants
- One authoritative, versioned `BuildingModel` with stable UUIDs or equivalent identities; floor elevation and horizontal geometry, room boundary membership, opening host wall and adjacency.
- Each room polygon must be closed and non-self-intersecting under defined tolerance, valid area/height/volume, and associated with a floor.
- Openings cannot float outside host walls; door/window state belongs in scenario unless it is static building configuration.
- Geometry computations must distinguish numerical tolerance from exact equality; specify tolerances centrally with units.
- Model validity can be layered: `Renderable` and `SimulationReady` may require different fields; do not block all editing because numerical data is not yet provided.
- Model revisions and analysis snapshots are immutable; persist user edits only after validation or as explicitly labeled drafts.

## Suggested API endpoints (not final)
```text
GET    /api/projects/{id}
PUT    /api/projects/{id}               # revision-aware replace/update
POST   /api/projects/{id}/validate
POST   /api/projects/{id}/recognition-runs
POST   /api/scenarios/{id}/runs
GET    /api/runs/{runId}
POST   /api/runs/{runId}/cancel
GET    /api/runs/{runId}/results
```
Use typed results and coherent problem details; do not add auth before requirements, but do not expose private plans without controls in a deployed environment.

## Simulation orchestration
- `ISimulationEngine` exposes `EngineId`, capabilities, input validation and `RunAsync(snapshot, cancellationToken)`.
- For early C# solvers, in-process execution is acceptable with cancellation and progress. External tools run in bounded worker processes, never as uncontrolled shell snippets from user input.
- Results record `engineId`, `engineVersion`, `analysisType`, model revision/hash, scenario snapshot, units, timestamp, warnings and output kind.
- Job status terminal states are `Succeeded`, `Failed`, `Cancelled`; cancelled/incomplete results cannot be published as complete.

## Data and security
- Uploaded plan files have allowed extensions/size limits, content validation, randomized storage paths and access controls; never trust client MIME or filenames.
- Avoid raw blueprint logging and permanent retention without business requirement; no secrets committed.
- Use deterministic fixtures and sample project models with cleared usage rights.

## First test targets
1. Two rectangles sharing a wall create two valid rooms and one adjacency.
2. Window/door outside a wall fails model validation with precise error code.
3. Revision conflict cannot overwrite last valid model.
4. Unit conversion preserves length/volume and opening dimensions.
5. Simulation request can reference precisely one immutable model revision.

## Do not overengineer
No microservices, distributed queues, CQRS/event sourcing, full IFC schema, complex DDD frameworks, full auth system or cloud infrastructure by default. Introduce only based on explicit use cases and approved ADRs.
