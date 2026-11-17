using System.Text.Json;
using FurnaView.Api.DTOs.Building;
using FurnaView.Api.DTOs.Walls;
using FurnaView.Api.Services;
using Xunit;

namespace FurnaView.Api.Tests;

public sealed class BuildingFixtureTests
{
    private const string LivingRoomId = "11111111-2222-3333-4444-555555555555";
    private const string BedroomId = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
    private const string SharedWallId = "12121212-3434-5656-7878-909090909090";
    private const string LivingWestWallId = "13131313-3535-6767-7979-919191919191";

    private static string LoadFixtureJson() =>
        File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Fixtures", "two-room-shared-wall.json"));

    private static BuildingFixtureDto LoadFixture() =>
        JsonSerializer.Deserialize<BuildingFixtureDto>(LoadFixtureJson(), JsonSerializerOptions.Web)
        ?? throw new InvalidOperationException("The two-room fixture did not deserialize into the building fixture DTO.");

    private static BuildingFixtureValidationResult Validate(BuildingFixtureDto fixture) =>
        new BuildingFixtureValidator().Validate(fixture);

    [Fact]
    public void TwoRoomFixtureLoadsAndPassesValidation()
    {
        var fixture = LoadFixture();
        var result = Validate(fixture);
        Assert.True(result.IsValid);
        Assert.Empty(result.Errors);
    }

    [Fact]
    public void FixtureRoundTripKeepsIdsAndRelationships()
    {
        var fixture = LoadFixture();
        var roundTripped = JsonSerializer.Deserialize<BuildingFixtureDto>(
            JsonSerializer.Serialize(fixture, JsonSerializerOptions.Web), JsonSerializerOptions.Web)!;

        Assert.Equal(fixture.Id, roundTripped.Id);
        Assert.Equal(fixture.Name, roundTripped.Name);
        Assert.Equal(fixture.Revision, roundTripped.Revision);

        Assert.Equal(2, roundTripped.Rooms.Count);
        Assert.Equal(7, roundTripped.Walls.Count);
        Assert.Single(roundTripped.Openings);

        var living = roundTripped.Rooms.Single(r => r.Id == new Guid(LivingRoomId));
        var bedroom = roundTripped.Rooms.Single(r => r.Id == new Guid(BedroomId));
        var sharedWall = roundTripped.Walls.Single(w => w.Id == new Guid(SharedWallId));

        Assert.Equal(new Guid(LivingRoomId), living.Id);
        Assert.Equal(new Guid(BedroomId), bedroom.Id);
        Assert.Contains(sharedWall.Id, living.WallIds);
        Assert.Contains(sharedWall.Id, bedroom.WallIds);

        var door = roundTripped.Openings[0];
        Assert.Equal(new Guid(SharedWallId), door.HostWallId);
        Assert.Equal("door", door.Kind);
        Assert.Equal(1.0, door.Offset);
        Assert.Equal(1.0, door.Width);
        Assert.Equal(2.1, door.Height);
        Assert.Equal("closed", door.State);

        Assert.Equal(new FloorPoint(4, 0), sharedWall.Start);
        Assert.Equal(new FloorPoint(4, 5), sharedWall.End);
        Assert.Equal(2.8, sharedWall.Height);
        Assert.Equal(0.15, sharedWall.Thickness);
        Assert.Equal(0, sharedWall.TiltDegrees);
    }

    [Fact]
    public void InvalidFixtureValuesAreRejectedWithClearErrors()
    {
        var fixture = LoadFixture();

        var doorTooTall = fixture with { Openings = new List<BuildingOpeningDto> { fixture.Openings[0] with { Height = 3.0 } } };
        var tallResult = Validate(doorTooTall);
        Assert.False(tallResult.IsValid);
        Assert.Contains(tallResult.Errors, e => e.Contains("exceeds host wall", StringComparison.Ordinal));

        var doorTooWide = fixture with { Openings = new List<BuildingOpeningDto> { fixture.Openings[0] with { Width = 6.0 } } };
        var wideResult = Validate(doorTooWide);
        Assert.False(wideResult.IsValid);
        Assert.Contains(wideResult.Errors, e => e.Contains("exceeds host wall", StringComparison.Ordinal));

        var doorUnknownHost = fixture with { Openings = new List<BuildingOpeningDto> { fixture.Openings[0] with { HostWallId = Guid.NewGuid() } } };
        var hostResult = Validate(doorUnknownHost);
        Assert.False(hostResult.IsValid);
        Assert.Contains(hostResult.Errors, e => e.Contains("unknown host wall", StringComparison.Ordinal));

        var badKind = fixture with { Openings = new List<BuildingOpeningDto> { fixture.Openings[0] with { Kind = "skylight" } } };
        var kindResult = Validate(badKind);
        Assert.False(kindResult.IsValid);
        Assert.Contains(kindResult.Errors, e => e.Contains("unsupported kind", StringComparison.Ordinal));

        var badArea = fixture with { Rooms = new List<BuildingRoomDto> { fixture.Rooms[0] with { Area = -1 } } };
        var areaResult = Validate(badArea);
        Assert.False(areaResult.IsValid);
        Assert.Contains(areaResult.Errors, e => e.Contains("area", StringComparison.Ordinal));

        var zeroLengthWall = fixture with { Walls = new List<BuildingWallDto> { fixture.Walls[0] with { End = fixture.Walls[0].Start } } };
        var wallResult = Validate(zeroLengthWall);
        Assert.False(wallResult.IsValid);
        Assert.Contains(wallResult.Errors, e => e.Contains("at least 0.000001", StringComparison.Ordinal));
    }
}
