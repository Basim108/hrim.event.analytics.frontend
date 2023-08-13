#pragma warning disable CS1591
namespace Hrim.Event.Analytics.Web.Exceptions;

/// <summary> user exception </summary>
[Serializable]
public class HrimsoftException: Exception
{
    public HrimsoftException(string message):base(message) { }
    public HrimsoftException(string message, Exception innerException):base(message, innerException) { }
}