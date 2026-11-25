using FurnaView.Api.Models;

namespace FurnaView.Api.Repositories;

public interface IWallRepository
{
    IReadOnlyList<Wall> GetAll();
    Wall? Get(Guid id);
    void Add(Wall wall);
    void Update(Wall wall);
    bool Delete(Guid id);
}
