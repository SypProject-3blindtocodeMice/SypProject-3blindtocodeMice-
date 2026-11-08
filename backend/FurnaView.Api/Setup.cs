using FurnaView.Api.Endpoints;
using FurnaView.Api.Repositories;
using FurnaView.Api.Services;

namespace FurnaView.Api;

public static class Setup
{
    extension(WebApplicationBuilder builder)
    {
        public WebApplicationBuilder RegisterApplicationServices()
        {
            builder.Services.AddProblemDetails();
            builder.Services.AddExceptionHandler<WallExceptionHandler>();
            builder.Services.AddCors(options => options.AddPolicy("Frontend", policy =>
                policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                    .AllowAnyHeader().AllowAnyMethod()));
            builder.Services.AddSingleton<IWallRepository, InMemoryWallRepository>();
            builder.Services.AddSingleton<IWallService, WallService>();
            return builder;
        }
    }

    extension(IEndpointRouteBuilder app)
    {
        public IEndpointRouteBuilder RegisterApiEndpoints()
        {
            app.RegisterWallEndpoints();
            return app;
        }
    }
}
