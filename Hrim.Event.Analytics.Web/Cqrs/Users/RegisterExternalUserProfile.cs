using System.Net.Http.Headers;
using Hrim.Event.Analytics.Web.Models;
using MediatR;

namespace Hrim.Event.Analytics.Web.Cqrs.Users;

public record RegisterExternalUserProfile(ExternalUserProfile Profile, string JwtAccessToken): IRequest;

public class RegisterExternalUserProfileHandler: IRequestHandler<RegisterExternalUserProfile>
{
    private readonly IHttpClientFactory _httpClientFactory;

    public RegisterExternalUserProfileHandler(IHttpClientFactory httpClientFactory) { _httpClientFactory = httpClientFactory; }

    public Task Handle(RegisterExternalUserProfile request, CancellationToken cancellationToken) {
        if (request.Profile == null)
            throw new ArgumentNullException(nameof(request), nameof(request.Profile));
        if (string.IsNullOrWhiteSpace(request.JwtAccessToken))
            throw new ArgumentNullException(nameof(request), nameof(request.JwtAccessToken));

        return HandleAsync(request, cancellationToken);
    }

    private async Task HandleAsync(RegisterExternalUserProfile request, CancellationToken cancellationToken) {
        var httpClient = _httpClientFactory.CreateClient(WebConsts.CRUD_API);
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", request.JwtAccessToken);
        var response = await httpClient.PostAsJsonAsync("/v1/user-profile/me", request.Profile, cancellationToken);
        response.EnsureSuccessStatusCode();
        await response.Content.ReadAsStringAsync(cancellationToken);
    }
}