# Backend

Sprint 1 prototype: `FurnaView.Api/` is a .NET 10 ASP.NET Core Minimal API;
`FurnaView.Api.Tests/` contains service, repository and HTTP integration tests.

```sh
dotnet run --project backend/FurnaView.Api --urls http://localhost:5080
dotnet test backend/FurnaView.Api.Tests/FurnaView.Api.Tests.csproj
```

Run these commands from the repository root. Run `npm run dev` in `frontend/`;
Vite proxies `/api` to the local backend on port 5080.

## Wall contract

`GET /api/walls`, `GET /api/walls/{id}`, `POST /api/walls`, and
`PUT /api/walls/{id}` exchange JSON DTOs, not the internal `Wall` class.
`POST /api/walls/draft` accepts an array of create requests and validates the
whole draft before storing any walls. See the [Wall Pencil guide](../docs/WALL_PENCIL.md#implementation-and-api)
for the batch contract and automatic snapping rules.
`DELETE /api/walls` clears the current wall model and returns `204 No Content`,
even when there are no walls.
`POST /api/walls/{id}/connections` accepts
`{ "endpoint": "start", "targetWallId": "<guid>", "targetEndpoint": "end" }`
and returns all updated walls. A create request looks like:

```json
{"name":"North wall","start":{"x":0,"z":0},"end":{"x":4,"z":0},"height":2.5,"thickness":0.15}
```

Coordinates and dimensions use **metres**. `X` and `Z` form the local floor
plane, `Y` points up, and the floor has `Y=0`. A wall runs horizontally from
`start` to `end`, rises by `height` and has `thickness` across its centerline.
The client derives mesh center as the midpoint and yaw from the endpoint vector;
the domain stores neither redundant center/length nor a Three.js transform.
Response `length` is derived; `startAnchorId` and `endAnchorId` identify shared
endpoints. Tilt is visual-only rotation about the base, limited to ±90°.

Connecting snaps the chosen endpoint onto a target wall endpoint, sharing its
anchor identity. Moving a wall through PUT moves its shared anchors, hence also
the attached endpoints of neighboring walls. The server rejects moves or
connections that collapse any wall; it does not solve room closure, wall
intersection, perpendicularity or other CAD constraints. Anchor positions are
held in memory and are lost when the server restarts. One service-wide lock
protects validation and updates across connected walls.
