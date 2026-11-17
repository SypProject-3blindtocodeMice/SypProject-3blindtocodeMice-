using FurnaView.Api;

var builder = WebApplication.CreateBuilder(args);
builder.RegisterApplicationServices();

var app = builder.Build();
app.UseExceptionHandler();
app.UseCors("Frontend");
app.RegisterApiEndpoints();
app.Run();

public partial class Program { }
