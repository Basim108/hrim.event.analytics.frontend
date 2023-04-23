using Hrim.Event.Analytics.Web.Extensions;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
       .AddHrimsoftJsonOptions();
builder.Services.AddHealthChecks();
builder.Services.AddControllersWithViews();
builder.Services.AddEventAnalyticsAuthentication(builder.Configuration);
builder.Services.ConfigureSameSiteNoneCookies();

var app = builder.Build();

if (!app.Environment.IsDevelopment()) {
    app.UseHsts();
}

app.UseEventAnalyticsCors(builder.Configuration);
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapHealthChecks("/health", new HealthCheckOptions
{
    AllowCachingResponses = false
});
app.MapControllerRoute(name: "default",
                       pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();