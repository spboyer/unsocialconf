#!/usr/bin/env pwsh
# deploy.ps1 - Deployment script for the Unsocial Conference app

# Ensure AZ CLI is installed
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "Azure CLI not found. Please install it from https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
}

# Check if user is logged in
$account = az account show --query name -o tsv 2>$null
if (-not $account) {
    Write-Host "Please login to Azure..."
    az login
}

# Set default parameters
$resourceGroupName = $null
$location = "westus2"
$environmentName = $null
$aiAgentId = $null
$aiThreadId = $null

# Parse command line arguments
for ($i = 0; $i -lt $args.Count; $i++) {
    switch ($args[$i]) {
        "-g" { $resourceGroupName = $args[++$i] }
        "-l" { $location = $args[++$i] }
        "-e" { $environmentName = $args[++$i] }
        "-aiAgent" { $aiAgentId = $args[++$i] }
        "-aiThread" { $aiThreadId = $args[++$i] }
    }
}

# Prompt for required parameters if not provided
if (-not $environmentName) {
    $environmentName = Read-Host "Enter environment name (used for resource naming)"
}

if (-not $resourceGroupName) {
    $resourceGroupName = "rg-$environmentName"
    Write-Host "Using resource group: $resourceGroupName"
}

# Create resource group if it doesn't exist
$rgExists = az group exists --name $resourceGroupName
if ($rgExists -eq "false") {
    Write-Host "Creating resource group '$resourceGroupName' in location '$location'..."
    az group create --name $resourceGroupName --location $location
}

# Deploy using Azure Developer CLI if available
if (Get-Command azd -ErrorAction SilentlyContinue) {
    Write-Host "Using Azure Developer CLI (azd) for deployment..."
    
    # Initialize azd environment if needed
    if (-not (Test-Path .azure)) {
        Write-Host "Initializing azd environment..."
        azd init --environment $environmentName
    }
    
    # Set AI-specific parameters if provided
    if ($aiAgentId) {
        azd env set AZURE_AI_AGENT_ID $aiAgentId
    }
    
    if ($aiThreadId) {
        azd env set AZURE_AI_THREAD_ID $aiThreadId
    }
    
    # Provision and deploy
    Write-Host "Running azd up to provision infrastructure and deploy application..."
    azd up
}
else {
    # Fallback to direct Bicep deployment
    Write-Host "Azure Developer CLI not found, using direct Bicep deployment..."
    
    # Deploy Bicep template
    $deploymentName = "deploy-$environmentName-$(Get-Date -Format 'yyyyMMddHHmmss')"
    
    Write-Host "Starting deployment '$deploymentName'..."
    
    $parameters = @(
        "--name", $deploymentName,
        "--resource-group", $resourceGroupName,
        "--template-file", "./infra/main.bicep",
        "--parameters", "environmentName=$environmentName"
    )
    
    # Add AI parameters if provided
    if ($aiAgentId) {
        $parameters += "--parameters"
        $parameters += "aiAgentId=$aiAgentId"
    }
    
    if ($aiThreadId) {
        $parameters += "--parameters"
        $parameters += "aiThreadId=$aiThreadId"
    }
    
    # First do a what-if to show changes
    Write-Host "Previewing changes with what-if..."
    az deployment group what-if @parameters
    
    # Confirm deployment
    $confirm = Read-Host "Do you want to proceed with the deployment? (y/n)"
    if ($confirm -eq "y") {
        Write-Host "Starting deployment..."
        az deployment group create @parameters
    }
    else {
        Write-Host "Deployment cancelled."
        exit 0
    }
}

Write-Host "Deployment completed successfully."