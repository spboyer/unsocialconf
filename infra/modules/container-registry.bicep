@description('Name of the Container Registry')
param name string

@description('Location to deploy the Container Registry')
param location string = resourceGroup().location

@description('Tags for the Container Registry')
param tags object = {}

@description('Enable admin user for the Container Registry')
param adminUserEnabled bool = false

@description('SKU for the Container Registry')
param sku string = 'Basic'

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: sku
  }
  properties: {
    adminUserEnabled: adminUserEnabled
  }
}

output name string = containerRegistry.name
output loginServer string = containerRegistry.properties.loginServer
