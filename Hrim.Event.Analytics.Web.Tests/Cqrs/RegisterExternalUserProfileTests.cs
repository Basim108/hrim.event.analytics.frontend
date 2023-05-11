using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Hrim.Event.Analytics.Web.Cqrs.Users;
using Hrim.Event.Analytics.Web.Tests.TestData;
using Moq;
using Moq.Protected;

namespace Hrim.Event.Analytics.Web.Tests.Cqrs;

public class RegisterExternalUserProfileTests
{
    private readonly RegisterExternalUserProfileHandler _handler;
    private readonly HttpClient                         _httpClient;
    private readonly Mock<HttpMessageHandler>           _mockHttpMsgHandler = new();
    private readonly TestUserProfiles                   _testProfiles       = new();

    public RegisterExternalUserProfileTests() {
        var mockFactory = new Mock<IHttpClientFactory>();
        _httpClient             = new HttpClient(_mockHttpMsgHandler.Object);
        _httpClient.BaseAddress = new Uri("https://tests.com");
        mockFactory.Setup(_ => _.CreateClient(It.Is<string>(name => name == WebConsts.CRUD_API))).Returns(_httpClient);
        _handler = new RegisterExternalUserProfileHandler(mockFactory.Object);
    }

    [Fact]
    public async Task Should_Set_Authorization_Header() {
        _mockHttpMsgHandler.Protected()
                           .Setup<Task<HttpResponseMessage>>("SendAsync",
                                                             ItExpr.IsAny<HttpRequestMessage>(),
                                                             ItExpr.IsAny<CancellationToken>())
                           .ReturnsAsync(new HttpResponseMessage {
                                StatusCode = HttpStatusCode.OK,
                                Content    = new StringContent("123"),
                            });
        await _handler.Handle(new RegisterExternalUserProfile(_testProfiles.GoogleUserProfile, "access_token"), CancellationToken.None);
        _httpClient.DefaultRequestHeaders.Authorization.Should().NotBeNull();
        _httpClient.DefaultRequestHeaders.Authorization!.Scheme.Should().Be("Bearer");
        _httpClient.DefaultRequestHeaders.Authorization.Parameter.Should().Be("access_token");
    }

    [Fact]
    public async Task Given_Null_Profile_Should_Throw_ArgumentNullException() {
        var query = new RegisterExternalUserProfile(null!, "access_token");
        var ex    = await Assert.ThrowsAsync<ArgumentNullException>(() => _handler.Handle(query, CancellationToken.None));
        ex.ParamName.Should().Be("request");
        ex.Message.StartsWith(nameof(RegisterExternalUserProfile.Profile)).Should().BeTrue();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task Given_No_AccessToken_Should_Throw_ArgumentNullException(string? jwt) {
        var query = new RegisterExternalUserProfile(_testProfiles.GoogleUserProfile, jwt!);
        var ex    = await Assert.ThrowsAsync<ArgumentNullException>(() => _handler.Handle(query, CancellationToken.None));
        ex.ParamName.Should().Be("request");
        ex.Message.StartsWith(nameof(RegisterExternalUserProfile.JwtAccessToken)).Should().BeTrue();
    }
}