namespace FurnaView.Api.DTOs.Walls;

public sealed record FloorPoint(double X, double Z);
public sealed record CreateWallRequest(string? Name, FloorPoint? Start, FloorPoint? End,
    double Height, double Thickness, double TiltDegrees = 0);
public sealed record UpdateWallRequest(string? Name, FloorPoint? Start, FloorPoint? End,
    double Height, double Thickness, double TiltDegrees = 0);
public sealed record ConnectWallRequest(string? Endpoint, Guid TargetWallId, string? TargetEndpoint);
public sealed record WallResponse(Guid Id, string Name, FloorPoint Start, FloorPoint End,
    double Height, double Thickness, double TiltDegrees, Guid StartAnchorId, Guid EndAnchorId, double Length);
