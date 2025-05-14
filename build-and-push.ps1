#!/usr/bin/env pwsh
# Build and push the Docker image to Azure Container Registry

# Function to handle errors
function HandleError {
    param (
        [string]$errorMessage
    )
    Write-Error $errorMessage
    exit 1
}

# Ensure AZ CLI is installed
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    HandleError "Azure CLI not found. Please install it from https://docs.microsoft.com/cli/azure/install-azure-cli"
}

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    HandleError "Docker not found. Please install Docker Desktop or Docker CLI."
}

# Check if user is logged in to Azure
$account = az account show --query name -o tsv 2>$null
if (-not $account) {
    Write-Host "Please login to Azure..."
    az login
}

# Get the current environment name from azd if available
$envName = $null
if (Get-Command azd -ErrorAction SilentlyContinue) {
    $envName = azd env get-name
    if (-not $envName) {
        $envName = Read-Host "Enter your Azure environment name"
    }
} else {
    $envName = Read-Host "Enter your Azure environment name"
}

# Get the Azure Container Registry name
$registryName = az resource list --resource-group "rg-$envName" --resource-type "Microsoft.ContainerRegistry/registries" --query "[0].name" -o tsv
if (-not $registryName) {
    HandleError "No Azure Container Registry found in resource group 'rg-$envName'. Please make sure the resource group and registry exist."
}

# Get the registry login server
$loginServer = az acr show --name $registryName --query "loginServer" -o tsv
if (-not $loginServer) {
    HandleError "Failed to get login server for registry $registryName"
}

# Log in to the Azure Container Registry
Write-Host "Logging in to Azure Container Registry $loginServer..."
az acr login --name $registryName

# Build the Docker image with the correct tag
$imageName = "$loginServer/unconferenceapp/web:latest"
Write-Host "Building Docker image: $imageName"
docker build -t $imageName .

# Push the Docker image to the Azure Container Registry
Write-Host "Pushing Docker image to Azure Container Registry..."
docker push $imageName

Write-Host "Image successfully built and pushed to $imageName"