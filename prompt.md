# Deploy a Next.js Application to Azure Container Apps

## What I have
- A Next.js application with a Dockerfile
- The Dockerfile is set up to build a production-ready container
- Next.js is configured with `output: 'standalone'` in next.config.js

## What I want to achieve
- Deploy my containerized Next.js application to Azure Container Apps
- Use Azure Developer CLI (azd) for a simplified deployment experience
- Enable remote building of the container to avoid local Docker dependencies

## Deployment with Azure Developer CLI (azd)

1. **Set up the project for azd**
   - Create an `azure.yaml` file to define the service configuration
   - Configure remote container builds in the yaml file 
   - Define the project structure for azd to recognize

2. **Create Bicep templates for infrastructure**
   - Create main.bicep and necessary modules under the infra/ directory
   - Define Container Registry, Container App Environment, and Container App resources
   - Ensure the Container App references the correct container image

3. **Deploy with azd**
   - Initialize the azd environment with `azd init`
   - Provision the infrastructure with `azd provision`

## Key configuration for success
- Ensure the image reference in the Container App Bicep template matches the image name pushed to ACR
- Use remote container builds to build in Azure rather than locally
- Set the correct port mapping (typically 3000 for Next.js apps)

## Example azure.yaml configuration
```yaml
name: my-nextjs-app
services:
  web:
    project: .
    language: js
    host: containerapp
    docker:
      context: .
      dockerfile: Dockerfile
```

Please help me deploy my Next.js application to Azure Container Apps using Azure Developer CLI (azd), ensuring that the container is built remotely in Azure Container Registry.
