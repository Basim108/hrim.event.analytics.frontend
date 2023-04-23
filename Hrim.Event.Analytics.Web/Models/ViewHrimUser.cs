namespace Hrim.Event.Analytics.Web.Models;

/// <summary> User information for UI </summary>
/// <param name="FullName">User full name</param>
/// <param name="PictureUri">a uri of the user's avatar</param>
public record ViewHrimUser(string FullName, string PictureUri);