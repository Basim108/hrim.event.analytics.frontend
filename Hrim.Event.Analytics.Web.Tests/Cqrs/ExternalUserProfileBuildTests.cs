using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Hrim.Event.Analytics.Web.Cqrs.Users;
using Hrim.Event.Analytics.Web.Tests.TestData;

namespace Hrim.Event.Analytics.Web.Tests.Cqrs;

[ExcludeFromCodeCoverage]
public class ExternalUserProfileBuildTests
{
    private readonly IList<Claim>                    _claims;
    private readonly ExternalUserProfileBuildHandler _handler      = new();
    private readonly TestUserProfiles                _testProfiles = new();

    public ExternalUserProfileBuildTests() {
        _claims = new List<Claim> {
            new("name", _testProfiles.GoogleUserProfile.FullName!),
            new(ClaimTypes.GivenName, _testProfiles.GoogleUserProfile.FirstName!),
            new(ClaimTypes.Surname, _testProfiles.GoogleUserProfile.LastName!)
        };
    }
    
    [Fact]
    public async Task Given_FullName_Claim_Should_Put_In_Profile() {
        var command = new ExternalUserProfileBuild(_claims);
        var profile = await _handler.Handle(command, CancellationToken.None);
        profile.Should().NotBeNull();
        profile.FullName.Should().Be(_testProfiles.GoogleUserProfile.FullName);
    }

    [Fact]
    public async Task Given_FirstName_Claim_Should_Put_In_Profile() {
        var command = new ExternalUserProfileBuild(_claims);
        var profile = await _handler.Handle(command, CancellationToken.None);
        profile.Should().NotBeNull();
        profile.FirstName.Should().Be(_testProfiles.GoogleUserProfile.FirstName);
    }

    [Fact]
    public async Task Given_LastName_Claim_Should_Put_In_Profile() {
        var command = new ExternalUserProfileBuild(_claims);
        var profile = await _handler.Handle(command, CancellationToken.None);
        profile.Should().NotBeNull();
        profile.LastName.Should().Be(_testProfiles.GoogleUserProfile.LastName);
    }
}