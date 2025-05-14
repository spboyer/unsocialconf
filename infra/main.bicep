@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string = resourceGroup().location

@description('Flag to determine if the web container app already exists')
param webAppExists bool = false

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
  managedIdentityUserAssignedIdentities: 'id'
  appInsightsComponents: 'appi'
}

// Name of the container app
var resolvedContainerAppName = !empty(containerAppName) ? containerAppName : '${abbrs.containerApps}-${environmentName}'

// Name of the container app environment
var resolvedContainerAppEnvName = !empty(containerAppEnvName) ? containerAppEnvName : '${abbrs.containerAppEnvironments}-${environmentName}'

// Name of the log analytics workspace
var resolvedLogAnalyticsName = !empty(logAnalyticsName) ? logAnalyticsName : '${abbrs.logAnalyticsWorkspace}-${environmentName}'

// Name of the container registry
var resolvedContainerRegistryName = !empty(containerRegistryName) ? containerRegistryName : '${abbrs.containerRegistry}${resourceToken}'

// Create a Container Apps Environment with Log Analytics
module monitoring 'br/public:avm/ptn/azd/monitoring:0.1.0' = {
  name: 'monitoring'
  params: {
    applicationInsightsName: '${abbrs.appInsightsComponents}${resourceToken}'
    logAnalyticsName: resolvedLogAnalyticsName
    location: location
    tags: tags
  }
}

// Container apps host (including container registry)
module containerApps 'br/public:avm/ptn/azd/container-apps-stack:0.1.0' = {
  name: 'container-apps'
  params: {
    containerAppsEnvironmentName: resolvedContainerAppEnvName
    containerRegistryName: resolvedContainerRegistryName
    logAnalyticsWorkspaceResourceId: monitoring.outputs.logAnalyticsWorkspaceResourceId
    appInsightsConnectionString: monitoring.outputs.applicationInsightsConnectionString
    acrSku: 'Basic'
    location: location
    acrAdminUserEnabled: true
    zoneRedundant: false
    tags: tags
  }
}

// Managed identity for the web app
module webIdentity 'br/public:avm/res/managed-identity/user-assigned-identity:0.2.1' = {
  name: 'webidentity'
  params: {
    name: '${abbrs.managedIdentityUserAssignedIdentities}web-${resourceToken}'
    location: location
  }
}

// Web app container
module web 'br/public:avm/ptn/azd/container-app-upsert:0.1.1' = {
  name: 'web-container-app'
  params: {
    name: resolvedContainerAppName
    tags: union(tags, { 'azd-service-name': 'web' })
    location: location
    containerAppsEnvironmentName: containerApps.outputs.environmentName
    containerRegistryName: containerApps.outputs.registryName
    ingressEnabled: true
    identityType: 'UserAssigned'
    exists: webAppExists
    containerName: 'main'
    env: [
      {
        name: 'NODE_ENV'
        value: 'production'
      }
      {
        name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
        value: monitoring.outputs.applicationInsightsConnectionString
      }
    ]
    identityName: webIdentity.name
    userAssignedIdentityResourceId: webIdentity.outputs.resourceId
    containerMinReplicas: 1
    containerMaxReplicas: 3
     containerCpuCoreCount: '1.0'
    containerMemory: '2.0Gi'
    identityPrincipalId: webIdentity.outputs.principalId
  }
}

// Outputs
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerApps.outputs.registryLoginServer
output AZURE_CONTAINER_APP_NAME string = web.outputs.name
output AZURE_CONTAINER_APP_URI string = web.outputs.uri
output AZURE_CONTAINER_APP_ENV_NAME string = containerApps.outputs.environmentName
output APPLICATIONINSIGHTS_CONNECTION_STRING string = monitoring.outputs.applicationInsightsConnectionString
