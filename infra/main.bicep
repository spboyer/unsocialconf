@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string = resourceGroup().location

// Tags that should be applied to all resources.
// 
// Note that 'azd-env-name' tag is required for azd to be able to
// identify resources that it has created.
param tags object = {
  'azd-env-name': environmentName
}

@description('The name of the Container App to create')
param containerAppName string = ''

@description('The name of the Container App Environment to create')
param containerAppEnvName string = ''

@description('The name of the Log Analytics workspace to create')
param logAnalyticsName string = ''

@description('The name of the Container Registry to create')
param containerRegistryName string = ''

// Generate a unique token to be used in naming resources
// this ensures DNS name will be unique over global Azure
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))

// Container App names
var abbrs = {
  containerAppEnvironments: 'cae'
  containerApps: 'ca'
  containerRegistry: 'cr'
  logAnalyticsWorkspace: 'law'
}

// Name of the container app
var resolvedContainerAppName = !empty(containerAppName) ? containerAppName : '${abbrs.containerApps}-${environmentName}'

// Name of the container app environment
var resolvedContainerAppEnvName = !empty(containerAppEnvName) ? containerAppEnvName : '${abbrs.containerAppEnvironments}-${environmentName}'

// Name of the log analytics workspace
var resolvedLogAnalyticsName = !empty(logAnalyticsName) ? logAnalyticsName : '${abbrs.logAnalyticsWorkspace}-${environmentName}'

// Name of the container registry
var resolvedContainerRegistryName = !empty(containerRegistryName) ? containerRegistryName : '${abbrs.containerRegistry}${resourceToken}'

// Create a Container App Environment with managed identity
module containerAppEnv 'modules/container-app-environment.bicep' = {
  name: 'container-app-environment'
  params: {
    name: resolvedContainerAppEnvName
    location: location
    tags: tags
    logAnalyticsWorkspaceName: resolvedLogAnalyticsName
  }
}

// Create a Container Registry with admin user enabled
module containerRegistry 'modules/container-registry.bicep' = {
  name: 'container-registry'
  params: {
    name: resolvedContainerRegistryName
    location: location
    tags: tags
    adminUserEnabled: true
  }
}

// Create a Container App with managed identity
module containerApp 'modules/container-app.bicep' = {
  name: 'container-app'
  params: {
    name: resolvedContainerAppName
    location: location
    tags: tags
    identityType: 'SystemAssigned'
    containerAppEnvironmentId: containerAppEnv.outputs.id
    containerRegistryName: containerRegistry.outputs.name
    targetPort: 3000
  }
}

output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.outputs.loginServer
output AZURE_CONTAINER_APP_NAME string = containerApp.outputs.name
output AZURE_CONTAINER_APP_URI string = containerApp.outputs.uri
output AZURE_CONTAINER_APP_ENV_NAME string = containerAppEnv.outputs.name
