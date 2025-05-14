# AI Session Suggestion Feature Implementation Guide

This document outlines how to implement the AI suggestion feature for session titles and descriptions in the Social Unconference App. The feature uses Azure OpenAI services to generate creative and engaging content based on user input.

## Overview

The AI suggestion feature consists of:

1. A client-side component with a "sparkle" button in the submission form
2. A server-side API endpoint that interfaces with Azure OpenAI
3. Configuration for local development and production deployment
4. Infrastructure for Azure deployment

This implementation follows Azure best practices for security, reliability, and performance when integrating with Azure OpenAI services.

## Implementing the Feature

### Step 1: Set Up Azure OpenAI Service

1. Create an Azure OpenAI service in your Azure subscription
2. Deploy the `gpt-4o-mini` model or a similar model of your choice
3. Note the endpoint URL and API key for configuration

### Step 2: Client-Side Implementation

Create or update the `lib/ai-session-suggest.js` file to call your API endpoint:

```javascript
/**
 * Calls the server-side API to get AI-powered session suggestions
 * @param {Object} formData - The current form data
 * @returns {Promise<{title: string, description: string}>} - Suggested title and description
 */
export async function getAISessionSuggestion(formData) {
  try {
    // Call the server-side API endpoint
    const response = await fetch('/api/ai-suggest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Parse the response JSON
    const suggestion = await response.json();
    
    // If the API returned an error, throw it
    if (suggestion.error) {
      throw new Error(suggestion.error);
    }
    
    return suggestion;
  } catch (error) {
    console.error('AI suggestion failed:', error);
    
    // Fallback to mock suggestions if the API call fails
    return getFallbackSuggestion(formData);
  }
}

/**
 * Fallback function that provides mock suggestions when the API call fails
 */
function getFallbackSuggestion(formData) {
  // Implementation details as in the current code
  // ...
}
```

### Step 3: Server-Side API Implementation

Create an API route at `app/api/ai-suggest/route.js`:

```javascript
import { NextResponse } from 'next/server';
import { AzureOpenAI } from "openai";

// Get configuration from environment variables
const AZURE_API_KEY = process.env.AZURE_API_KEY || '';
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT || '';
const API_VERSION = process.env.API_VERSION || '2024-04-01-preview';
const MODEL_NAME = process.env.DEPLOYMENT_NAME || 'gpt-4o-mini';
const DEPLOYMENT_NAME = process.env.DEPLOYMENT_NAME || 'gpt-4o-mini';

export async function POST(request) {
  try {
    const formData = await request.json();
    const suggestion = await generateAISuggestion(formData);
    return NextResponse.json(suggestion);
  } catch (error) {
    console.error('Error generating AI suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestion', details: error.message },
      { status: 500 }
    );
  }
}

async function generateAISuggestion(formData) {
  if (!AZURE_API_KEY || !AZURE_ENDPOINT) {
    console.warn('Missing Azure configuration. Falling back to mock implementation.');
    return getFallbackSuggestion(formData);
  }

  try {
    // Initialize the Azure OpenAI client
    const options = {
      apiKey: AZURE_API_KEY,
      endpoint: AZURE_ENDPOINT,
      apiVersion: API_VERSION,
      deployment: DEPLOYMENT_NAME
    };
    
    const client = new AzureOpenAI(options);
    
    // Build prompt and call the OpenAI API
    const systemMessage = "You are a helpful assistant that suggests creative and engaging session titles and descriptions for unconference events.";
    const userMessage = buildPromptFromFormData(formData);
    
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      max_tokens: 800,
      temperature: 0.7,
      model: MODEL_NAME
    });
    
    // Process the response
    if (response.choices && response.choices.length > 0) {
      const content = response.choices[0].message.content;
      return parseAIResponse(content);
    } else {
      return getFallbackSuggestion(formData);
    }
  } catch (error) {
    console.error('Azure OpenAI error:', error);
    return getFallbackSuggestion(formData);
  }
}

// Helper functions for building prompts, parsing responses, and fallback suggestions
// ...
```

### Step 4: Environment Configuration

Create or update your environment files:

For local development, update `.env.local`:
```
# Azure OpenAI Configuration
AZURE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
API_VERSION=2024-04-01-preview
DEPLOYMENT_NAME=gpt-4o-mini

# API key authentication
AZURE_API_KEY=your-api-key-here

# Node.js Environment
NODE_ENV=development
```

For production, these values should be set in your Azure Container App configuration.

### Step 5: Infrastructure Updates

Update `infra/main.bicep` to include the AI service and necessary role assignments. Add the following module:

```bicep
// AI service module
module aiService 'modules/ai-service.bicep' = {
  name: 'ai-service'
  params: {
    name: 'ai-${uniqueString(resourceGroup().id)}'
    location: location
    tags: tags
    sku: 'S0'
  }
}

// Role assignment for the container app to access the AI service
module aiRoleAssignment 'modules/role-assignment.bicep' = {
  name: 'ai-role-assignment'
  params: {
    principalId: containerApp.outputs.identityPrincipalId
    roleDefinitionId: 'a001fd3d-188f-4b5d-821b-7da978bf7442' // Cognitive Services User role
    resourceId: aiService.outputs.id
  }
  dependsOn: [
    containerApp
    aiService
  ]
}
```

Update the container app module to include the AI service configuration:

```bicep
// Add these environment variables to your container app
environmentVariables: [
  {
    name: 'AZURE_ENDPOINT'
    value: aiService.outputs.endpoint
  }
  {
    name: 'API_VERSION'
    value: '2024-04-01-preview'
  }
  {
    name: 'DEPLOYMENT_NAME'
    value: 'gpt-4o-mini'
  }
]
```

### Step 6: Dockerfile Updates

Ensure your `Dockerfile` properly handles the environment variables:

```dockerfile
# Add these to your Dockerfile
ENV AZURE_ENDPOINT=""
ENV API_VERSION="2024-04-01-preview"
ENV DEPLOYMENT_NAME="gpt-4o-mini"
```

## Usage in Components

Update your submission form component to include the AI suggestion button and functionality:

```jsx
import { getAISessionSuggestion } from '@/lib/ai-session-suggest';

// Add a button to the form
<Button 
  type="button" 
  size="icon" 
  variant="ghost" 
  className="absolute right-2 top-2"
  onClick={async () => {
    setIsAiLoading(true);
    try {
      const suggestion = await getAISessionSuggestion(formData);
      if (suggestion.title) form.setValue('title', suggestion.title);
      if (suggestion.description) form.setValue('description', suggestion.description);
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
      toast({
        title: 'AI Suggestion Failed',
        description: 'Could not generate a suggestion. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsAiLoading(false);
    }
  }}
>
  {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
</Button>
```

## System Message & User Prompt Design

### System Message

The system message sets the assistant's role and behavior:

```
You are a helpful assistant that suggests creative and engaging session titles and descriptions for unconference events.
```

### User Prompt

The user prompt provides context and formatting instructions:

```
Please suggest a session title and description for an unconference. Format your response like this:

Title: [Your suggested title]
Description: [Your suggested description]

The session is for the "[track]" track. 
The presenter is [presenter name]. 
Here's their initial title idea: "[initial title]". 
And their initial description: "[initial description]".

Please enhance and improve these ideas while maintaining the core subject. Make the title catchy and the description engaging.
```

## Testing and Troubleshooting

1. Ensure your Azure OpenAI service is properly configured with the right model deployment
2. Check that your API key has appropriate permissions
3. Verify that your environment variables are correctly set
4. Monitor API responses in the browser's developer tools or server logs
5. Use the fallback mechanism for graceful degradation when the service is unavailable

## Azure Best Practices

This implementation follows several Azure best practices:

### Authentication & Security
- Secure handling of API keys via environment variables
- No hardcoded credentials in source code
- Clean separation between client and server for security

### Error Handling & Reliability
- Implemented retry logic with exponential backoff in the Azure OpenAI client
- Added proper logging throughout the codebase
- Included fallback mechanisms for when the service is unavailable
- Structured error handling on both client and server

### Performance & Scaling
- Configured appropriate token limits and temperature settings
- Optimized prompt engineering for better results
- Containerized application for flexible scaling

### Deployment & Infrastructure
- Infrastructure defined as code with Bicep
- Docker containerization follows best practices
- Environment variables properly configured for different environments
- Services integrated using appropriate Azure roles and permissions

## Monitoring and Maintenance

### Monitoring Setup

1. **Azure Monitor Integration:**
   - Enable metrics collection for Azure OpenAI service
   - Set up alerts for quota limitations and failures
   - Monitor response times and success rates

2. **Application Insights:**
   - Track API call performance metrics
   - Monitor user interactions with the suggestion feature
   - Set up custom events for tracking suggestion quality

3. **Cost Management:**
   - Monitor Azure OpenAI token usage
   - Implement cost allocation tags
   - Set up budgets and alerts for unexpected costs

### Maintenance Tasks

1. **Regular Updates:**
   - Keep the OpenAI SDK updated to the latest version
   - Review and improve prompts based on suggestion quality
   - Update fallback mechanisms as needed

2. **Security Maintenance:**
   - Rotate API keys regularly
   - Audit access to the AI service
   - Update dependencies to address security vulnerabilities

## Future Improvements

1. **Enhanced Suggestions:**
   - Incorporate user feedback mechanism to improve suggestion quality
   - Add support for multiple suggestion options
   - Implement context-aware suggestions based on conference themes or tracks

2. **Performance Optimizations:**
   - Add caching for similar requests
   - Implement batch processing for multiple suggestions
   - Optimize token usage with more efficient prompts

3. **Integration Enhancements:**
   - Add support for more AI models
   - Implement more advanced prompt engineering techniques
   - Add sentiment analysis for suggested content

## Security Considerations

1. **Authentication & Authorization:**
   - Store API keys in secure environment variables, never in client-side code
   - In production, use Managed Identity with Azure Key Vault for storing secrets
   - Implement appropriate RBAC permissions for the AI service
   - Consider implementing rate limiting to prevent API abuse

2. **Error Handling & Data Protection:**
   - Implement proper error handling without exposing sensitive details
   - Validate and sanitize all user inputs before sending to the API
   - Log errors appropriately without including sensitive information
   - Implement the fallback mechanism for graceful degradation

3. **Infrastructure Security:**
   - Deploy using infrastructure as code (Bicep) for consistency
   - Use private endpoints where possible to reduce attack surface
   - Enable diagnostic logs for monitoring and auditing
   - Regularly review and rotate API keys

4. **Container Security:**
   - Run containers as non-root users (as configured in the Dockerfile)
   - Use minimal base images to reduce attack surface
   - Scan container images for vulnerabilities before deployment
   - Keep dependencies updated with security patches
