using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;
using Hrim.Event.Analytics.Web.Models;
using Hrimsoft.Core.Extensions;
using MediatR;

namespace Hrim.Event.Analytics.Web.Cqrs.Users;

/// <summary>
///     Maps user claim to an external user profile instance
/// </summary>
/// <param name="Claims">User claims from the authorization context</param>
public record ExternalUserProfileBuild(IEnumerable<Claim> Claims): IRequest<ExternalUserProfile>;

[SuppressMessage("Usage", "CA2208:Instantiate argument exceptions correctly")]
public class ExternalUserProfileBuildHandler: IRequestHandler<ExternalUserProfileBuild, ExternalUserProfile>
{
    public Task<ExternalUserProfile> Handle(ExternalUserProfileBuild request, CancellationToken cancellationToken) {
        if (request == null)
            throw new ArgumentNullException(nameof(request));
        if (request.Claims.IsNullOrEmpty())
            throw new ArgumentNullException($"{nameof(request)}.{nameof(request.Claims)}");
        var profile = new ExternalUserProfile();
        foreach (var claim in request.Claims) {
            var value = claim.Value;
            switch (claim.Type) {
                case "name":
                    profile.FullName = value.Trim();
                    break;
                case ClaimTypes.GivenName:
                    profile.FirstName = value.Trim();
                    break;
                case ClaimTypes.Surname:
                    profile.LastName = value.Trim();
                    break;
            }
        }
        return Task.FromResult(profile);
    }
}