using System.Collections.Concurrent;
using FurnaView.Api.Models;

namespace FurnaView.Api.Repositories;

public sealed class InMemoryWallRepository : IWallRepository
{
    private readonly ConcurrentDictionary<Guid, Wall> _walls = new();
    public IReadOnlyList<Wall> GetAll() => _walls.Values.ToArray();
    public Wall? Get(Guid id) => _walls.GetValueOrDefault(id);
    public bool Delete(Guid id) => _walls.TryRemove(id, out _);
    public void Add(Wall wall)
    {
        if (!_walls.TryAdd(wall.Id, wall)) throw new InvalidOperationException("Wall ID already exists.");
    }
    public void Update(Wall wall)
    {
        if (!_walls.ContainsKey(wall.Id)) throw new KeyNotFoundException("Wall not found.");
        _walls[wall.Id] = wall;
    }
}
