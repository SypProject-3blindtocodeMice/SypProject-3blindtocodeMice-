using FurnaView.Api.DTOs.Walls;

namespace FurnaView.Api.Services;

public interface IWallService
{
    IReadOnlyList<WallResponse> GetAll();
    WallResponse? Get(Guid id);
    WallResponse Create(CreateWallRequest request);
    IReadOnlyList<WallResponse> CreateDraft(IReadOnlyList<CreateWallRequest?> requests);
    WallResponse? Update(Guid id, UpdateWallRequest request);
    bool Delete(Guid id);
    IReadOnlyList<WallResponse>? Connect(Guid id, ConnectWallRequest request);
}
