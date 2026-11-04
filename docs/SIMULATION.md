# FurnaView — Progressive simulation design
**Recommended technical direction; nothing here authorizes execution or installation.** Read `AGENTS.md` and `ARCHITECTURE.md` first.

## Decision: progressive engines
| Stage | Preferred engine | Analysis | Why |
|---|---|---|---|
| 1 MVP | In-process C# custom zone CO₂ solver | Well-mixed room CO₂ vs time; prescribed outdoor/inter-room flows | Transparent, small, testable, team expertise |
| 1b optional | C# simple thermal RC model | Approximate temperature dynamics | Only after CO₂ is validated; avoid unverifiable comfort predictions |
| 2 research | NIST CONTAM | Multizone airflow / contaminant transport | Strong match for connected rooms and ventilation |
| 2 research | EnergyPlus CLI / epJSON | Thermal, energy and HVAC | Different problem, not a replacement for CONTAM |
| 3 stretch | OpenFOAM external executable | Spatial CFD velocity/pressure/temperature | High meshing/validation/deployment cost; never MVP |

Do not introduce C++ in the app for theoretical performance. Use existing native engines as separate processes when justified.

## Well-mixed CO₂ physics
General mass balance (constant volume, consistent concentration/flow units):
`V * dC/dt = sum(Q_in * C_in) - sum(Q_out * C_zone) + G`.
For balanced ventilation with outdoors: `V*dC/dt = Q*(C_out-C) + G`.
Inputs: zone volume, outside CO₂, occupancy-dependent source `G`, prescribed/inferred flow rates, initial conditions, duration, step. Conservation and balanced-volume assumptions must be documented.
**WARNING:** open window state or area alone does NOT determine volumetric airflow. Vents/doors need explicitly supplied flow, validated approximation or advanced pressure-driven solver.

## Numerical library decision
- Begin with plain C# double arithmetic and a documented deterministic integrator (Euler for simple comparisons, RK4 for stronger reference if justified). Avoid adding large numeric frameworks until needed.
- `MathNet.Numerics` candidate for matrices and linear algebra, but not an automatic one-stop ODE modeling package.
- Python SciPy `solve_ivp` useful as independent *test oracle*, not production requirement.
- Validate analytical constant-ventilation solution, convergence vs timestep, and mass conservation; explicitly check negative/nonphysical concentrations.

## Recommended solver contracts
- `SimulationInput`: immutable validated building snapshot + scenario snapshot; units, duration, time step, outdoor conditions, source schedules, flow assumptions.
- `ISimulationEngine`: ID/version, supported metrics and outputs, preflight validation, async execution with cancellation/progress.
- `SimulationResult`: engine and config fingerprint, immutable inputs, state, warnings, time values and typed results.
- `ZoneTimeSeries`: variable, unit, room ID, series points; **different from** future `SpatialField` mesh/point values.
- `SimulationCoordinator` selects an explicitly capable engine; handles state, cancellation, runs, logging; must not hide solver failures or invent missing results.

## Future engine adapters: one proof-of-concept per decision
**CONTAM**: map rooms to zones, openings to airflow paths, boundary weather/pressure assumptions, leakage and contaminant inputs; test direct engine file execution/manual example before building export converter. Check installed binary, supported platform, license notice, error handling.
**EnergyPlus**: map to thermal zones/surfaces/material constructions, schedules, weather and HVAC assumptions. Prefer official epJSON/CLI initially; C/Python API only for demonstrated needs. Zone-based shape mapping must not claim thermal fidelity without correct constructions/weather.
**OpenFOAM**: requires watertight 3D and surface classifications, domain mesh, boundary velocities/pressures, numerical solver setup, turbulence physics; output large spatial fields and potential ParaView/VTK conversion. Schedule as research, not implementation commitment.

## Deployment and integration costs — rough estimates, not promises
- single-room CO₂ C# prototype: 4–10 focused developer-days; coupled zones: +5–12; validation/documentation additional effort.
- CONTAM research spike: 10–25 developer-days, EnergyPlus: 15–35; OpenFOAM simple spike: 25–60+; robust arbitrary-plan integration could take substantially longer.
- Software licenses may be no-cost, but runtime packaging, platform support, security, CPU/RAM, testing and long-running job management cost time.
- Honeybee is *optional*; its licenses must be reviewed before depending on it. Do not treat a python package as required to run EnergyPlus.

## Acceptance criteria
- Deterministic runs from fixed inputs; analytical or independent numeric comparisons pass specified tolerances.
- Every result carries model revision, units, solver version, assumptions and explicit 'planning estimate' disclosure.
- A failed/cancelled simulation never overwrites valid model, scenario or completed results.
- UI shows working state after 500 ms target without blocking input.
- Render room-average overlays only for zone solvers; do not present visual particles as CFD streamlines.
