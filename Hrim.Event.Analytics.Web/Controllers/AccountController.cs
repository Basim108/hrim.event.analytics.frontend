using Auth0.AspNetCore.Authentication;
using Hrim.Event.Analytics.Web.Authorization;
using Hrim.Event.Analytics.Web.Cqrs.Users;
using Hrim.Event.Analytics.Web.Models;
using MediatR;
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
    private readonly IMediator                  _mediator;
    private readonly IAuthorizationTokenManager _authTokenManager;

    public AccountController(IMediator                  mediator,
                             IAuthorizationTokenManager authTokenManager) {
        _mediator         = mediator;
        _authTokenManager = authTokenManager;
    }

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
        => new(User.Identity!.Name, User.Claims.FirstOrDefault(c => c.Type == "picture")?.Value);

    /// <summary> Invoke user logout </summary>
    [HttpGet("token")]
    [Authorize]
    public async Task<IActionResult> GetTokenAsync(CancellationToken cancellationToken) {
        var jwt = await _authTokenManager.GetAccessTokenAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(jwt)) {
            return Unauthorized("cannot get access token");
        }
        var userProfile = await _mediator.Send(new ExternalUserProfileBuild(User.Claims), cancellationToken);

        await _mediator.Send(new RegisterExternalUserProfile(userProfile, jwt), cancellationToken);
        // OPTIMIZATION: put email into memory cache in order to optimize registration calls
        return new JsonResult(jwt);
    }
}