using Hrim.Event.Analytics.Web.Cqrs.Users;
using Hrimsoft.Core.Exceptions;

namespace Hrim.Event.Analytics.Web.Extensions;

public static class ServiceCollectionRegistrations
{
    public static void AddEventAnalyticsServices(this IServiceCollection services, IConfiguration appConfig) {
        services.AddHttpClient<RegisterExternalUserProfileHandler>(WebConsts.CRUD_API,
                                                                   clientConfig => {
                                                                       var apiUrl = appConfig[Envs.EVENT_ANALYTICS_CRUD_API_URL];
                                                                       if (string.IsNullOrWhiteSpace(apiUrl))
                                                                           throw new ConfigurationException(null, Envs.EVENT_ANALYTICS_CRUD_API_URL);
                                                                       clientConfig.BaseAddress = new Uri(apiUrl);
                                                                   });
    }
}