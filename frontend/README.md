# FurnaView frontend

A minimal, full-window 3D viewport built with React, TypeScript, Vite, Three.js, React Three Fiber, and Drei. The wall API backend is required for loading and saving walls.

## Run locally

Install Node.js 24 and the .NET 10 SDK, then run `npm run dev` from the repository root to start both servers. Alternatively, with the API already running on port 5080, from this directory:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Add walls using **+ Add Wall**; an empty server starts with an empty grid. Left-drag in the viewport to orbit, right-drag to pan, and scroll to zoom. The ViewCube in the upper-right follows the camera; left-drag it to rotate the cube independently, then release to return it to its camera-following orientation. Click a ViewCube face to snap the camera to that view. Click a wall to select it (its color brightens); use the arrow keys to move it across the XZ ground plane in 0.25 m steps (left/right = X, up/down = Z). Hold Shift and press Left/Right to turn it around its vertical axis, or Shift+Up/Down to tip it around its base until it lies flat on either side (limited to ±90°). Click empty space to deselect it. Run `npm run typecheck` for a TypeScript check and `npm run build` for a production build.

## Where things live

- `index.html` and `src/main.tsx`: browser and React entry points.
- `src/App.tsx` and `src/styles.css`: full-window canvas, multiple walls, selection/movement state and controls.
- `src/api/`: backend communication and API request/response types.
- `src/model/wall.ts`: wall geometry and interaction helpers.
- `src/viewer3d/Scene.tsx`: assembles the background, lighting, grid, walls and controls.
- `src/viewer3d/viewcube.tsx`: camera-following ViewCube, independent rotation and face-click camera snapping.
- `src/viewer3d/WallMesh.tsx`: derives selectable geometry from each wall; does not own its position.
- `src/viewer3d/GroundGrid.tsx`: XZ ground grid and origin markers.
- `src/viewer3d/CameraControls.tsx`: orbit, pan and zoom interaction.
- `src/viewer3d/sceneConfig.ts`: initial camera and grid settings.

Walls can be connected by endpoints, but this is not a validated room or complete building model. Wall data is stored only in memory and is lost when the backend restarts.
