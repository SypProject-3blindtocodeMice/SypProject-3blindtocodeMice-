using FurnaView.Api.DTOs.Building;
using FurnaView.Api.DTOs.Walls;

namespace FurnaView.Api.Services;

public sealed record BuildingFixtureValidationResult(bool IsValid, IReadOnlyList<string> Errors, IReadOnlyList<string> Warnings);

public sealed class BuildingFixtureValidator
{
    public const double MinimumLength = 0.000001;
    private const double ConsistencyTolerance = 0.000001;

    public BuildingFixtureValidationResult Validate(BuildingFixtureDto? fixture)
    {
        var errors = new List<string>();
        if (fixture is null)
        {
            errors.Add("Building fixture must not be null.");
            return Invalid(errors);
        }
        if (fixture.Id == Guid.Empty) errors.Add("Building fixture id must not be empty.");
        if (fixture.Revision < 1) errors.Add($"Building fixture revision must be at least 1 (found {fixture.Revision}).");
        if (string.IsNullOrWhiteSpace(fixture.Name)) errors.Add("Building fixture name is required.");

        var rooms = fixture.Rooms ?? new List<BuildingRoomDto>();
        var walls = fixture.Walls ?? new List<BuildingWallDto>();
        var openings = fixture.Openings ?? new List<BuildingOpeningDto>();
        if (rooms.Count < 1) errors.Add("Building fixture must contain at least one room.");
        var wallIds = new HashSet<Guid>(walls.Select(w => w.Id));

        foreach (var room in rooms)
        {
            if (room.Id == Guid.Empty) errors.Add("Building room id must not be empty.");
            if (string.IsNullOrWhiteSpace(room.Name)) errors.Add($"Building room '{room.Id}' name is required.");
            if (room.Height <= 0) errors.Add($"Building room '{room.Id}' height must be positive.");
            if (room.Area <= 0) errors.Add($"Building room '{room.Id}' area must be positive.");
            if (room.Volume <= 0) errors.Add($"Building room '{room.Id}' volume must be positive.");
            if (room.Height > 0 && room.Area > 0 && Math.Abs(room.Volume - room.Area * room.Height) > ConsistencyTolerance)
                errors.Add($"Building room '{room.Id}' volume {room.Volume} is inconsistent with area {room.Area} and height {room.Height}.");
            foreach (var wallId in room.WallIds)
                if (!wallIds.Contains(wallId)) errors.Add($"Building room '{room.Id}' references unknown wall '{wallId}'.");
        }

        foreach (var wall in walls)
        {
            if (wall.Id == Guid.Empty) { errors.Add("Building wall id must not be empty."); continue; }
            if (string.IsNullOrWhiteSpace(wall.Name)) errors.Add($"Building wall '{wall.Id}' name is required.");
            if (!Finite(wall.Start.X, wall.Start.Z, wall.End.X, wall.End.Z))
                errors.Add($"Building wall '{wall.Name}' start and end must have finite X and Z coordinates.");
            else if (Distance(wall.Start.X, wall.Start.Z, wall.End.X, wall.End.Z) < MinimumLength)
                errors.Add($"Building wall '{wall.Name}' endpoints must be at least 0.000001 m apart.");
            if (!Finite(wall.Height, wall.Thickness) || wall.Height <= 0 || wall.Thickness <= 0)
                errors.Add($"Building wall '{wall.Name}' height and thickness must be positive finite numbers.");
            if (wall.TiltDegrees < -90 || wall.TiltDegrees > 90)
                errors.Add($"Building wall '{wall.Name}' tilt must be between -90 and 90 degrees.");
        }

        foreach (var opening in openings)
        {
            if (opening.Id == Guid.Empty) { errors.Add("Building opening id must not be empty."); continue; }
            if (opening.Kind is not ("door" or "window")) errors.Add($"Building opening '{opening.Id}' has unsupported kind '{opening.Kind}'.");
            var host = walls.FirstOrDefault(w => w.Id == opening.HostWallId);
            if (host is null)
            {
                errors.Add($"Building opening '{opening.Id}' references unknown host wall '{opening.HostWallId}'.");
                continue;
            }
            if (opening.Width <= 0) errors.Add($"Building opening '{opening.Id}' width must be positive.");
            if (opening.Height <= 0) errors.Add($"Building opening '{opening.Id}' height must be positive.");
            if (opening.Offset < 0) errors.Add($"Building opening '{opening.Id}' offset must not be negative.");
            var hostLength = Distance(host.Start.X, host.Start.Z, host.End.X, host.End.Z);
            if (opening.Width > hostLength)
                errors.Add($"Building opening '{opening.Id}' width {opening.Width} exceeds host wall '{host.Name}' length {hostLength}.");
            if (opening.Height > host.Height)
                errors.Add($"Building opening '{opening.Id}' height {opening.Height} exceeds host wall '{host.Name}' height {host.Height}.");
        }

        return new BuildingFixtureValidationResult(errors.Count == 0, errors, new List<string>());
    }

    private static BuildingFixtureValidationResult Invalid(List<string> errors) => new(false, errors, new List<string>());

    private static bool Finite(params double[] numbers) => numbers.All(double.IsFinite);
    private static double Distance(double x1, double z1, double x2, double z2) =>
        Math.Sqrt(Math.Pow(x2 - x1, 2) + Math.Pow(z2 - z1, 2));
}
