# Sprint 1 — Reveal.js review

Four slides: project purpose, the Plan → Explore → Understand vision, actual Sprint 1 work, and the next room milestone. The green-and-mint colors come from the document styles in `../../../FurnaView_System_Specification.docx` (in the parent `Syp-Project` directory; not copied into this repo). `assets/prototype-viewport.png` is an actual screenshot of the local frontend viewport, cropped to remove blank browser margin; it shows the initial wall, not a completed room.

Use Node.js 22.12 or newer. From this folder:

```sh
npm ci
npm run dev
```

Open the presentation at **http://localhost:5174/** and navigate with the arrow keys. This keeps it separate from the frontend development server at http://localhost:5173/. To produce a static version, run `npm run build`; `npm run preview` serves the built presentation at **http://localhost:4174/**. If either presentation port is already in use, Vite reports an error rather than silently choosing another port. No external CDN is needed after dependencies are installed. Reveal.js is MIT-licensed; Vite is MIT-licensed.

The slide content is a summary of work currently present in `frontend/`; no sprint dates or team-approved sprint commitments were inferred. Update goal/status wording if the team's formal Sprint 1 plan differs.
