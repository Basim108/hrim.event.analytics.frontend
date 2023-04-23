using Auth0.AspNetCore.Authentication;
using Hrim.Event.Analytics.Web.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hrim.Event.Analytics.Web.Controllers;

/// <summary>
///     Provides control over authentication sessions for event analytics web applications
/// </summary>
[Route("[controller]")]
public class AccountController: Controller
{
    /// <summary> Authenticate with the Facebook </summary>
    [HttpGet("login")]
    public Task LoginAsync(string returnUri = "/") {
        var authenticationProperties = new LoginAuthenticationPropertiesBuilder()
                                      .WithRedirectUri(returnUri)
                                      .Build();
        return HttpContext.ChallengeAsync(Auth0Constants.AuthenticationScheme, authenticationProperties);
    }

    /// <summary> Invoke user logout </summary>
    [HttpGet("logout")]
    [Authorize]
    public async Task LogoutAsync(string returnUri) {
        var authenticationProperties = new LogoutAuthenticationPropertiesBuilder()
                                      .WithRedirectUri(returnUri)
                                      .Build();
        await HttpContext.SignOutAsync(Auth0Constants.AuthenticationScheme, authenticationProperties);
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    }

    /// <summary> Return user profile </summary>
    [HttpGet("profile/me")]
    [Authorize]
    public ViewHrimUser MyProfileAsync()
        => new(User.Identity!.Name!, User.Claims.FirstOrDefault(c => c.Type == "picture")?.Value);
}