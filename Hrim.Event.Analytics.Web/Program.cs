using Hrim.Event.Analytics.Web.Authorization;
using Hrim.Event.Analytics.Web.Cqrs;
using Hrim.Event.Analytics.Web.Extensions;
using MediatR;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.HttpOverrides;
using Serilog;
using Serilog.Formatting.Compact;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddHrimsoftJsonOptions();
builder.Services.AddEventAnalyticsServices(builder.Configuration);
builder.Services.AddHealthChecks();
builder.Services.AddControllersWithViews();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(PrePostHandler<,>));
builder.Services.AddEventAnalyticsAuthentication(builder.Configuration, builder.Environment);
builder.Services.Configure<ForwardedHeadersOptions>(options => {
    options.ForwardedHeaders = ForwardedHeaders.All;
});

builder.Host.UseSerilog((context, services, configuration) => {
    var loggerCfg = configuration.ReadFrom.Configuration(context.Configuration);
    if (context.HostingEnvironment.IsDevelopment()) {
        loggerCfg.MinimumLevel.Verbose();
    }
    else {
        loggerCfg.ReadFrom.Services(services)
                 .Enrich.WithProperty("ThreadId", Environment.CurrentManagedThreadId)
                 .Enrich.WithProperty("AspNetEnvironment", context.HostingEnvironment.EnvironmentName);
    }
    configuration.WriteTo.Console();
    // configuration.WriteTo.Console(new RenderedCompactJsonFormatter());
});
var app = builder.Build();

app.UseForwardedHeaders();

app.UseEventAnalyticsCors(builder.Configuration);
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapHealthChecks("/health",
                    new HealthCheckOptions {
                        AllowCachingResponses = false
                    });
app.MapControllerRoute(name: "default",
                       pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();