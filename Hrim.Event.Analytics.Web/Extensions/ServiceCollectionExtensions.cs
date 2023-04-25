using Auth0.AspNetCore.Authentication;
using Hrimsoft.Core.Exceptions;
using Microsoft.AspNetCore.CookiePolicy;

namespace Hrim.Event.Analytics.Web.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddEventAnalyticsAuthentication(this IServiceCollection services, IConfiguration appConfig) {
        services.AddAuth0WebAppAuthentication(options => {
            var domain = appConfig["AUTH0_DOMAIN"];
            if (string.IsNullOrWhiteSpace(domain))
                throw new ConfigurationException(null, "AUTH0_DOMAIN");
            var clientId = appConfig["AUTH0_CLIENT_ID"];
            if (string.IsNullOrWhiteSpace(clientId))
                throw new ConfigurationException(null, "AUTH0_CLIENT_ID");
            var clientSecret = appConfig["AUTH0_CLIENT_SECRET"];
            if (string.IsNullOrWhiteSpace(clientSecret))
                throw new ConfigurationException(null, "AUTH0_CLIENT_SECRET");

            options.Domain       = domain;
            options.ClientId     = clientId;
            options.ClientSecret = clientSecret;
            options.CallbackPath = "/account/callback";
            
            options.Scope        = "openid profile crud-api event-analytics-crud-api";
        }).WithAccessToken(options => {
            options.Audience         = "event-analytics-crud-api";
        });
    }

    public static IServiceCollection ConfigureSameSiteNoneCookies(this IServiceCollection services) {
        services.Configure<CookiePolicyOptions>(options => {
            options.MinimumSameSitePolicy = SameSiteMode.Strict;
            options.HttpOnly              = HttpOnlyPolicy.Always;
            
            options.OnAppendCookie        = cookieContext => CheckSameSite(cookieContext.CookieOptions);
            options.OnDeleteCookie        = cookieContext => CheckSameSite(cookieContext.CookieOptions);
        });

        return services;
    }

    private static void CheckSameSite(CookieOptions options) {
        if (options is {
                SameSite: SameSiteMode.None,
                Secure  : false
            }) {
            options.SameSite = SameSiteMode.Unspecified;
        }
    }
}