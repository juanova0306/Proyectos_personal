using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using TaskyApi.Models;
using TaskyApi.Service.Area;
using TaskyApi.Service.Auth;
using TaskyApi.Service.Email;
using TaskyApi.Service.Rol;
using TaskyApi.Service.Roles;
using TaskyApi.Service.Tareas;
using TaskyApi.Service.Usuario;


var builder = WebApplication.CreateBuilder(args);

//--------------------------------------------------------
// CORS
//--------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
       policy =>
       {
           policy
           .WithOrigins("http://localhost:5173")
           .AllowAnyHeader()
           .AllowAnyMethod();
       });
});

// -------------------------------------------------------
// DB CONTEXT
// -------------------------------------------------------
builder.Services.AddDbContext<TaskyContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("connectionDB")));

// -------------------------------------------------------
// Controllers
// -------------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IRolService, RolService>();
builder.Services.AddScoped<IAreaService, AreaService>();

// -------------------------------------------------------
//  SWAGGER (Solo Swashbuckle)
// -------------------------------------------------------
builder.Services.AddEndpointsApiExplorer();   // Necesario para Swashbuckle
builder.Services.AddSwaggerGen(c =>
{
    // Documentación básica
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Tasky API",
        Version = "v1"
    });

    //  JWT auth en Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Autenticación JWT usando Bearer.\n\nEjemplo: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// -------------------------------------------------------
// Servicios personalizados
// -------------------------------------------------------
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<ITareasService, TareasService>();

// -------------------------------------------------------
// JWT Authentication
// -------------------------------------------------------
var key = builder.Configuration["Jwt:Key"];
var issuer = builder.Configuration["Jwt:Issuer"];
var audience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(key)
            )
        };
    });

builder.Services.AddAuthorization();

// -------------------------------------------------------
// APP
// -------------------------------------------------------
var app = builder.Build();

// Swagger siempre disponible
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Tasky API V1");
});
//Cors
app.UseCors("AllowReact");
// Middleware
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
