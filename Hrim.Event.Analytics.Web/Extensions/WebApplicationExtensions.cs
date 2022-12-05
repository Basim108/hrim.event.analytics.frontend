#pragma warning disable CS1591
namespace Hrim.Event.Analytics.Web.Extensions;

public static class WebApplicationExtensions {
    /// <summary> Setups CORS </summary>
    public static void UseEventAnalyticsCors(this WebApplication app, IConfiguration appConfig) {
        var allowedOrigins = appConfig["AllowedOrigins"];
        if (!string.IsNullOrEmpty(allowedOrigins)) {
            var origins = allowedOrigins.Split(";", StringSplitOptions.RemoveEmptyEntries);
            app.UseCors(x => x.WithOrigins(origins)
                              .WithMethods("POST", "GET")
                               // .AllowAnyMethod()
                              .AllowCredentials()
                              .AllowAnyHeader());
        }
    }
}