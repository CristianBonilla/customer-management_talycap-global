# ============================================================
# Stage 1: Build
# ============================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiar archivos de proyecto para restaurar dependencias (caching)
COPY ["src/Core/CustomerManagement.Core.csproj", "src/Core/"]
COPY ["src/Infrastructure/CustomerManagement.Infrastructure.csproj", "src/Infrastructure/"]
COPY ["src/API/CustomerManagement.API.csproj", "src/API/"]

RUN dotnet restore "src/API/CustomerManagement.API.csproj"

# Copiar todo el código fuente
COPY . .

WORKDIR "/src/src/API"
RUN dotnet publish "CustomerManagement.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ============================================================
# Stage 2: Runtime
# ============================================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "CustomerManagement.API.dll"]
