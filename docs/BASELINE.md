# FurnaView — technology baseline and controlled implementation pack

**Version 2.0 · 04 November 2026 · Status: RECOMMENDED, NOT ADOPTED.**

This package recommends a concrete stack while preserving the team's control over every coding action. The documents are **not** an instruction to execute or change any repository.

## Recommended implementation stack
**Web:** TypeScript strict + React + Vite + React Konva + Three.js/React Three Fiber (+ Drei).  
**Backend/domain:** C# + ASP.NET Core Minimal APIs + typed semantic model + appropriate NetTopologySuite geometry operations.  
**Simulation:** first C# well-mixed CO₂ zone solver; later NIST CONTAM for multizone air/contaminants, EnergyPlus for thermal/energy, optional OpenFOAM for spatial CFD.  
**Recognition:** C# OpenCvSharp baseline vs Python/OpenCV research spike; don't maintain both without evidence.  
**Data:** JSON fixtures; SQLite + EF Core for local persistence; PostgreSQL only when requirements justify it.  
**Engineering:** monorepo, PR-only CI, no deployment automation by default.

## Reading order
- **Team:** `team/FurnaView_Team_Guide.docx`, then `team/DECISION_REGISTER.md`.
- **Agents:** `agent/AGENTS.md` (mandatory charter), then `agent/ARCHITECTURE.md`, then relevant language/layer guides.

## Authority and safety
The defaults above help agents recommend good implementation steps. **They do not authorize writing files, installing anything, running commands, committing, or deploying.** Agent must propose an exact bounded task and obtain explicit approval. Approval for one task is not approval for future tasks.

## Basis and boundaries
Based on the project's October 2026 system specification v0.2 and proposal, with engineering recommendations from technology research. Product requirements and future-engine integrations must not be conflated with approved implementation commitments.
