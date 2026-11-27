using FurnaView.Api.DTOs.Walls;
using FurnaView.Api.Models;
using FurnaView.Api.Repositories;

namespace FurnaView.Api.Services;

public sealed class WallValidationException(string message) : Exception(message);

public sealed class WallService(IWallRepository repository) : IWallService
{
    // A single lock makes connected-anchor moves atomic with validation and DTO snapshots.
    private readonly object _gate = new();
    private const double MinimumLength = 0.000001;
    private const double SnapDistance = 0.2; // metres; keep the drawing preview in sync

    public IReadOnlyList<WallResponse> GetAll()
    {
        lock (_gate) return repository.GetAll().Select(Map).OrderBy(w => w.Id).ToArray();
    }

    public WallResponse? Get(Guid id)
    {
        lock (_gate) return repository.Get(id) is { } wall ? Map(wall) : null;
    }

    public bool Delete(Guid id)
    {
        lock (_gate) return repository.Delete(id);
    }

    public void Clear()
    {
        lock (_gate) repository.Clear();
    }

    public WallResponse Create(CreateWallRequest request) => CreateDraft([request])[0];

    public IReadOnlyList<WallResponse> CreateDraft(IReadOnlyList<CreateWallRequest?> requests)
    {
        if (requests.Count == 0) throw new WallValidationException("A draft requires at least one wall.");
        lock (_gate)
        {
            var existing = Anchors(repository.GetAll());
            var anchors = new Dictionary<FloorPoint, Anchor>();
            Anchor GetAnchor(FloorPoint point)
            {
                if (!anchors.TryGetValue(point, out var anchor))
                    anchors.Add(point, anchor = Snap(point, existing) ?? new Anchor(point.X, point.Z));
                return anchor;
            }

            // Validate the whole draft, including its snapped geometry, before storing any walls.
            var walls = requests.Select(request =>
            {
                if (request is null) throw new WallValidationException("Draft walls cannot be null.");
                Validate(request.Name, request.Start, request.End, request.Height, request.Thickness, request.TiltDegrees);
                var start = GetAnchor(request.Start!);
                var end = GetAnchor(request.End!);
                if (!ValidLength(start.X, start.Z, end.X, end.Z))
                    throw new WallValidationException("Both endpoints snap to the same location. Place one farther away.");
                return new Wall(Guid.NewGuid(), request.Name!.Trim(), start, end,
                    request.Height, request.Thickness, request.TiltDegrees);
            }).ToArray();
            foreach (var wall in walls) repository.Add(wall);
            return walls.Select(Map).ToArray();
        }
    }

    public WallResponse? Update(Guid id, UpdateWallRequest request)
    {
        Validate(request.Name, request.Start, request.End, request.Height, request.Thickness, request.TiltDegrees);
        lock (_gate)
        {
            var wall = repository.Get(id);
            if (wall is null) return null;
            var oldStart = wall.Start;
            var oldEnd = wall.End;
            var walls = repository.GetAll();
            var candidates = Anchors(walls).Where(a => a != oldStart && a != oldEnd).ToArray();
            var start = request.Start!;
            var end = request.End!;
            var snappedStart = start != Point(oldStart) ? Snap(start, candidates) : null;
            var snappedEnd = end != Point(oldEnd) ? Snap(end, candidates) : null;
            FloorPoint Project(Anchor anchor) => anchor == oldStart ? (snappedStart is null ? start : Point(snappedStart))
                : anchor == oldEnd ? (snappedEnd is null ? end : Point(snappedEnd)) : Point(anchor);
            // All walls sharing either anchor must remain nonzero length after this move.
            foreach (var other in walls)
            {
                var a = Project(other.Start);
                var b = Project(other.End);
                if (!ValidLength(a.X, a.Z, b.X, b.Z))
                    throw new WallValidationException("Moving this anchor would collapse a connected wall.");
            }
            if (snappedStart is null) { oldStart.X = start.X; oldStart.Z = start.Z; }
            if (snappedEnd is null) { oldEnd.X = end.X; oldEnd.Z = end.Z; }
            Anchor Replace(Anchor anchor) => anchor == oldStart ? snappedStart ?? anchor
                : anchor == oldEnd ? snappedEnd ?? anchor : anchor;
            foreach (var other in walls)
            {
                var a = Replace(other.Start);
                var b = Replace(other.End);
                if (a == other.Start && b == other.End) continue;
                other.Start = a;
                other.End = b;
                repository.Update(other);
            }
            wall.Name = request.Name!.Trim();
            wall.Height = request.Height;
            wall.Thickness = request.Thickness;
            wall.TiltDegrees = request.TiltDegrees;
            repository.Update(wall);
            return Map(wall);
        }
    }

    public IReadOnlyList<WallResponse>? Connect(Guid id, ConnectWallRequest request)
    {
        if (request.Endpoint is not ("start" or "end") || request.TargetEndpoint is not ("start" or "end"))
            throw new WallValidationException("Endpoint and targetEndpoint must be 'start' or 'end'.");
        lock (_gate)
        {
            var wall = repository.Get(id);
            var target = repository.Get(request.TargetWallId);
            if (wall is null || target is null) return null;
            if (wall.Id == target.Id) throw new WallValidationException("A wall cannot connect to itself.");
            var anchor = request.TargetEndpoint == "start" ? target.Start : target.End;
            var opposite = request.Endpoint == "start" ? wall.End : wall.Start;
            if (anchor == opposite || !ValidLength(anchor.X, anchor.Z, opposite.X, opposite.Z))
                throw new WallValidationException("Connecting these endpoints would collapse the wall.");
            if (request.Endpoint == "start") wall.Start = anchor;
            else wall.End = anchor;
            repository.Update(wall);
            return repository.GetAll().Select(Map).OrderBy(w => w.Id).ToArray();
        }
    }

    private static void Validate(string? name, FloorPoint? start, FloorPoint? end, double height, double thickness, double tilt)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new WallValidationException("Name is required.");
        if (start is null || end is null || !Finite(start.X, start.Z, end.X, end.Z))
            throw new WallValidationException("Start and end must have finite X and Z coordinates.");
        if (!Finite(height, thickness) || height <= 0 || thickness <= 0)
            throw new WallValidationException("Height and thickness must be positive finite numbers.");
        if (!double.IsFinite(tilt) || tilt < -90 || tilt > 90)
            throw new WallValidationException("Tilt must be between -90 and 90 degrees.");
        if (!ValidLength(end.X, end.Z, start.X, start.Z))
            throw new WallValidationException("Wall endpoints must be at least 0.000001 m apart.");
    }

    private static bool Finite(params double[] numbers) => numbers.All(double.IsFinite);
    private static FloorPoint Point(Anchor anchor) => new(anchor.X, anchor.Z);
    private static Anchor[] Anchors(IEnumerable<Wall> walls) =>
        walls.SelectMany(wall => new[] { wall.Start, wall.End }).Distinct().OrderBy(anchor => anchor.Id).ToArray();
    private static Anchor? Snap(FloorPoint point, IEnumerable<Anchor> anchors)
    {
        Anchor? nearest = null;
        var best = SnapDistance;
        foreach (var anchor in anchors)
        {
            var distance = Distance(point.X, point.Z, anchor.X, anchor.Z);
            if (distance <= SnapDistance && (nearest is null || distance < best))
            {
                nearest = anchor;
                best = distance;
            }
        }
        return nearest;
    }
    private static bool ValidLength(double x1, double z1, double x2, double z2) =>
        double.IsFinite(Distance(x1, z1, x2, z2)) && Distance(x1, z1, x2, z2) >= MinimumLength;
    private static double Distance(double x1, double z1, double x2, double z2) =>
        Math.Sqrt(Math.Pow(x2 - x1, 2) + Math.Pow(z2 - z1, 2));
    private static WallResponse Map(Wall wall) => new(wall.Id, wall.Name,
        new(wall.Start.X, wall.Start.Z), new(wall.End.X, wall.End.Z), wall.Height,
        wall.Thickness, wall.TiltDegrees, wall.Start.Id, wall.End.Id, wall.Length);
}
