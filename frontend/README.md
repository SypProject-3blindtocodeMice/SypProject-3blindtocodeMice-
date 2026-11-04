# FurnaView frontend

A minimal, full-window 3D viewport built with React, TypeScript, Vite, Three.js, React Three Fiber, and Drei. No backend is needed to run it.

## Run locally

Install Node.js 20.19+ or 22.12+ (Node.js 24 is also supported), then from this directory:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Left-drag to orbit, right-drag to pan, and scroll to zoom. Run `npm run typecheck` for a TypeScript check and `npm run build` for a production build.

## Where things live

- `index.html` and `src/main.tsx`: browser and React entry points.
- `src/App.tsx` and `src/styles.css`: full-window canvas and responsive sizing.
- `src/viewer3d/Scene.tsx`: assembles the background, lighting, grid and controls. Add a simple 3D object here, e.g. `<mesh position={[2, 0.5, 0]}><boxGeometry /><meshStandardMaterial color="orange" /></mesh>`.
- `src/viewer3d/GroundGrid.tsx`: XZ ground grid and origin markers.
- `src/viewer3d/CameraControls.tsx`: orbit, pan and zoom interaction.
- `src/viewer3d/sceneConfig.ts`: initial camera and grid settings.

The grid is a visual reference, not an editable building model. Future building geometry can be added as its own component in `viewer3d` and composed in `Scene.tsx`.
