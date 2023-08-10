using Hrimsoft.Core.Exceptions;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace Hrim.Event.Analytics.Web.Authorization;

public static class AuthServiceRegistrations
{
    public static void AddEventAnalyticsAuthentication(this IServiceCollection services, IConfiguration appConfig, IHostEnvironment env) {
        services.AddAuthentication(options => {
                     options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                     options.DefaultSignInScheme       = CookieAuthenticationDefaults.AuthenticationScheme;
                     options.DefaultChallengeScheme    = CookieAuthenticationDefaults.AuthenticationScheme;
                 })
                .AddCookie(options => {
                     options.Cookie.Name = "EventAnalytics";
                 })
                .AddOpenIdConnect("Auth0",
                                  options => {
                                      var domain = appConfig[Envs.AUTH0_DOMAIN];
                                      if (string.IsNullOrWhiteSpace(domain))
                                          throw new ConfigurationException(null, Envs.AUTH0_DOMAIN);

                                      var clientId = appConfig[Envs.AUTH0_CLIENT_ID];
                                      if (string.IsNullOrWhiteSpace(clientId))
                                          throw new ConfigurationException(null, Envs.AUTH0_CLIENT_ID);

                                      var clientSecret = appConfig[Envs.AUTH0_CLIENT_SECRET];
                                      if (string.IsNullOrWhiteSpace(clientSecret))
                                          throw new ConfigurationException(null, Envs.AUTH0_CLIENT_SECRET);

                                      options.Authority    = $"https://{domain}";
                                      options.ClientId     = clientId;
                                      options.ClientSecret = clientSecret;
                                      options.CallbackPath = env.IsDevelopment()
                                                                 ? "/account/callback"
                                                                 : "/callback";
                                      options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.Always;
                                      options.NonceCookie.SecurePolicy       = CookieSecurePolicy.Always;
                                      options.SaveTokens                     = true;
                                      options.ResponseType                   = OpenIdConnectResponseType.Code;
                                      options.Scope.Clear();
                                      options.Scope.Add("openid");
                                      options.Scope.Add("profile");
                                      options.Scope.Add("offline_access");
                                      options.TokenValidationParameters = new TokenValidationParameters {
                                          NameClaimType = "name"
                                      };
                                      options.Events = new OpenIdConnectEvents {
                                          OnRedirectToIdentityProviderForSignOut = context => {
                                              var logoutUri     = $"https://{domain}/v2/logout?client_id={clientId}";
                                              var postLogoutUri = context.Properties.RedirectUri;
                                              if (!string.IsNullOrEmpty(postLogoutUri)) {
                                                  if (postLogoutUri.StartsWith("/")) {
                                                      // transform to absolute
                                                      var request = context.Request;
                                                      postLogoutUri = request.Scheme + "://" + request.Host + request.PathBase + postLogoutUri;
                                                  }
                                                  logoutUri += $"&returnTo={Uri.EscapeDataString(postLogoutUri)}";
                                              }
                                              context.Response.Redirect(logoutUri);
                                              context.HandleResponse();

                                              return Task.CompletedTask;
                                          },
                                          OnRedirectToIdentityProvider = context =>
                                          {
                                              context.ProtocolMessage.SetParameter("audience", "event-analytics-crud-api");
                                              return Task.FromResult(0);
                                          }
                                      };
                                  });
    }
}