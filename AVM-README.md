# Unsocial Conference App with Azure Verified Modules

This application uses Azure Verified Modules (AVM) for deployment, specifically the container-app-upsert module to intelligently create or update the Container App.

## Deployment Process

The application is deployed using Azure Developer CLI (azd). The deployment process includes:

1. Building the Docker image
2. Pushing the image to Azure Container Registry
3. Provisioning the infrastructure (Container App Environment, Container Registry, etc.)
4. Deploying the Container App using the AVM container-app-upsert module

## Key Features of AVM container-app-upsert

- Intelligent creation or updating of Container Apps based on the `resourceExists` parameter
- Simplified configuration with reasonable defaults
- Best practices built-in
- Standardized implementation

## Environment Variables

The deployment uses environment variables to control the process:

- `AZURE_ENV_NAME`: The name of the environment for resource naming
- `AZURE_LOCATION`: The Azure region to deploy resources to
- `SERVICE_WEB_RESOURCE_EXISTS`: Flag to indicate if the web service (Container App) already exists

## Deployment Commands

```bash
# Deploy everything (provision infrastructure and deploy app)
azd up

# Provision infrastructure only
azd provision

# Deploy application only
azd deploy
```

## Troubleshooting

If you encounter issues with the Docker image tag, ensure that:

1. The Container Registry is properly set up
2. The image tag in the Container App matches the tag used during the Docker build
3. The Container App has proper credentials to pull from the Container Registry

The correct image reference should be: `<registry-login-server>/web:latest`
