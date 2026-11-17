using FurnaView.Api.DTOs.Walls;

namespace FurnaView.Api.Services;

public interface IWallService
{
    IReadOnlyList<WallResponse> GetAll();
    WallResponse? Get(Guid id);
    WallResponse Create(CreateWallRequest request);
    WallResponse? Update(Guid id, UpdateWallRequest request);
    IReadOnlyList<WallResponse>? Connect(Guid id, ConnectWallRequest request);
}
