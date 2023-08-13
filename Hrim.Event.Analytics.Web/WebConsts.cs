namespace Hrim.Event.Analytics.Web;

public static class WebConsts
{
    public const string AUTH0_API       = "Auth0Api";
    public const string CRUD_API        = "CrudApi";
    public const string COMMAND         = "CqrsCommand={CqrsCommand}";
    public const string START_HANDLING  = "Start handling";
    public const string FINISH_HANDLING = "Finish handling";
}

public static class Envs
{
    public const string EVENT_ANALYTICS_CRUD_API_URL = "EVENT_ANALYTICS_CRUD_API_URL";

    public const string AUTH0_DOMAIN        = "AUTH0_DOMAIN";
    public const string AUTH0_CLIENT_ID     = "AUTH0_CLIENT_ID";
    public const string AUTH0_CLIENT_SECRET = "AUTH0_CLIENT_SECRET";

    public const string ALLOWED_ORIGINS = "ALLOWED_ORIGINS";
}