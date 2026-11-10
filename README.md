# FurnaView

To build and test the entire app from the repository root, run `npm run build`.
This requires the .NET 10 SDK and Node.js 24. The command tests the backend,
installs and tests the frontend, then typechecks and produces `frontend/dist/`.

To start both the API and the frontend locally, run `npm run dev` from the
repository root and open the URL Vite prints (usually http://localhost:5173).
The API listens on http://localhost:5080. Press Ctrl+C to stop both servers.
The dev command installs frontend dependencies if needed (and refreshes them
from the lockfile on each run). See [`frontend/`](frontend/README.md) for controls.

Sprint reviews live in [`sprints/`](sprints/README.md), starting with the [Sprint 1 Reveal.js presentation](sprints/sprint-1/README.md).
