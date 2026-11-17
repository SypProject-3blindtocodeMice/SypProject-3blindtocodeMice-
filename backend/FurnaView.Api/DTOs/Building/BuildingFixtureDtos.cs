using FurnaView.Api.DTOs.Walls;

namespace FurnaView.Api.DTOs.Building;

public sealed record BuildingFixtureDto(Guid Id, string Name, int Revision,
    IReadOnlyList<BuildingRoomDto> Rooms, IReadOnlyList<BuildingWallDto> Walls, IReadOnlyList<BuildingOpeningDto> Openings);

public sealed record BuildingRoomDto(Guid Id, string Name, double Height, double Area, double Volume, IReadOnlyList<Guid> WallIds);

public sealed record BuildingWallDto(Guid Id, string Name, FloorPoint Start, FloorPoint End, double Height, double Thickness, double TiltDegrees);

public sealed record BuildingOpeningDto(Guid Id, string Kind, Guid HostWallId, double Offset, double Width, double Height, string State);
