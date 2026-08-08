using CustomerManagement.Core.Application.UseCases;
using CustomerManagement.Infrastructure;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// ── Controllers ──────────────────────────────────────────────────────────────
builder.Services.AddControllers();

// ── Use Cases (Application Layer) ────────────────────────────────────────────
builder.Services.AddScoped<ObtenerClienteUseCase>();

// ── Infrastructure (DbContext + Repository) ───────────────────────────────────
builder.Services.AddInfrastructure(builder.Configuration);

// ── CORS ─────────────────────────────────────────────────────────────────────
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? ["http://localhost:4200"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ── Swagger / OpenAPI ─────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "Customer Management API",
        Version = "v1",
        Description = "API REST para la gestión y consulta de clientes. Prueba Técnica Fullstack – TalyCap Global."
    });

    // Incluye XML comments para documentación enriquecida
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
        options.IncludeXmlComments(xmlPath);
});

// ─────────────────────────────────────────────────────────────────────────────
var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Customer Management API v1");
    c.RoutePrefix = string.Empty; // Swagger accesible en la raíz "/"
});

app.UseCors("FrontendPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run();
