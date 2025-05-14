# Deployment Notes for Unsocial Conference App

This document provides detailed information about the deployment setup for the Unsocial Conference app, specifically focusing on environment variables, Docker configuration, Azure.yaml structure, and Azure Verified Modules (AVM) implementation.

## Environment Variables

### Key Environment Variables

The application relies on several environment variables that are used across different deployment components:

| Environment Variable | Description | Used In |
|---------------------|-------------|---------|
| `AZURE_ENDPOINT` | The Azure OpenAI service endpoint URL | Dockerfile, azure.yaml, Bicep |
| `API_VERSION` | The Azure OpenAI API version | Dockerfile, azure.yaml, Bicep |
| `DEPLOYMENT_NAME` | The name of the deployed model in Azure OpenAI | Dockerfile, azure.yaml, Bicep |
| `AZURE_API_KEY` | The API key for Azure OpenAI service (sensitive) | Dockerfile, azure.yaml, Bicep |
| `NODE_ENV` | The Node.js environment (production, development) | Dockerfile, azure.yaml, Bicep |
| `AZURE_ENV_NAME` | Environment name for resource naming conventions | Bicep parameters |
| `AZURE_LOCATION` | Azure region for resource deployment | Bicep parameters |
| `SERVICE_WEB_RESOURCE_EXISTS` | Flag indicating if the web Container App already exists | Bicep parameters |

### Environment Variable Flow

The environment variables follow this flow during deployment:

1. Variables are set in your local environment or AZD environment
2. AZD passes these variables to the Bicep deployment via parameter substitution in main.parameters.json
3. Bicep creates Container App with these environment variables
4. The container runtime uses these environment variables in the application

## Dockerfile Configuration

The Dockerfile is a multi-stage build optimized for Next.js applications:

### Stages

1. **Base**: Sets up the Node.js Alpine image
2. **Dependencies**: Installs dependencies using pnpm
3. **Builder**: Builds the Next.js application in standalone mode
4. **Runner**: Creates a production-optimized image

### Environment Variable Handling

```dockerfile
# Environment variables are defined in the Runner stage
ENV NODE_ENV=production
ENV AZURE_ENDPOINT=$AZURE_ENDPOINT
ENV API_VERSION=$API_VERSION
ENV DEPLOYMENT_NAME=$DEPLOYMENT_NAME
ENV AZURE_API_KEY=$AZURE_API_KEY
```

These variables are passed from the host environment during build time. The pattern `ENV VARIABLE_NAME=$VARIABLE_NAME` takes values from the build context and sets them in the container environment.

### Security Considerations

- The Dockerfile creates a non-root user (`nextjs`) for running the application
- The container runs with least privilege using `USER nextjs`
- Sensitive environment variables like `AZURE_API_KEY` should be managed as secrets in your CI/CD pipeline

## Azure.yaml Configuration

The `azure.yaml` file is the primary configuration for Azure Developer CLI (AZD):

```yaml
name: unconferenceapp
metadata:
  template: unconferenceapp@0.1.0
services:
  web:
    project: .
    language: js
    host: containerapp
    docker:
      path: ./Dockerfile
      context: .
      buildArgs:
        - NODE_ENV=production
        - AZURE_ENDPOINT=${AZURE_ENDPOINT}
        - API_VERSION=${API_VERSION}
        - DEPLOYMENT_NAME=${DEPLOYMENT_NAME}
        - AZURE_API_KEY=${AZURE_API_KEY}
```

### Key Components

- **name**: The name of the application used in resource naming
- **metadata.template**: Identifies the template version
- **services.web**: Defines the web service configuration
  - **project**: Path to the project
  - **language**: Programming language (js)
  - **host**: Deployment target (containerapp)
  - **docker**: Docker build configuration
    - **path**: Path to the Dockerfile
    - **context**: Build context
    - **buildArgs**: Arguments passed to Docker build command

### Environment Variable Substitution

The `${VARIABLE_NAME}` syntax in azure.yaml tells AZD to substitute the values from the AZD environment. These are then passed as build arguments to Docker during the container build process.

## Infrastructure as Code (Bicep) Structure

The infrastructure is defined using Bicep with Azure Verified Modules (AVM) integration.

### Main Bicep Template Structure

The `main.bicep` file follows a structured approach:

1. **Parameter Definitions**: Declares parameters with constraints and defaults
2. **Variable Definitions**: Calculates derived values like resource names
3. **Module Imports**: Imports AVM modules for standardized resource creation
4. **Resource Definitions**: Creates and configures Azure resources
5. **Outputs**: Defines outputs for use in subsequent deployment steps

### AVM Module Usage

The application uses several AVM modules:

1. **Monitoring Module**:
   ```bicep
   module monitoring 'br/public:avm/ptn/azd/monitoring:0.1.0' = {
     // Configuration...
   }
   ```

2. **Container Apps Stack**:
   ```bicep
   module containerApps 'br/public:avm/ptn/azd/container-apps-stack:0.1.0' = {
     // Configuration...
   }
   ```

3. **User-Assigned Identity**:
   ```bicep
   module webIdentity 'br/public:avm/res/managed-identity/user-assigned-identity:0.2.1' = {
     // Configuration...
   }
   ```

4. **Container App Upsert**:
   ```bicep
   module web 'br/public:avm/ptn/azd/container-app-upsert:0.1.1' = {
     // Configuration...
   }
   ```

### AVM Implementation Benefits

1. **Standardization**: AVM provides standardized implementations following best practices
2. **Maintainability**: Modules are maintained by Microsoft and the community
3. **Compliance**: Modules implement security and compliance best practices
4. **Reusability**: Modules can be reused across projects
5. **Versioning**: Module versions ensure consistent deployments

### Environment Variable Configuration in Bicep

Environment variables are passed to the Container App using the `env` array in the Container App Upsert module:

```bicep
env: [
  {
    name: 'NODE_ENV'
    value: nodeEnv
  }
  {
    name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
    value: monitoring.outputs.applicationInsightsConnectionString
  }
  {
    name: 'AZURE_ENDPOINT'
    value: azureEndpoint
  }
  // Additional environment variables...
]
```

## Parameter File Structure

The `main.parameters.json` file provides values for the Bicep parameters:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "environmentName": {
      "value": "${AZURE_ENV_NAME}"
    },
    // Additional parameters...
  }
}
```

The `${VARIABLE_NAME}` syntax is used for parameter substitution by AZD during deployment.

## Tips for Future Projects

1. **Environment Variables Strategy**:
   - Keep sensitive values in AZD environment or Key Vault
   - Use consistent naming across Dockerfile, azure.yaml, and Bicep templates
   - Consider using Key Vault references for production deployments

2. **AVM Module Selection**:
   - Use `br/public:avm/ptn/azd/container-apps-stack` for Container Apps environment and registry
   - Use `br/public:avm/ptn/azd/container-app-upsert` for intelligent Container App deployment
   - Use `br/public:avm/res/managed-identity/user-assigned-identity` for managed identities

3. **Resource Naming Strategy**:
   - Use the resource token pattern (`resourceToken = toLower(uniqueString(subscription().id, environmentName, location))`)
   - Apply consistent abbreviations (see `abbrs` variable in main.bicep)
   - Include environment name in resource names

4. **Deployment Optimization**:
   - Use the `exists` parameter in container-app-upsert to avoid recreation
   - Consider setting up CI/CD to automate deployments
   - Use output values from one module as inputs to another

5. **Security Best Practices**:
   - Always use managed identities for authentication between services
   - Secure sensitive environment variables as secrets
   - Run containers as non-root users (as shown in the Dockerfile)

## Common Issues and Solutions

1. **Container Registry Authentication**:
   - Ensure the Container App has proper identity with AcrPull rights
   - Verify that the container registry admin user is enabled if using admin credentials

2. **Environment Variable Missing**:
   - Check value substitution in main.parameters.json
   - Verify values are set in the AZD environment

3. **Container App Not Starting**:
   - Check container logs in the Azure portal
   - Verify that all required environment variables are properly set
   - Ensure the containerized application listens on the port specified in targetPort
