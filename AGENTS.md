# AGENTS.md

## Project Context

This project is a two-year, three-person software project in the AEC / building-design space.

The current working concept is an **accessible building-planning and analysis platform** that can turn floor plans or building data into an interactive 3D model and help users understand how a planned space may behave before it is built.

The project should not be treated as a replacement for professional BIM/CAD systems such as Revit or Archicad. The intended position is between:

- easy-to-use floor-plan / home-design software, and
- professional BIM, parametric design, and environmental simulation tools.

The strongest concise positioning statement is:

> **Existing tools often either make building design easy or building analysis powerful. Our goal is to combine both approaches in one accessible workflow.**

Another useful project description is:

> **An accessible building-planning and analysis platform that turns floor plans into interactive 3D models and helps users understand how planned spaces may behave before they are built.**

---

## Important User Context

The user is interested in this area but is **new to CAD, BIM, AEC, CFD, and building simulation**.

Do not assume prior professional knowledge.

When discussing domain-specific concepts:

- explain acronyms the first time they appear;
- explain why a technology exists, not only what it is called;
- distinguish clearly between CAD, BIM, parametric design, digital twins, building simulation, and CFD;
- use small practical examples;
- point out when a concept is industry-standard versus experimental or optional;
- correct misunderstandings gently and concretely;
- avoid presenting professional AEC terminology as obvious.

The user benefits from guided reasoning such as:

> “This tool sits here in the workflow, and this is why it matters to your project.”

The user is currently exploring the product and technical direction, so avoid locking the project into specific technologies unless there is a strong reason.

---

# Core Product Idea

The intended workflow is approximately:

```text
Blueprint / Floor Plan / Building Data
                ↓
        Automatic Recognition
                ↓
      Editable Building Model
                ↓
        Interactive 3D View
                ↓
Add Building Properties / Occupancy / Openings
                ↓
      Environmental Simulation
                ↓
Visualize Airflow / Temperature / CO₂ / Comfort
                ↓
      Compare Design Alternatives
                ↓
Optional Real-World Sensor / Telemetry Data
```

The main value proposition is that users should be able to do more than simply **see** a planned building.

They should be able to better **understand and experience** it before construction.

A useful problem statement is:

> **Floor plans show space, but not how it feels to live in it.**

Another useful framing is:

> **You can plan a home, but you cannot truly experience it before it is built.**

The platform should help reduce that gap.

---

# Product Positioning

The project should be positioned as a bridge between two existing software categories.

## Easy Design / Visualization Tools

Examples:

- RoomSketcher
- Planner 5D
- SketchUp

Typical strengths:

- easy to learn;
- fast floor-plan creation;
- blueprint import;
- attractive 3D visualization;
- suitable for non-specialists.

Typical limitation relative to this project:

- environmental analysis is not usually the primary focus;
- the generated model is often mainly used for visualization, furnishing, and presentation.

## Professional AEC / Analysis Tools

Examples:

- Autodesk Revit
- Graphisoft Archicad
- Autodesk Forma
- Rhino + Grasshopper
- Ladybug / Honeybee
- specialist CFD / simulation software

Typical strengths:

- sophisticated building information;
- professional workflows;
- environmental analysis;
- parametric or computational design;
- detailed simulation;
- multidisciplinary collaboration.

Typical limitation relative to this project:

- more complex;
- often assumes specialist knowledge;
- usually designed for architects, engineers, or larger professional workflows.

## Intended Project Position

The project should aim to be:

- **more analytical than ordinary home-design software**, and
- **more approachable than professional BIM / simulation software**.

Do not claim that no similar tools exist.

The stronger and defensible claim is:

> **The individual capabilities already exist, but they are often separated across tools or aimed at more experienced users. The project explores whether floor-plan recognition, simple building editing, 3D exploration, and understandable environmental feedback can be combined into one accessible workflow.**

---

# Important Research Finding: Do Not Use Old “BIM Levels” as the Main Argument

Earlier research used “BIM Level 0 / 1 / 2” as if the levels described how much environmental analysis a tool supports.

This is misleading.

The old BIM maturity-level terminology primarily concerned **information management and collaboration maturity**, not whether software supports airflow, heat, air quality, or other environmental simulation.

Therefore:

- do not classify the project using BIM Level 0 / 1 / 2;
- do not say “Level 1 software does not support environmental analysis”;
- instead describe tools by their actual role in the workflow.

Preferred categories:

- floor-plan / consumer design tools;
- conceptual 3D tools;
- parametric / computational design tools;
- BIM authoring tools;
- environmental analysis tools;
- engineering simulation tools;
- digital-twin / building-operation platforms.

---

# Comparable Technologies by Project Stage

## 1. Floor-Plan Import and Recognition

### Similar tools

- RoomSketcher
- Planner 5D

### What they already do

They can accept uploaded floor plans or blueprints and convert them into editable layouts and 3D representations.

Depending on the tool, recognition may include:

- walls;
- doors;
- windows;
- rooms;
- stairs.

### Project difference

In this project, recognition is not the final feature.

The recognized geometry should become the basis for:

- environmental analysis;
- airflow simulation;
- temperature visualization;
- CO₂ analysis;
- occupancy modeling;
- interactive walkthroughs.

So the goal is:

```text
Blueprint
   ↓
Structured Building Model
   ↓
Analysis + Visualization
```

rather than only:

```text
Blueprint
   ↓
3D Visualization
```

---

## 2. Building Editing and Sketching

### Similar tools

- SketchUp
- Rhino
- RoomSketcher

### What they do

They let users create and modify geometry.

- RoomSketcher focuses on simple floor plans.
- SketchUp focuses on approachable architectural 3D modeling.
- Rhino provides much more flexible and advanced geometric modeling.

### Project difference

Do not try to build a full general-purpose CAD system.

The editor should focus on building-specific objects such as:

- rooms;
- walls;
- doors;
- windows;
- vents;
- openings;
- heating/cooling sources;
- occupancy;
- sensors.

This keeps the system focused and manageable.

---

## 3. 3D Visualization and Walkthrough

### Similar tools

- SketchUp
- Rhino
- Planner 5D
- RoomSketcher

### What they do

They can generate or display buildings in 3D.

Some provide walkthrough-style or first-person views.

### Project difference

The 3D model should not only be visual.

Objects should have semantic meaning.

Example room properties:

- volume;
- temperature;
- CO₂ level;
- humidity;
- occupancy;
- ventilation state.

Example window properties:

- size;
- position;
- open/closed state.

This lets the same 3D model participate in simulation and telemetry.

---

## 4. Parametric / Computational Design

### Similar tools

- Rhino
- Grasshopper

### What they do

Rhino is a flexible 3D modeling tool.

Grasshopper is a visual programming environment used with Rhino for parametric and computational design.

A design can be controlled using parameters such as:

- room dimensions;
- window sizes;
- building height;
- orientation;
- number of floors.

Changing a parameter can regenerate geometry.

### Project difference

The project should not expose a complex node-based programming environment to ordinary users.

Instead:

- the internal model may be parameter-aware;
- the interface should remain simple;
- relevant parameters should be exposed directly.

Example:

```text
Room Width:       4.2 m
Room Length:      5.8 m
Window Width:     1.5 m
Window Height:    1.2 m
Occupancy:        4 people
```

---

## 5. Environmental Analysis

### Similar tools

- Autodesk Forma
- Ladybug Tools
- Honeybee

### What they do

These tools demonstrate that environmental feedback can be integrated into the design process.

Examples of analysis include:

- sunlight;
- daylight;
- wind;
- energy;
- solar exposure;
- thermal comfort;
- microclimate;
- noise.

### Project difference

The project can focus more strongly on **indoor, room-level behavior**.

Potential areas:

- indoor airflow;
- CO₂ concentration;
- temperature;
- humidity;
- occupancy;
- ventilation;
- thermal comfort.

The results should be understandable to a non-specialist.

Instead of only showing engineering data, the system may produce messages such as:

> “The bedroom may overheat during the afternoon.”

or:

> “With four occupants, the current ventilation setup may cause CO₂ to rise quickly.”

---

## 6. Detailed Simulation

### Similar technologies

- Ladybug / Honeybee
- CFD tools
- OpenFOAM
- specialist engineering simulation software

### What they do

Detailed simulation tools can model physical behavior such as:

- air velocity;
- pressure;
- temperature;
- turbulence;
- heat transfer;
- contaminant transport.

### Project difference

Do not make engineering-grade CFD accuracy a requirement for the first version.

The safer progression is:

1. simplified room-level or graph-based models;
2. understandable visual results;
3. optional integration with more advanced simulation later.

A possible pipeline is:

```text
Building Model
      ↓
Simulation Setup
      ↓
Airflow / Temperature Calculation
      ↓
Result Data
      ↓
3D Visualization
```

Do not plan to write a complete CFD solver from scratch.

---

## 7. Telemetry and Digital-Twin Concepts

### Similar technologies

- smart-building systems;
- building-management systems;
- digital-twin platforms.

### What they do

These platforms can connect physical buildings to digital models using live or historical data such as:

- temperature;
- humidity;
- CO₂;
- occupancy;
- energy consumption;
- equipment state.

### Project difference

A particularly interesting future feature is to use the same model for both:

- **predicted behavior from simulation**, and
- **measured behavior from real sensors**.

Example:

| Measurement | Simulation | Real Sensor |
|---|---:|---:|
| Temperature | 22.5 °C | 23.2 °C |
| CO₂ | 850 ppm | 1,150 ppm |
| Airflow | 70 m³/h | 58 m³/h |

This allows the system to show where reality differs from the planned model.

This is an advanced extension, not necessarily an MVP requirement.

---

## 8. Professional BIM and Collaboration

### Similar tools

- Autodesk Revit
- Graphisoft Archicad

### What they do

These are full professional BIM authoring systems.

They support areas such as:

- intelligent building objects;
- detailed construction documentation;
- schedules;
- multidisciplinary collaboration;
- structural systems;
- mechanical systems;
- electrical systems;
- project coordination.

### Project difference

The project should not compete with Revit or Archicad feature-for-feature.

The intended focus is:

- early planning;
- spatial understanding;
- environmental feedback;
- visualization;
- simple simulation;
- accessibility for non-specialists.

---

# Useful Technology Spectrum

A rough conceptual spectrum is:

```text
Easy / Consumer
│
├── Planner 5D
├── RoomSketcher
│
├── SketchUp
│
├──────── PROJECT TARGET AREA ────────
│
├── Autodesk Forma
├── Rhino + Grasshopper
│
├── Archicad
├── Revit
│
└── Specialist CFD / Engineering Tools
                     ↓
               Specialist / Professional
```

Do not interpret this as a quality ranking.

These products solve different problems.

The project aims to occupy a useful middle area.

---

# Important Reference Technologies

For presentations and competitor research, the most useful references are:

## RoomSketcher / Planner 5D

Use as references for:

- blueprint recognition;
- easy floor-plan editing;
- simple 3D visualization;
- consumer-friendly UX.

## SketchUp

Use as a reference for:

- approachable architectural 3D modeling;
- quick conceptual modeling;
- beginner-friendly spatial design.

## Rhino + Grasshopper

Use as references for:

- advanced geometry;
- parametric design;
- computational design;
- rule-driven modeling.

The user particularly likes the general style and concept of Rhino / Grasshopper.

However, Grasshopper is aimed at more advanced users and exposes computational logic directly.

The project may borrow the idea of parameter-driven design while offering a simpler interface.

## Autodesk Forma

Use as a very important reference for:

- early-stage building design;
- fast environmental feedback;
- making analysis available earlier in the design process.

Forma is important because it proves that accessible environmental feedback during planning is already a serious product direction.

Do not claim the project is the first tool to make environmental analysis accessible.

Instead, differentiate on:

- floor-plan-centered workflow;
- indoor room-level analysis;
- blueprint recognition;
- simple walkthrough experience;
- residential / small-building focus.

## Revit / Archicad

Use as references for:

- professional BIM;
- intelligent building data;
- multidisciplinary workflows;
- construction documentation;
- industry-scale collaboration.

Use them mainly to explain what the project is **not trying to replace**.

## Ladybug / Honeybee

Use as references for:

- environmental design;
- climate analysis;
- daylight;
- energy;
- thermal comfort;
- simulation-connected design workflows.

They are especially useful when explaining that environmental feedback can be closely connected to design models.

---

# Potential Customer Base

There appears to be a plausible customer base, but the target audience should be narrowed.

Potential groups include:

## 1. Private Homeowners / Self-Builders

People planning:

- a new home;
- a renovation;
- an extension.

Potential need:

- understand how the space may feel before construction;
- compare layouts;
- understand sunlight, comfort, ventilation, or room behavior.

## 2. Small Architecture Offices / Independent Designers

Potential need:

- fast early-stage feedback;
- easy communication with clients;
- quick comparison of design alternatives;
- a lighter tool before detailed BIM modeling.

## 3. Architecture / Building-Design Students

Potential need:

- learn relationships between geometry and building performance;
- experiment with environmental effects;
- understand design decisions visually.

## 4. Small Developers / Renovation Planners

Potential need:

- compare alternatives before committing to detailed design;
- explain design choices to clients or stakeholders.

## 5. Building / Facility Operators

Only relevant if telemetry and room management become important later.

Possible uses:

- sensor overlays;
- occupancy;
- environmental monitoring;
- room utilization.

This should probably not be the primary customer for the initial version.

---

# Strongest Early Target Customer

A good initial target is:

> **People and small design teams in the early planning stage of residential or small commercial buildings who want to understand both how a space looks and how it may perform before committing to construction.**

The project should validate this target with interviews if possible.

A useful validation exercise would be to talk to:

- architects;
- architecture students;
- builders;
- people currently planning a home;
- renovation professionals.

---

# Room Scheduling / Reservation Feature

A room-reservation module has been discussed.

It can make sense, but only if the project expands from:

> planning and simulation before construction

into:

> planning, analysis, and later operation of the building.

Scheduling is more naturally part of a built/operational building.

It becomes coherent when connected to the 3D model and telemetry.

Example:

- click a room in 3D;
- see capacity;
- see equipment;
- see environmental status;
- see availability;
- reserve it.

Possible advanced query:

> “Find a room for six people tomorrow with a display and acceptable air quality.”

This could be a useful future module, but it should not become a core feature unless the product direction explicitly includes building operation.

Avoid adding it just because it is another feature.

---

# Feature Scope Philosophy

Every feature should be tested against:

> **Does this help the user understand, experience, or analyze the planned building?**

If yes, it probably fits.

If not, it may be feature creep.

The product should remain coherent rather than becoming:

- CAD;
- BIM;
- booking system;
- IoT dashboard;
- VR app;
- project-management system;

all at once.

---

# Two-Year Development Direction

The project is suitable for a two-year three-person team because it can grow naturally without artificial feature inflation.

A sensible progression is:

## Phase 1 — Research and Foundation

Focus on:

- AEC terminology;
- floor-plan formats;
- building representation;
- geometry fundamentals;
- 3D rendering concepts;
- competitor research;
- defining target users;
- creating a simple proof of concept.

The team should understand the domain before overcommitting to architecture or technology choices.

## Phase 2 — Core Building Model

Build:

- rooms;
- walls;
- doors;
- windows;
- floors;
- dimensions;
- semantic building objects.

The main goal is a stable internal building representation.

## Phase 3 — 3D Visualization

Add:

- automatic generation of 3D geometry from the internal model;
- camera controls;
- object selection;
- room highlighting;
- walkthrough mode;
- object properties.

## Phase 4 — Plan Recognition

Start with controlled inputs.

Possible progression:

1. structured / manually defined floor plans;
2. vector plans;
3. semi-automatic recognition;
4. scanned plans as an experimental extension.

Important:

Do not promise perfect automatic understanding of arbitrary blueprints.

A better design is:

```text
Plan
 ↓
Automatic Detection
 ↓
Detected Walls / Doors / Rooms
 ↓
Human Correction
 ↓
Validated Building Model
```

The human-correction stage is realistic and should be treated as part of the product.

## Phase 5 — Environmental Modeling

Begin with simplified models.

Potential first targets:

- room volume;
- occupancy;
- ventilation;
- CO₂;
- temperature;
- simplified airflow between rooms.

Do not begin with full CFD.

## Phase 6 — Visualization of Environmental Data

Add:

- room heatmaps;
- animated airflow;
- arrows / particles / streamlines;
- charts;
- warnings;
- scenario comparisons.

## Phase 7 — Scenario Analysis

Allow users to compare:

- window open vs closed;
- different room occupancy;
- ventilation layouts;
- orientation changes;
- alternative floor plans.

This may become one of the strongest product features.

## Phase 8 — Advanced Extensions

Possible options:

- telemetry / sensor integration;
- simulation vs real-world comparison;
- more sophisticated environmental models;
- external simulation-engine integration;
- VR walkthrough;
- room scheduling;
- collaboration.

These should be treated as stretch goals until the core workflow is stable.

---

# MVP

A defensible MVP could be:

> Import or manually define a simple floor plan, convert it into an editable semantic building model, generate an interactive 3D representation, configure basic room and ventilation properties, run a simplified indoor environmental analysis, and visualize the results.

The MVP does **not** need:

- full BIM support;
- perfect AI blueprint recognition;
- engineering-grade CFD;
- real-time telemetry;
- VR;
- booking;
- multiplayer collaboration.

---

# Stretch Goals

Possible stretch goals include:

- advanced plan recognition;
- scanned blueprint support;
- automated door/window detection;
- more detailed thermal modeling;
- CFD integration;
- live sensors;
- simulation-vs-reality comparison;
- VR walkthrough;
- automatic design suggestions;
- room scheduling / reservation;
- multi-user collaboration.

---

# Important Scope Warning

Avoid promising:

> “Upload any blueprint and get a scientifically accurate digital twin.”

That is far too broad.

Prefer:

> “The system assists in converting supported floor plans into a validated 3D building model that can be used for simplified environmental analysis.”

This is still ambitious and much more credible.

---

# Useful Internal Building Representation

The building should eventually behave as more than a mesh.

A useful conceptual representation is a graph:

```text
Bedroom ──door── Hallway ──door── Kitchen
                    │
                    │
                   door
                    │
                 Bathroom
```

Internally:

```text
Room A ───── Room B ───── Room C
              │
              │
            Room D
```

Connections may contain information such as:

- opening area;
- door/window state;
- airflow resistance;
- airflow rate;
- temperature difference.

This representation can later support:

- airflow;
- CO₂ movement;
- evacuation;
- accessibility;
- pathfinding;
- smoke propagation.

Do not assume this exact representation must be used, but it is a useful conceptual model.

---

# Environmental Simulation Strategy

A sensible path is to begin with simplified equations / zone models rather than full CFD.

For example, rooms can be treated as connected volumes.

Each room may contain:

- volume;
- temperature;
- humidity;
- CO₂ concentration;
- occupancy;
- incoming airflow;
- outgoing airflow.

Doors/windows/vents become connections.

This allows time-step simulations without solving every point in 3D space.

Later, more detailed simulation may be integrated.

The project should distinguish clearly between:

- **simplified educational / planning simulation**, and
- **engineering-grade simulation**.

Never imply engineering certification or professional accuracy unless it has actually been validated.

---

# Potential Differentiators

The strongest differentiators discussed so far are:

## 1. Blueprint Recognition as the Beginning, Not the End

Existing consumer software often uses recognition to create something the user can furnish and visualize.

This project uses the recognized model for analysis.

## 2. Indoor / Room-Level Focus

Especially:

- airflow;
- CO₂;
- temperature;
- occupancy;
- ventilation;
- comfort.

## 3. Accessible Environmental Feedback

Professional analysis outputs can be difficult for non-specialists.

The project can translate results into understandable feedback.

## 4. Experience Before Construction

Users should be able to explore the planned space and understand it before committing to construction.

## 5. Scenario Comparison

Allow simple “what if?” experiments.

Examples:

- What happens if this window is larger?
- What if four people sleep in this room?
- What if the ventilation opening moves?
- Which layout has better airflow?
- Does this room overheat?

## 6. Optional Simulation-vs-Reality Comparison

If telemetry is added later, compare planned and measured behavior.

---

# Novelty Position

Do **not** claim the project is technologically unprecedented.

The project is novel primarily in:

- integration;
- accessibility;
- workflow;
- target audience;
- focus.

A good description is:

> **Established problem space, relatively uncommon combination.**

The strongest novelty claim is approximately:

> **A guided workflow combining floor-plan recognition, semantic 3D building reconstruction, indoor environmental analysis, and potentially real sensor data for users who do not want the complexity of full professional BIM and engineering software.**

---

# Pitch Language

Useful sentences:

> **Existing tools often either make building design easy or building analysis powerful. Our goal is to connect both in one accessible workflow.**

> **Floor plans show space, but not how it feels to live in it.**

> **We are not trying to replace professional CAD or BIM software. We want to bridge the gap between simple home-design tools and professional building-analysis software.**

> **Existing solutions cover many individual parts of the workflow. Our project investigates whether these capabilities can be combined into a simpler experience focused on early building decisions.**

> **The model is not only visual; it becomes the foundation for environmental analysis.**

---

# Claims to Avoid

Do not say:

- “No software like this exists.”
- “Professional tools cannot analyze this.”
- “We will automatically understand every blueprint.”
- “Our airflow results are scientifically accurate” unless validated.
- “We are building a replacement for Revit.”
- “We will build our own full CFD solver.”

Prefer accurate, narrower claims.

---

# Important Open Questions

Future work should investigate these questions in roughly this order:

1. Who is the primary customer?
2. What exact problem is painful enough for that customer?
3. Which environmental analyses matter most?
4. What floor-plan input formats should the first version support?
5. What degree of automatic recognition is realistic?
6. What internal representation should the building use?
7. What level of simulation accuracy is appropriate?
8. What 3D interaction style is best?
9. Which professional formats should eventually be supported?
10. Are telemetry and room scheduling part of the same product or later extensions?
11. Which technologies/frameworks best fit the chosen architecture?

Do not choose technology before the requirements are better understood.

---

# Guidance for Future Agents

When helping with this project:

1. Keep explanations beginner-friendly.
2. Define AEC/BIM/CAD terminology.
3. Distinguish facts from assumptions.
4. Verify current industry claims before presenting them as facts.
5. Avoid overstating novelty.
6. Keep the product focused.
7. Prefer staged implementation over ambitious all-at-once plans.
8. Highlight technical risks early.
9. Explain why a suggested feature belongs in the product.
10. Do not force a specific tech stack unless the user asks for one.
11. When comparing tools, explain where each tool sits in the workflow.
12. Help the user turn research into pitch-ready language.
13. Preserve the distinction between visualization, semantic building models, BIM, simulation, telemetry, and digital twins.
14. When the user suggests a feature, evaluate it against: **“Does this help the user understand, experience, or analyze the building?”**
15. Remember that this is a **three-person, two-year project**.

---

# Current Project Identity

The project is currently best understood as:

> **A lightweight, accessible building-planning and analysis platform focused on turning floor plans into explorable semantic 3D models and giving users understandable environmental feedback before construction.**

This identity may evolve, but future decisions should remain consistent with it unless the team deliberately changes direction.
