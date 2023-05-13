FROM mcr.microsoft.com/dotnet/aspnet:7.0-alpine AS base
ARG IMAGE_VER
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS publish

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY . .
RUN dotnet restore Hrim.Event.Analytics.Web.sln
RUN dotnet build Hrim.Event.Analytics.Web.sln -c Release --no-restore -o /app/build
RUN dotnet publish Hrim.Event.Analytics.Web.sln -c Release --no-restore -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
RUN echo "Docker image tag: ${IMAGE_VER}"
ENV DOCKER_IMAGE_TAG="${IMAGE_VER}"
ENTRYPOINT ["dotnet", "Hrim.Event.Analytics.Web.dll"]
