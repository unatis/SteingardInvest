var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable default files (index.html) and static files
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthorization();

// Map dashboard route
app.MapGet("/dashboard", (IWebHostEnvironment env) => {
    var webRootPath = env.WebRootPath;
    
    if (string.IsNullOrEmpty(webRootPath))
    {
        return Results.NotFound("Web root path not found");
    }
    
    var filePath = Path.Combine(webRootPath, "dashboard.html");
    
    if (!File.Exists(filePath))
    {
        return Results.NotFound($"File not found: {filePath}");
    }
    
    return Results.File(filePath, "text/html");
});

app.MapControllers();

app.Run();
