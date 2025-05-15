# UnconferenceApp Application Specifications

## Application Overview

UnconferenceApp is a modern Next.js application designed as an "un-conference" platform where users can view sessions, submit new session proposals, and interact with conference content. The application is containerized with Docker and deployed to Azure Container Apps using Azure Developer CLI (azd).

## Technical Specifications

### Frontend
- **Framework**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS with a component library based on Radix UI
- **Deployment Model**: Containerized with standalone output
- **Runtime**: Node.js 20 (Alpine)
- **Port**: 3000

### Application Features
- Session listing and details
- Session submission form
- Responsive design with mobile adaptation
- Theme support (light/dark mode)
- Agenda view for conference planning

### State Management
- Custom session store using Zustand with immer

### Infrastructure
- **Cloud Provider**: Microsoft Azure
- **Hosting Service**: Azure Container Apps
- **Container Registry**: Azure Container Registry
- **Deployment Tool**: Azure Developer CLI (azd)
- **Infrastructure Pattern**: Azure Verified Modules (AVM)

### Deployment Architecture
- Container App Environment with Log Analytics and Application Insights integration
- Container Registry for Docker image storage
- Container App with properly configured ingress
- Remote Docker builds for optimized deployment
- User-assigned managed identity for enhanced security

## Key Components

### UI Components
- **Session Cards**: Display session information in a clean, card-based format
- **Navigation**: Simple navbar for site navigation
- **Submission Form**: Form for submitting new session proposals
- **Agenda View**: Consolidated view of conference sessions
- **UI Library**: Comprehensive set of UI components built on Radix UI primitives

### Page Structure
- Home page with session listing
- Individual session detail pages
- Session submission page
- 404 Not Found page

## Azure Resource Configuration

### Monitoring
- Application Insights for application monitoring and telemetry
- Log Analytics workspace for centralized logging

### Container Registry
- Basic SKU for development
- Admin access enabled for CI/CD integration

### Container App
- CPU: 0.5 cores
- Memory: 1.0Gi
- External ingress on port 3000
- CORS configured for secure cross-origin requests
- Scaling configuration: 1-3 replicas
- User-assigned managed identity for enhanced security

## Development and Deployment Workflow

1. Local development using Next.js development server
2. Containerization with multi-stage Docker build
3. Deployment to Azure using Azure Developer CLI (azd)
4. Remote container builds in Azure Container Registry
5. Monitoring application performance with Application Insights

## Four Prompts for LLM Generation

### Prompt 1: Application Structure and UI Components

```
Create a Next.js 15 application for an unconference platform called "UnconferenceApp" with the following features:

1. Home page showing a list of conference sessions
2. Individual session detail pages with dynamic routing ([id])
3. A session submission form page
4. Components needed:
   - Navbar for navigation
   - Session card component for displaying session information
   - Footer with basic information
   - Session list to display multiple session cards
   - Submission form with validation
   - Agenda view for organizing sessions

Use Tailwind CSS for styling and implement a component library based on Radix UI primitives. Include a theme provider for light/dark mode switching. The application should be responsive and mobile-friendly.

Structure the application with:
- App Router directory structure
- UI components in a separate directory
- Hooks in their own directory
- Utility functions in a lib directory

Implement a session store using Zustand with immer for state management.
```

### Prompt 2: Dockerfile and Next.js Configuration

```
Create a multi-stage Dockerfile for the UnconferenceApp Next.js application with the following requirements:

1. Use Node.js 20 Alpine as the base image
2. Set up three stages:
   - Base stage for common configuration
   - Dependencies stage for installing npm packages
   - Build stage for building the Next.js application
   - Runner stage for the production environment

3. Configuration details:
   - Set working directory to /app
   - Install dependencies with --legacy-peer-deps
   - Build the application with next build
   - Use the standalone output from Next.js
   - Create and use a non-root user (nextjs:nodejs)
   - Set NODE_ENV to production
   - Expose port 3000
   - Set HOSTNAME to "0.0.0.0" for proper container networking

Also, create a next.config.mjs file that:
- Enables standalone output
- Configures unoptimized images
- Ignores TypeScript and ESLint errors during build

Make sure the Dockerfile is optimized for caching and minimal final image size.
```

### Prompt 3: Azure Infrastructure as Code (Bicep with AVM)

```
Create Azure Bicep templates for deploying the UnconferenceApp application to Azure Container Apps using Azure Verified Modules (AVM). Structure the file as follows:

1. main.bicep - The entry point with parameters for:
   - Environment name
   - Location
   - Resource naming and tagging
   - Container specific configurations
   - Application specific environment variables

Implementation details:
- Use AVM pattern modules from the public registry:
  - 'br/public:avm/ptn/azd/monitoring' for Application Insights and Log Analytics
  - 'br/public:avm/ptn/azd/container-apps-stack' for Container App Environment and Registry
  - 'br/public:avm/res/managed-identity/user-assigned-identity' for managed identity
  - 'br/public:avm/ptn/azd/container-app-upsert' for the Container App

Requirements:
- Container Registry with admin access enabled
- Container App Environment with Log Analytics and Application Insights
- Container App configured with:
  - User-assigned managed identity
  - External ingress on port 3000
  - CORS policy
  - Registry authentication
  - 0.5 CPU cores and 1.0Gi memory
  - Scale settings: 1-3 replicas
  - Production environment variables
  - Application Insights integration

2. main.parameters.json - Parameter file for Bicep deployment with environment variable placeholders.

Ensure proper resource dependencies and outputs for connection strings and endpoints.
```

### Prompt 4: Azure Developer CLI Configuration

```
Create an azure.yaml configuration file for deploying the UnconferenceApp Next.js application to Azure Container Apps using Azure Developer CLI (azd). The configuration should:

1. Set the project name to "UnconferenceApp"
2. Configure a service named "web" with:
   - Project path set to the root directory
   - Language set to JavaScript
   - Host type set to containerapp
   - Docker configuration:
     - Context path set to the root
     - Use of the Dockerfile in the root
     - Enable remote builds to build in Azure instead of locally

The file should be simple and concise, focusing on the essential configuration needed for azd to deploy the application properly to Azure Container Apps with remote Docker builds enabled.
```

## Deployment Instructions

To deploy this application:

1. Ensure Azure CLI and Azure Developer CLI (azd) are installed
2. Initialize the azd environment with `azd init`
3. Provision the infrastructure and deploy the application with `azd up`
4. Access the application at the provided Container App URL
5. Monitor application performance in Application Insights

## Maintenance and Updates

For application updates:
1. Make code changes
2. Push changes to the repository
3. Run `azd up` to rebuild and redeploy the application
4. Monitor the application performance in Application Insights

This approach ensures consistent, repeatable deployments with minimal configuration overhead while following Azure best practices through Azure Verified Modules.
