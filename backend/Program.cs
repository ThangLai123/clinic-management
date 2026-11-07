var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure OpenAPI
builder.Services.AddOpenApi();

// Configure CORS for Frontend React in development
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDevCors", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors("FrontendDevCors");
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
