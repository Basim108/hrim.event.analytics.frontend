namespace Hrim.Event.Analytics.Web.Authorization;

public interface IAuthorizationTokenManager
{
    /// <summary>
    /// takes access token from cookie if expired will prolong it with a refresh token
    /// </summary>
    /// <returns>Base64 Encoded JWT access token</returns>
    Task<string> GetAccessTokenAsync(CancellationToken cancellationToken);
}