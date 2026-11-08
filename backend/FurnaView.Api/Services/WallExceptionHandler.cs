using Microsoft.AspNetCore.Diagnostics;

namespace FurnaView.Api.Services;

public sealed class WallExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not WallValidationException) return false;
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        await Results.Problem(statusCode: 400, title: "Invalid wall", detail: exception.Message)
            .ExecuteAsync(context);
        return true;
    }
}
