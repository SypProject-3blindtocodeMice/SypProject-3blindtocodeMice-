using FurnaView.Api.DTOs.Walls;
using FurnaView.Api.Services;

namespace FurnaView.Api.Endpoints;

public static class WallEndpoints
{
    extension(IEndpointRouteBuilder app)
    {
        public IEndpointRouteBuilder RegisterWallEndpoints()
        {
            var group = app.MapGroup("/api/walls");
            group.MapGet("/", (IWallService service) => Results.Ok(service.GetAll()));
            group.MapGet("/{id:guid}", (Guid id, IWallService service) =>
                service.Get(id) is { } wall ? Results.Ok(wall) : Results.NotFound());
            group.MapPost("/", (CreateWallRequest request, IWallService service) =>
            {
                var wall = service.Create(request);
                return Results.Created($"/api/walls/{wall.Id}", wall);
            });
            group.MapPut("/{id:guid}", (Guid id, UpdateWallRequest request, IWallService service) =>
                service.Update(id, request) is { } wall ? Results.Ok(wall) : Results.NotFound());
            group.MapDelete("/{id:guid}", (Guid id, IWallService service) =>
                service.Delete(id) ? Results.NoContent() : Results.NotFound());
            group.MapPost("/{id:guid}/connections", (Guid id, ConnectWallRequest request, IWallService service) =>
                service.Connect(id, request) is { } walls ? Results.Ok(walls) : Results.NotFound());
            return app;
        }
    }
}
