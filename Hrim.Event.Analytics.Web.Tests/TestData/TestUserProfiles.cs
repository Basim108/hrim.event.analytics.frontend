using Hrim.Event.Analytics.Web.Models;

namespace Hrim.Event.Analytics.Web.Tests.TestData;

public class TestUserProfiles
{
    private ExternalUserProfile? _googleUserProfile;

    public ExternalUserProfile GoogleUserProfile => _googleUserProfile ??= new ExternalUserProfile() {
        FirstName = "Alan",
        LastName  = "Turing",
        FullName  = "Alan Turing (IT)"
    };
}