using Hrimsoft.Core.Exceptions;

#pragma warning disable CS1591
namespace Hrim.Event.Analytics.Web.Extensions;

public static class WebApplicationExtensions
{
    /// <summary> Setups CORS </summary>
    public static void UseEventAnalyticsCors(this WebApplication app, IConfiguration appConfig) {
        var allowedOrigins = appConfig[Envs.ALLOWED_ORIGINS];
        if (string.IsNullOrEmpty(allowedOrigins))
            throw new ConfigurationException(null, Envs.ALLOWED_ORIGINS);
        var origins = allowedOrigins.Split(";", StringSplitOptions.RemoveEmptyEntries);
        app.UseCors(x => x.WithOrigins(origins)
                          .AllowAnyMethod()
                          .AllowCredentials()
                          .AllowAnyHeader());
    }
}