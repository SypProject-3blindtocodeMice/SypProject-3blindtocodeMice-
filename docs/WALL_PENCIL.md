# Wall Pencil: drawing, dimensions, and connections

This guide records what the `pentool` branch adds to `dev` for [issue #68](https://github.com/SypProject-3blindtocodeMice/SypProject-3blindtocodeMice-/issues/68): visual drawing, batch saving, endpoint snapping in 2D and 3D, a connection readout, and dimension controls. Wall deletion ([#71](https://github.com/SypProject-3blindtocodeMice/SypProject-3blindtocodeMice-/issues/71)) was already in the base branch.

## Draw and save walls

1. Start the app with `npm run dev` from the repository root (Node.js 24 and .NET 10). Open the Builder at `/builder`.
2. Choose **Draw wall** and click or tap the grid to place the first point. This sets the starting point; it doesn't create a wall.
3. Move the pointer to see a translucent preview. Click or tap the next point to pin a segment. Each new segment starts at the end of the last one. Pinned segments are still local drafts and do not appear in the saved wall list.
4. To draw two perpendicular sides, hold **Shift** or toggle **Parallel sides** and place another point. The tool uses the latest segment as the base and projects the pointer onto its perpendicular direction. It places one side from each end of the base, on the same side and at the same intended depth. Endpoint snapping can adjust the resulting endpoints. No fourth wall is added, and the chain continues from the far end of the second side.
5. Press **Enter** outside form controls, or choose **Finish (Enter)**, to save all pinned segments together. An unpinned preview is not saved. Press **Esc** or **Cancel (Esc)** to discard the entire draft. If saving fails, the draft stays open and shows an error.

Both views edit the same draft. Drag to pan in 2D or orbit in 3D; right-drag pans in 3D. Scroll or pinch to zoom. Dragging, multitouch gestures, and using the 3D ViewCube do not place points. The buttons provide touch alternatives for Shift, Enter, and Esc. **Add wall by coordinates** and **Edit geometry** remain available outside drawing mode.

## Set height and thickness while drawing

The pencil starts with **2.5 m height** and **0.15 m thickness**. Enter exact values in the sidebar at any time; both must be finite and greater than zero. Invalid values prevent further placement until corrected, but previously pinned segments can still be saved. The preview updates with valid changes. Pinned walls retain the dimensions they had when placed, and both walls in a Shift pair use the same dimensions.

Hold **D** and use the arrow keys outside form fields. The preview stays in place and a viewport readout shows the measurements, including in 2D where height isn't visible. Camera controls and viewport placement are paused until you release **D**. Pointer movement doesn't change dimensions; on touch, use the number fields.

| Keys | Effect |
| --- | --- |
| **D + ↑ / ↓** | Increase / decrease height |
| **D + → / ←** | Increase / decrease thickness |

A tap changes the selected dimension by **1 cm**. As the arrow repeats, the step becomes **2 cm after 0.75 s**, **5 cm after 1.5 s**, and **10 cm after 2.5 s**. Release the arrow to reset its repeat timing. The shortcut normally stops decreases at 1 cm; the exact fields accept smaller positive values.

## Snap to walls and inspect connections

- **Open floor:** The pencil places points on a **0.25 m grid**. It checks nearby saved endpoints first (using the raw floor hit, then the rounded grid point), then draft endpoints. The endpoint snap range is **0.20 m**. The marker turns green when snapped.
- **3D wall ends:** Aim near either end of a visible wall, including near the top. The picker uses the nearest wall surface hit; a wall face can hide an endpoint behind it. The marker shows the hit height, but the new wall still connects to the existing **floor-level** endpoint. This also works with walls whose displayed geometry is tilted.
- **Copy dimensions:** A snap to a saved wall previews and copies that wall's **height and thickness**, not its tilt. Clicking the snap updates the pencil's dimension fields; a later snap to a different saved wall can replace those values. Snapping to a draft endpoint does not copy dimensions. Saved walls can still be edited individually.
- **Current connections:** Select a saved wall to see what is attached to its **Start point** and **End point**, including the other wall's name and whether its start or end is attached. This readout uses shared anchor IDs, not visual overlap. **Connect manually** remains available as a separate action.

An *anchor* is a shared floor point (`x`, `z`). Walls connected to it move with it, but each wall keeps its own height, thickness and tilt. The pencil does not create elevated walls, roofs, wall-midpoint junctions, or validated rooms.

## Implementation and API

| File | Responsibility |
| --- | --- |
| [`builder-page.tsx`](../frontend/src/pages/builder-page.tsx) and [`builder-style.css`](../frontend/src/pages/builder-style.css) | Draft lifecycle, dimension fields, keyboard repeat, viewport readout, connections panel and saving/error feedback. |
| [`wall-draft.ts`](../frontend/src/model/wall-draft.ts) and [`wall.ts`](../frontend/src/model/wall.ts) | Draft chain and parallel-side geometry, per-segment dimensions, adjustment steps, endpoint lookup, dimension validation and connection lookup. |
| [`WallDrawing.tsx`](../frontend/src/viewer3d/WallDrawing.tsx), [`Scene.tsx`](../frontend/src/viewer3d/Scene.tsx) and [`viewcube.tsx`](../frontend/src/viewer3d/viewcube.tsx) | Pointer projection and gesture filtering, draft meshes and markers, camera locking during dimension adjustment, and ViewCube click exclusion. |
| [`wall-snap.ts`](../frontend/src/viewer3d/wall-snap.ts), [`wall-pose.ts`](../frontend/src/viewer3d/wall-pose.ts) and [`WallMesh.tsx`](../frontend/src/viewer3d/WallMesh.tsx) | The 3D picker tests the ray against oriented wall boxes using the same position, turn and tilt as the rendered wall. |
| [`walls.ts`](../frontend/src/api/walls.ts), [`WallEndpoints.cs`](../backend/FurnaView.Api/Endpoints/WallEndpoints.cs) and [`WallService.cs`](../backend/FurnaView.Api/Services/WallService.cs) | Send the draft, validate it and resolve shared anchors before storing it. |

`POST /api/walls/draft` accepts a JSON array of the same wall objects used by `POST /api/walls`. Dimensions and coordinates are in metres; `tiltDegrees` is optional and defaults to zero.

```json
[
  {"name":"Wall 1","start":{"x":0,"z":0},"end":{"x":4,"z":0},"height":2.5,"thickness":0.15},
  {"name":"Wall 2","start":{"x":4,"z":0},"end":{"x":4,"z":3},"height":3,"thickness":0.2}
]
```

The endpoint returns **200 OK** with the saved walls in request order, including generated IDs, resolved endpoints, anchor IDs and lengths. In this example, the returned `endAnchorId` of Wall 1 equals the `startAnchorId` of Wall 2. An empty array, a null item, invalid geometry, or an endpoint snap that collapses a wall rejects the whole draft with **400 Bad Request**. The server validates all segments before inserting any. A single wall creation still returns **201 Created**.

The API snaps new endpoints to the nearest existing anchor within **0.20 m** and reuses anchors for exactly matching coordinates within the submitted draft. During updates, moved endpoints can merge with other anchors. The target anchor stays where it is, and the service checks that no connected wall would collapse before applying changes. Dimensions are copied by the pencil and sent in the request; the server does not copy dimensions when it snaps geometry. The repository is in memory, so restarting the API clears saved walls.

## Verification

From the repository root:

```sh
npm --prefix frontend test
npm --prefix frontend run typecheck
dotnet test backend/FurnaView.Api.Tests/FurnaView.Api.Tests.csproj
```

Frontend tests cover draft chaining, perpendicular pairs, per-segment dimensions, accelerated arrow steps, snapping and connection lookup. Backend tests cover batch validation, shared anchors, snapping on creation and update, and rejection of changes that would collapse connected walls.

For a browser smoke test, draw and save a wall, then start a second draft and aim high at either end in 3D. Check that the marker follows the wall end, the new segment stays on the floor, and dimensions are copied. Hold **D** and an arrow to check the preview, readout and repeat behavior. Try a drag, a pinch or wheel zoom, and a ViewCube click without adding points. Finally, finish one connected draft and cancel another; confirm the saved connection appears in **Current connections** and the cancelled draft does not appear in the list.
