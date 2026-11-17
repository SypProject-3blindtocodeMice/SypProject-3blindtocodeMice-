# FurnaView — Model handoff contract (editor → validation → 3D → analysis)

**Status: RECOMMENDED CONTRACT, NOT ADOPTED.** Design guidance only; see `AGENTS.md` and `docs/ARCHITECTURE.md`. Nothing here authorizes implementation beyond the explicitly approved task scope.

This document defines the data shapes that cross module boundaries in the supported manual-plan path. The goal is that every module consumes and produces the same semantic shapes, so no module invents its own geometry or ID semantics.

## 1. Module input / output shapes

### Editor → Validation

The editor (frontend) keeps transient drafts locally and sends bounded candidate commits to the backend validation module.

| Step | Module | Input shape | Constraints / behaviour |
|---|---|---|---|
| Create wall | Editor → Validation | `POST /api/walls` — `CreateWallRequest` | `{ name: string, start: { x, z }, end: { x, z }, height: number, thickness: number, tiltDegrees?: number }` |
| Update wall | Editor → Validation | `PUT /api/walls/{id}` — `UpdateWallRequest` | Same fields as create, with `tiltDegrees` required. |
| Connect endpoints | Editor → Validation | `POST /api/walls/{id}/connections` — `ConnectWallRequest` | `{ endpoint: "start"\|"end", targetWallId: guid, targetEndpoint: "start"\|"end" }`. |

Editor-side behaviour: drafts are local (optimistic at pointer cadence); commits are bounded updates; on validation failure the editor reverts to the last validated state and shows the server error.

Validation-side rules for these inputs (clear, single-purpose errors):

- `name` required (trimmed before storage);
- `start` / `end` required with finite `X` / `Z` coordinates;
- `height` and `thickness` positive finite numbers;
- `tiltDegrees` within −90…90;
- wall endpoints at least `0.000001 m` apart;
- connected-anchor moves may not collapse another wall; self-connections rejected.

### Validation → Editor

| Result | Shape | Meaning |
|---|---|---|
| OK | `200` — `WallResponse` `{ id, name, start, end, height, thickness, tiltDegrees, startAnchorId, endAnchorId, length }` | Single wall; `length` is derived. |
| OK | `200` — `WallResponse[]` | Connection result; all walls after an anchor move. |
| Error | `400` — problem details (`WallValidationException` → title `Invalid wall`) | Clear validation message; rejected edits leave the last valid model unchanged. |
| Error | `404` | Referenced wall missing. |

### Validation → 3D

Input (semantic view DTO consumed by the renderer):

- validated wall DTO(s) with stable semantic `id`, shared `startAnchorId` / `endAnchorId`, derived `length`;
- frontend mirror type `Wall { id, name, start, end, height, thickness, tiltDegrees, startAnchorId, endAnchorId, length }`.

Output:

- derived meshes (`WallMesh`) from validated DTOs; the 3D module never owns geometry edits or validation authority;
- selection state keyed by stable wall `id`.

### Validation → Analysis / Analysis → 3D

- Analysis consumes an immutable validated building snapshot via `SimulationInput` (model revision/snapshot + scenario: occupancy, outdoor conditions, ventilation assumptions, duration / step / solver parameters).
- Analysis produces `SimulationResult` (engine id/version, config fingerprint, inputs, state, warnings, time values, results) and `ZoneTimeSeries` (`roomId`, `time`, `value`, `unit`) per room.
- Future `SpatialField` (spatial coordinates + components) is distinct from `ZoneTimeSeries` and must not be visualised as a room-level series.

## 2. Identifier and relationship semantics

- **Wall ids** are stable semantic ids: `PUT` updates geometry but keeps the wall `id`; corrected walls keep the logical id.
- **Anchors** are shared objects: when two walls are connected, one's `endAnchorId` equals the other's `startAnchorId`. Moving a wall moves its shared anchors and therefore attached endpoints of neighbours, atomically with validation.
- **Room ids** are stable across geometry edits and mesh regeneration; room↔wall relationships travel by id references (boundary membership), not by recomputed geometry.
- **Opening ids** are stable; the host wall id stays stable so an opening can be re-anchored to corrected geometry without changing identity. Opening state is scenario-dependent unless fixed building configuration.
- **Model revisions** are immutable snapshots; analysis results stay tied to the exact revision / parameter snapshot / engine version they were produced from.

## 3. Error and failure semantics

- Invalid candidate input → `400` with a clear, actionable validation message; the last confirmed model remains authoritative.
- Rejected plan imports / invalid fixtures must leave previously saved state unchanged.

## 4. Coordinate and unit conventions

- Single floor: metres; floor plane `X` / `Z`, vertical `Y` up; floor at `Y = 0`.
- Wall runs from `start` to `end`; `length` is derived; `tiltDegrees` is visual-only rotation about the base, limited to ±90°.
- Opening width/height and offsets are in metres and must fit inside the host wall.

## 5. Two-room fixture contract

- Fixture: `samples/fixtures/two-room-shared-wall.json` (JSON Schema: `samples/fixtures/two-room-shared-wall.schema.json`).
- Shape: building (`id`, `revision`, `name`) → `rooms`, `walls`, `openings`.
- Room: `id`, `name`, `height`, `area`, `volume`, `wallIds` (boundary membership).
- Wall: `id`, `name`, `start`, `end`, `height`, `thickness`, `tiltDegrees`.
- Opening (door): `id`, `kind`, `hostWallId`, `offset`, `width`, `height`, `state`.
- Expectations: the valid two-room fixture (living room + bedroom sharing one wall, one door in the shared wall) passes validation; round-trips preserve ids and relationships; invalid values are rejected with clear errors.

## 6. Related documents

- `docs/ARCHITECTURE.md` — logical flow and domain schema.
- `docs/BACKEND.md` — backend invariants and first test targets.
- `docs/FRONTEND.md` — module boundaries (editor2d / viewer3d / api).
- `docs/SIMULATION.md` — solver and result contracts.
