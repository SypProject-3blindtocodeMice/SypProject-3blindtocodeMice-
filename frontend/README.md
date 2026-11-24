# FurnaView frontend

A building editor with 2D and 3D views, built with React, TypeScript, Vite, Three.js, React Three Fiber, and Drei. The wall API backend is required for loading and saving walls.

## Run locally

Install Node.js 24 and the .NET 10 SDK, then run `npm run dev` from the repository root to start both servers. Alternatively, with the API already running on port 5080, from this directory:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite, then open the builder. Add walls using **+ Add wall**; an empty server starts with an empty grid.

## Builder controls

The builder opens in **2D**. The blue button in the bottom-right corner shows the current mode; click it, or focus it with **Tab** and press **Enter** or **Space**, to switch. On small screens it sits above the wall editor. The **?** button in the editor shows controls for the current mode.

### Move around the building

| Action | 2D mouse | 2D touch | 3D mouse | 3D touch |
| --- | --- | --- | --- | --- |
| Pan (slide the view sideways) | Left- or right-drag | Drag with one finger | Right-drag | Drag with two fingers |
| Zoom in or out | Mouse wheel | Spread fingers to zoom in; pinch together to zoom out | Mouse wheel | Spread fingers to zoom in; pinch together to zoom out |
| Orbit (look from a different angle) | Disabled | Disabled | Left-drag | Drag with one finger |

**2D** looks straight down without perspective distortion. You can pan and zoom, but you can't rotate or tilt the camera. **3D** also shows the ViewCube in the upper-right: drag it to rotate it independently until you release, or click a face to snap the camera to that view.

For example, pan to a wall in **2D** and switch to **3D** to inspect its height. The view stays centered on the same spot on the floor plan, but each mode remembers its own zoom. Switching doesn't change the walls or clear your selection.

### Select and edit walls

Click or tap a wall to select it, or select it from the wall list. Click or tap empty space in the viewport to deselect it. The keyboard shortcuts below apply only when a wall is selected and focus isn't in a form field. On touch screens, use **Edit geometry** in the wall editor.

| Shortcut | Effect on the selected wall |
| --- | --- |
| **← / →** | Move along the X axis by 0.25 m per step |
| **↑ / ↓** | Move along the Z axis by 0.25 m per step |
| **Shift + ← / →** | Turn left or right around the vertical axis by 1° per step |
| **Shift + ↑ / ↓** | Tilt around the base by 1° per step, up to 90° in either direction |

Run `npm run typecheck` for a TypeScript check and `npm run build` for a production build.

## Where things live

- `index.html` and `src/main.tsx`: browser and React entry points.
- `src/pages/builder-page.tsx`: builder layout, view mode, and wall selection and editing state.
- `src/components/view_toggler/view-toggler.tsx`: 2D / 3D toggle button.
- `src/components/builder/controls-help.tsx`: on-screen mouse, touch, and keyboard reference.
- `src/api/`: backend communication and API request/response types.
- `src/model/wall.ts`: wall geometry and interaction helpers.
- `src/viewer3d/Scene.tsx`: renders the same walls in both modes, switches cameras, and carries the floor-plan center across modes.
- `src/viewer3d/viewcube.tsx`: camera-following ViewCube, independent rotation and face-click camera snapping.
- `src/viewer3d/WallMesh.tsx`: derives selectable geometry from each wall; does not own its position.
- `src/viewer3d/GroundGrid.tsx`: XZ ground grid and origin markers.
- `src/viewer3d/CameraControls.tsx`: 3D orbit, pan, and zoom controls.
- `src/viewer3d/sceneConfig.ts`: initial camera and grid settings.

### How the camera controls work

1. **One mode value controls the builder.** `BuilderPage` starts with `view` set to `2D`. The toggle displays that value and asks `BuilderPage` to change it on click. The scene uses the new value to choose a camera, and the **?** menu uses it to show the right gestures. The walls and their selection are separate state, so changing the view doesn't reload the walls or affect editing.
2. **The same scene is seen through two different cameras.** In 2D, the orthographic camera points straight down and shows objects at the same scale regardless of distance from the camera. It starts with 24 m visible along the shorter side of the viewport; the longer side shows more of the plan rather than stretching it. In 3D, the perspective camera makes distant objects look smaller, which helps show depth and height.
3. **The input mapping changes, not the model.** Both cameras use `OrbitControls`, a library component that handles mouse and touch gestures. In 2D, left-drag is mapped to panning instead of orbiting, and rotation is disabled. A two-finger gesture can pan by moving both fingers together or zoom by changing the distance between them. The inactive camera's controls stay mounted but don't respond to input.

**What gets carried over when switching?** Each camera has a *target*, the point it's looking at. The floor uses the X and Z axes; Y is height. If you pan until the target is at X = 6 m and Z = −3 m in 2D, the 3D camera moves to look at that same floor location. The code moves both the incoming camera and its target by the same horizontal offset. Moving only the target would swivel the camera; copying the outgoing camera's position would put the 3D camera directly overhead. Neither happens, so the destination mode keeps its own angle, height, and zoom.

**Why doesn't resizing reset 2D zoom?** The viewport dimensions determine the camera's starting visible area. Scrolling or pinching changes a separate zoom factor. When the window changes size, the code recalculates the visible area's proportions but leaves that zoom factor alone. The 3D camera's proportions are also updated while 2D is active, so its view and ViewCube are positioned correctly when you switch back.

Walls can be connected by endpoints, but this is not a validated room or complete building model. Wall data is stored only in memory and is lost when the backend restarts.
