using FurnaView.Api.DTOs.Walls;
using FurnaView.Api.Models;
using FurnaView.Api.Repositories;
using FurnaView.Api.Services;
using Xunit;

namespace FurnaView.Api.Tests;

public sealed class WallServiceTests
{
    private static readonly CreateWallRequest Valid = new(" Wall ", new(0, 0), new(4, 0), 3, .2);

    [Fact]
    public void CreateAndGetReturnTrimmedWallAndLength()
    {
        var service = new WallService(new InMemoryWallRepository());
        var created = service.Create(Valid);
        Assert.Equal("Wall", created.Name);
        Assert.Equal(4, created.Length);
        Assert.Equal(created, service.Get(created.Id));
        Assert.Single(service.GetAll());
    }

    [Fact]
    public void InvalidGeometryIsRejected()
    {
        var service = new WallService(new InMemoryWallRepository());
        Assert.Throws<WallValidationException>(() => service.Create(Valid with { End = new(0, 0) }));
        Assert.Throws<WallValidationException>(() => service.Create(Valid with { Height = double.NaN }));
        Assert.Throws<WallValidationException>(() => service.Create(Valid with { Thickness = 0 }));
        Assert.Throws<WallValidationException>(() => service.Create(Valid with { Start = new(double.PositiveInfinity, 0) }));
        Assert.Throws<WallValidationException>(() => service.Create(Valid with { End = new(double.MaxValue, 0), Start = new(-double.MaxValue, 0) }));
        Assert.Throws<WallValidationException>(() => service.Create(Valid with { Name = " " }));
    }

    [Fact]
    public void ConnectedAnchorsAreSharedAndMoveTogether()
    {
        var service = new WallService(new InMemoryWallRepository());
        var first = service.Create(Valid);
        var second = service.Create(new("second", new(4, 0), new(4, 3), 3, .2));
        var connected = service.Connect(first.Id, new("end", second.Id, "start"))!;
        var a = connected.Single(w => w.Id == first.Id);
        var b = connected.Single(w => w.Id == second.Id);
        Assert.Equal(a.EndAnchorId, b.StartAnchorId);

        var moved = service.Update(first.Id, new("first", new(0, 0), new(5, 1), 3, .2))!;
        Assert.Equal(moved.EndAnchorId, service.Get(second.Id)!.StartAnchorId);
        Assert.Equal(new FloorPoint(5, 1), service.Get(second.Id)!.Start);
    }

    [Fact]
    public void MoveThatCollapsesConnectedWallIsRejectedAtomically()
    {
        var service = new WallService(new InMemoryWallRepository());
        var first = service.Create(Valid);
        var second = service.Create(new("second", new(4, 0), new(4, 3), 3, .2));
        service.Connect(first.Id, new("end", second.Id, "start"));
        Assert.Throws<WallValidationException>(() => service.Update(first.Id,
            new("first", new(0, 0), new(4, 3), 3, .2)));
        Assert.Equal(new FloorPoint(4, 0), service.Get(first.Id)!.End);
        Assert.Equal(new FloorPoint(4, 0), service.Get(second.Id)!.Start);
    }

    [Fact]
    public void InvalidConnectionsCannotChangeExistingWall()
    {
        var service = new WallService(new InMemoryWallRepository());
        var wall = service.Create(Valid);
        var target = service.Create(new("target", new(2, 2), new(4, 2), 3, .2));
        Assert.Throws<WallValidationException>(() => service.Connect(wall.Id, new("start", target.Id, "wrong")));
        Assert.Throws<WallValidationException>(() => service.Connect(wall.Id, new("start", wall.Id, "end")));
        Assert.Equal(wall.StartAnchorId, service.Get(wall.Id)!.StartAnchorId);
    }

    [Fact]
    public async Task ConcurrentCreatesAreRetained()
    {
        var service = new WallService(new InMemoryWallRepository());
        await Task.WhenAll(Enumerable.Range(0, 32).Select(i => Task.Run(() =>
            service.Create(Valid with { Name = $"wall-{i}" }))));
        Assert.Equal(32, service.GetAll().Count);
    }

    [Fact]
    public void RepositoryAddsGetsListsAndUpdates()
    {
        var repository = new InMemoryWallRepository();
        var wall = new Wall(Guid.NewGuid(), "wall", new(0, 0), new(1, 0), 3, .2, 0);
        repository.Add(wall);
        Assert.Same(wall, repository.Get(wall.Id));
        Assert.Contains(wall, repository.GetAll());
        wall.Name = "updated";
        repository.Update(wall);
        Assert.Equal("updated", repository.Get(wall.Id)!.Name);
        Assert.Throws<KeyNotFoundException>(() => repository.Update(new Wall(Guid.NewGuid(), "x", new(0,0), new(1,0), 3,.2,0)));
    }
}
