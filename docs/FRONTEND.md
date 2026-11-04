# FurnaView — Frontend implementation guide
**Recommended defaults, no authorization to execute.** Must read `AGENTS.md` and `ARCHITECTURE.md`.

## Chosen recommendation to propose
- **Language/framework:** TypeScript `strict`, React, Vite; frontend is a browser-first SPA for the MVP.
- **2D:** `react-konva` + `konva` for the interactive plan canvas; background imported floor plans may be raster layers. SVG is the fallback for a minimalist editor, not the parallel default.
- **3D:** `three`, `@react-three/fiber`, `@react-three/drei`; WebGL first. Avoid adopting an experimental WebGPU rendering path without a benchmark and explicit sign-off.
- **State:** start with React state for tiny prototypes; prefer `zustand` when selection/editor interactions demand shared state. Do not introduce Redux by default.
- **HTTP contracts:** OpenAPI-derived TS API types or client; validation against backend JSON schemas; no duplicated hand-maintained geometry semantics.
- **Tests:** Vitest + React Testing Library for components/unit, Playwright for limited end-to-end workflow after approval.
- **UI:** accessible controls and keyboard navigation; avoid heavyweight design systems without user approval.

## Architectural boundaries
- `editor2d`: owns pointer interaction, drafts, snapping overlay, controls; does not own canonical building truth.
- `viewer3d`: derives mesh surfaces from a *versioned semantic view DTO*. Every rendered object associates a stable semantic ID, enabling consistent selection and properties.
- `features/scenario`: inputs for occupancy, opening state, rates and schedules; always show units and provenance/default indicator.
- `features/results`: render `ZoneTimeSeries` charts and per-room overlays. A future CFD `SpatialField` needs a different adapter and legend.
- `api`: typed transport; HTTP failures, validation issues, stale revision conflicts, and cancellations are first-class states.

## Geometry interaction recommendations
- Store lengths in meters; editor pixels map through explicit viewport transform. No direct use of raw image pixels as building coordinates.
- On drag, update local view optimistically at pointer cadence; on release perform validation / commit with revision check.
- Implement basic wall tool, select/move, dimensions and grid snapping before generalized polygon editing or arbitrary mesh CSG.
- For V1 rooms, prefer controlled rectilinear polygons and explicit wall adjacency; decide whether to support arbitrary curved/angled geometry later.
- Generate walls/floors from domain DTO geometry; limit texture and polygon budgets; dispose geometries/materials after replacement.
- Avoid React state updates every animation frame; profile with browser devtools and Three.js renderer statistics.

## First vertical slices (each independently approved)
1. Read-only 2-room JSON fixture rendered in 3D with orbit camera, semantic selection and property sidebar.
2. Same fixture displayed in 2D with correct dimension scale and cross-view selection.
3. Drag one wall using local draft; submit change; display backend validation conflict/feedback.
4. View one completed CO₂ time series and zone-colored overlay with legend, units and model caveat.

## Acceptance and failure conditions
- Semantic IDs match across 2D/3D; updating geometry never changes a room ID merely because a mesh regenerated.
- User can revert an invalid edit and preserve the previously validated model.
- Import overlay marks recognition results as unconfirmed candidates.
- Never animate airflow as if spatial velocity had been calculated by a room-level solver.
- Verify initial targets >=30 FPS and <=200ms selection on representative laptop; document measurement methodology.

## Avoid without separate approval
Electron/Tauri app, Unity, WebGPU migration, WASM geometry kernel, large UI libraries, paid icon/asset packs, real-time collaboration, VR, arbitrary CAD editing.

## Proposed dependency review checklist
Before installing each package: version, license, maintenance, browser compatibility, bundle impact, why current native React/TS features are insufficient, rollback plan. Agents must obtain task-specific approval for all installs.
