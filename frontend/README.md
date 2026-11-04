# FurnaView frontend

A minimal, full-window 3D viewport built with React, TypeScript, Vite, Three.js, React Three Fiber, and Drei. No backend is needed to run it.

## Run locally

Install Node.js 20.19+ or 22.12+ (Node.js 24 is also supported), then from this directory:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Left-drag to orbit, right-drag to pan, and scroll to zoom. Click the wall to select it (its color brightens); use the arrow keys to move it across the XZ ground plane in 0.25 m steps (left/right = X, up/down = Z). Hold Shift and press Left/Right to turn it around its vertical axis, or Shift+Up/Down to tip it around its base until it lies flat on either side (limited to ±90°). Each keydown turns or tips it 1°; holding a key repeats at your keyboard's normal repeat rate. Click empty space to deselect it. Run `npm run typecheck` for a TypeScript check and `npm run build` for a production build.

## Where things live

- `index.html` and `src/main.tsx`: browser and React entry points.
- `src/App.tsx` and `src/styles.css`: full-window canvas, temporary selection/movement state, keyboard controls and wall details overlay.
- `src/model/wall.ts`: typed wall data, stable ID, dimensions and position in meters, plus turn and tilt angles in degrees.
- `src/viewer3d/Scene.tsx`: assembles the background, lighting, grid, wall and controls.
- `src/viewer3d/WallMesh.tsx`: derives selectable geometry from wall data; does not own the wall's position.
- `src/viewer3d/GroundGrid.tsx`: XZ ground grid and origin markers.
- `src/viewer3d/CameraControls.tsx`: orbit, pan and zoom interaction.
- `src/viewer3d/sceneConfig.ts`: initial camera and grid settings.

This is one movable prototype wall, not a validated building model or a complete room. Future building elements can be modeled separately from their rendering components and composed in `Scene.tsx`.
