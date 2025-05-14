@description('Name of the Container App')
param name string

@description('Location to deploy the Container App')
param location string = resourceGroup().location

@description('Tags for the Container App')
param tags object = {}

@description('Container App Environment ID')
param containerAppEnvironmentId string

@description('Container Registry Name')
param containerRegistryName string

@description('Target port for the application')
param targetPort int = 3000

@description('Type of managed identity to use')
@allowed([
  'SystemAssigned'
  'UserAssigned'
  'SystemAssigned,UserAssigned'
  'None'
])
param identityType string = 'SystemAssigned'

@description('User Assigned Identity Resource IDs Array')
param userAssignedIdentities array = []

// Get a reference to the container registry
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' existing = {
  name: containerRegistryName
}

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: name
  location: location
  tags: tags
  identity: identityType == 'UserAssigned' || identityType == 'SystemAssigned,UserAssigned' ? {
    type: identityType
    userAssignedIdentities: identityType == 'UserAssigned' || identityType == 'SystemAssigned,UserAssigned' ? userAssignedIdentities : null
  } : {
    type: identityType
  }
  properties: {
    managedEnvironmentId: containerAppEnvironmentId
    configuration: {
      ingress: {
        external: true
        targetPort: targetPort
        allowInsecure: false
        traffic: [
          {
            latestRevision: true
            weight: 100
          }
        ]
        corsPolicy: {
          allowedOrigins: [
            'https://*.azurecontainerapps.io'
            'https://*.azurewebsites.net'
          ]
          allowedMethods: [
            'GET'
            'POST'
            'PUT'
            'DELETE'
            'PATCH'
            'OPTIONS'
          ]
          allowedHeaders: [
            '*'
          ]
          allowCredentials: true
          maxAge: 1440
        }
      }
      registries: [
        {
          server: containerRegistry.properties.loginServer
          username: containerRegistry.listCredentials().username
          passwordSecretRef: 'container-registry-password'
        }
      ]        
      secrets: [
        {
          name: 'container-registry-password'
          value: containerRegistry.listCredentials().passwords[0].value
        }
      ]
    }
    template: {
      containers: [
        {
          name: name
          image: '${containerRegistry.properties.loginServer}/web:latest'
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            {
              name: 'NODE_ENV'
              value: 'production'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
      }
    }
  }
}

output id string = containerApp.id
output name string = containerApp.name
output uri string = 'https://${containerApp.properties.configuration.ingress.fqdn}'
