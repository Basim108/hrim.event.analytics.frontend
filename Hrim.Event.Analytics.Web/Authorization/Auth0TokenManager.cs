using Hrim.Event.Analytics.Web.Exceptions;
using Hrimsoft.Core.Exceptions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.IdentityModel.JsonWebTokens;
using Newtonsoft.Json;

namespace Hrim.Event.Analytics.Web.Authorization;

public class Auth0TokenManager: IAuthorizationTokenManager
{
    private readonly HttpClient           _httpClient;
    private readonly IConfiguration       _appConfig;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public Auth0TokenManager(IHttpClientFactory   httpClientFactory,
                             IConfiguration       appConfig,
                             IHttpContextAccessor httpContextAccessor) {
        _httpClient          = httpClientFactory.CreateClient(WebConsts.AUTH0_API);
        _appConfig           = appConfig;
        _httpContextAccessor = httpContextAccessor;
    }

    /// <inheritdoc />
    public async Task<string> GetAccessTokenAsync(CancellationToken cancellationToken) {
        if (_httpContextAccessor.HttpContext == null)
            throw new HrimsoftException("Method is called out of http context scope");
        var jwt = await _httpContextAccessor.HttpContext.GetTokenAsync(CookieAuthenticationDefaults.AuthenticationScheme, "access_token");
        if (string.IsNullOrWhiteSpace(jwt))
            return string.Empty;

        var token = new JsonWebToken(jwt);
        if (token.ValidTo < DateTime.Now) {
            var refreshToken = await _httpContextAccessor.HttpContext.GetTokenAsync(CookieAuthenticationDefaults.AuthenticationScheme, "refresh_token");
            var clientId     = _appConfig[Envs.AUTH0_CLIENT_ID];
            if (string.IsNullOrWhiteSpace(clientId))
                throw new ConfigurationException(null, Envs.AUTH0_CLIENT_ID);
            var clientSecret = _appConfig[Envs.AUTH0_CLIENT_SECRET];
            if (string.IsNullOrWhiteSpace(clientId))
                throw new ConfigurationException(null, Envs.AUTH0_CLIENT_SECRET);

            var content = new FormUrlEncodedContent(new Dictionary<string, string>() {
                { "grant_type", "refresh_token" },
                { "client_id", clientId }, 
                { "client_secret", clientSecret! },
                { "refresh_token", refreshToken! }
            });
            content.Headers.Clear();
            content.Headers.Add("content-type", "application/x-www-form-urlencoded");

            var response = await _httpClient.PostAsync("/oauth/token", content, cancellationToken);

            response.EnsureSuccessStatusCode();
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            if (string.IsNullOrWhiteSpace(body))
                throw new HrimsoftException("There is no response body in auth0 refresh token response");
            var responseDict = JsonConvert.DeserializeObject<Dictionary<string, string>>(body);
            if (responseDict == null)
                throw new HrimsoftException("There is no access_token in auth0 refresh token response");
            if (!responseDict.ContainsKey("access_token"))
                throw new HrimsoftException("There is no access_token in auth0 refresh token response");
            jwt = responseDict["access_token"];
            if (string.IsNullOrWhiteSpace(jwt))
                throw new HrimsoftException("There is access_token key, but there is no value in auth0 refresh token response");
        }
        return jwt;
    }
}