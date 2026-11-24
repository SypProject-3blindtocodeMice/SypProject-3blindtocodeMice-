using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace FurnaView.Api.Tests;

public sealed class WallApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);

    public WallApiTests(WebApplicationFactory<Program> factory) => _client = factory.CreateClient();

    [Fact]
    public async Task CreateGetListAndPutWork()
    {
        var response = await _client.PostAsJsonAsync("/api/walls/", Request("api wall", 0, 0, 4, 0));
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("api wall", created.GetProperty("name").GetString());
        var id = created.GetProperty("id").GetGuid();

        Assert.Equal(HttpStatusCode.OK, (await _client.GetAsync($"/api/walls/{id}")).StatusCode);
        var list = await _client.GetFromJsonAsync<JsonElement[]>("/api/walls/");
        Assert.Contains(list!, item => item.GetProperty("id").GetGuid() == id);

        var update = await _client.PutAsJsonAsync($"/api/walls/{id}", Request("changed", 1, 1, 6, 1));
        Assert.Equal(HttpStatusCode.OK, update.StatusCode);
        Assert.Equal("changed", (await update.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("name").GetString());
    }

    [Fact]
    public async Task ConnectionsReturnWallArrayAndShareAnchorsAcrossMove()
    {
        var first = await Create("first", 0, 0, 4, 0);
        var second = await Create("second", 4, 0, 4, 3);
        var response = await _client.PostAsJsonAsync($"/api/walls/{first}/connections", new { endpoint = "end", targetWallId = second, targetEndpoint = "start" });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var connected = await response.Content.ReadFromJsonAsync<JsonElement[]>();
        Assert.Contains(connected!, w => w.GetProperty("id").GetGuid() == first);
        Assert.Contains(connected!, w => w.GetProperty("id").GetGuid() == second);
        var a = connected!.Single(w => w.GetProperty("id").GetGuid() == first);
        var b = connected!.Single(w => w.GetProperty("id").GetGuid() == second);
        Assert.Equal(a.GetProperty("endAnchorId").GetGuid(), b.GetProperty("startAnchorId").GetGuid());

        var update = await _client.PutAsJsonAsync($"/api/walls/{first}", Request("first", 0, 0, 5, 1));
        Assert.Equal(HttpStatusCode.OK, update.StatusCode);
        var moved = await _client.GetFromJsonAsync<JsonElement>($"/api/walls/{second}");
        Assert.Equal(5, moved.GetProperty("start").GetProperty("x").GetDouble());
        Assert.Equal(1, moved.GetProperty("start").GetProperty("z").GetDouble());
    }

    [Fact]
    public async Task DeletingWallRemovesItFromReadsAndLists()
    {
        var id = await Create("delete me", 0, 0, 4, 0);
        Assert.Equal(HttpStatusCode.NoContent, (await _client.DeleteAsync($"/api/walls/{id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await _client.GetAsync($"/api/walls/{id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await _client.DeleteAsync($"/api/walls/{id}")).StatusCode);
        var list = await _client.GetFromJsonAsync<JsonElement[]>("/api/walls/");
        Assert.DoesNotContain(list!, item => item.GetProperty("id").GetGuid() == id);
    }

    [Fact]
    public async Task DraftSavesAllSegmentsWithSharedAnchorsAndRejectsInvalidDrafts()
    {
        var rejected = await _client.PostAsJsonAsync("/api/walls/draft", new[]
        {
            Request("uncommitted draft wall", 10, 10, 11, 10), Request("collapsed", 10, 10, 10, 10)
        });
        Assert.Equal(HttpStatusCode.BadRequest, rejected.StatusCode);
        var list = await _client.GetFromJsonAsync<JsonElement[]>("/api/walls/");
        Assert.DoesNotContain(list!, item => item.GetProperty("name").GetString() == "uncommitted draft wall");

        var saved = await _client.PostAsJsonAsync("/api/walls/draft", new[]
        {
            Request("base", 10, 10, 14, 10), Request("first side", 10, 10, 10, 13), Request("second side", 14, 10, 14, 13)
        });
        Assert.Equal(HttpStatusCode.OK, saved.StatusCode);
        var walls = (await saved.Content.ReadFromJsonAsync<JsonElement[]>())!;
        Assert.Equal(3, walls.Length);
        Assert.Equal(walls[0].GetProperty("startAnchorId").GetGuid(), walls[1].GetProperty("startAnchorId").GetGuid());
        Assert.Equal(walls[0].GetProperty("endAnchorId").GetGuid(), walls[2].GetProperty("startAnchorId").GetGuid());
        var id = walls[1].GetProperty("id").GetGuid();
        Assert.Equal(HttpStatusCode.OK, (await _client.GetAsync($"/api/walls/{id}")).StatusCode);
    }

    [Fact]
    public async Task MissingResourcesReturn404AndInvalidRequestsReturn400()
    {
        var missing = Guid.NewGuid();
        Assert.Equal(HttpStatusCode.NotFound, (await _client.GetAsync($"/api/walls/{missing}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await _client.PutAsJsonAsync($"/api/walls/{missing}", Request("x", 0, 0, 1, 0))).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await _client.PostAsJsonAsync($"/api/walls/{missing}/connections", new { endpoint = "end", targetWallId = missing, targetEndpoint = "start" })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await _client.PostAsJsonAsync("/api/walls/", Request("bad", 0, 0, 0, 0))).StatusCode);
        var valid = await Create("valid", 0, 0, 2, 0);
        Assert.Equal(HttpStatusCode.BadRequest, (await _client.PostAsJsonAsync($"/api/walls/{valid}/connections", new { endpoint = "north", targetWallId = missing, targetEndpoint = "start" })).StatusCode);
    }

    private async Task<Guid> Create(string name, double sx, double sz, double ex, double ez)
    {
        var response = await _client.PostAsJsonAsync("/api/walls/", Request(name, sx, sz, ex, ez));
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("id").GetGuid();
    }

    private static object Request(string name, double sx, double sz, double ex, double ez) => new
    {
        name, start = new { x = sx, z = sz }, end = new { x = ex, z = ez }, height = 3, thickness = .2, tiltDegrees = 0
    };
}
