using Hrimsoft.Core.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Hrim.Event.Analytics.Web.Controllers;

/// <summary>
///     Provides control over authentication sessions for event analytics web applications
/// </summary>
[Route("[controller]")]
public class BackendController: Controller
{
    private readonly IConfiguration _appConfig;

    public BackendController(IConfiguration appConfig) { _appConfig = appConfig; }
    
    /// <summary> Returns CRUD API url </summary>
    [HttpGet("crud")]
    public string CrudAsync() {
        var apiUrl = _appConfig[Envs.EVENT_ANALYTICS_CRUD_API_URL];
        if (string.IsNullOrWhiteSpace(apiUrl))
            throw new ConfigurationException(null, Envs.EVENT_ANALYTICS_CRUD_API_URL);
        return JsonConvert.SerializeObject(apiUrl);
    }
}