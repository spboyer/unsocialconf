# AI Session Suggestion Feature Implementation Guide

This guide provides instructions for implementing the AI suggestion feature in the Unconference App, which uses Azure OpenAI to generate creative session titles and descriptions.

## Overview

The AI suggestion feature allows users submitting session proposals to get AI-generated suggestions for their session titles and descriptions. The implementation consists of:

1. **Client-Side Component**: A button with a star icon in the session submission form
2. **Server-Side API**: A Next.js API route that interfaces with Azure OpenAI
3. **Environment Configuration**: Secure handling of API keys and endpoints
4. **Azure OpenAI Integration**: Using the Azure OpenAI service for generating creative content

## Implementation Requirements

### Step 1: Azure OpenAI Service Setup

1. Create an Azure OpenAI service in your Azure subscription
2. Deploy the `gpt-4o-mini` model or a similar model of your choice
3. Note the endpoint URL and API key for configuration

### Step 2: Server-Side API Implementation

Create an API route at `app/api/ai-suggest/route.js`:

```javascript
// This is a server-side API endpoint for accessing Azure AI services
// It's called by the client-side code instead of trying to use Azure credentials directly in the browser

import { NextResponse } from 'next/server';
import { AzureOpenAI } from "openai";

// Get configuration from environment variables for security
const AZURE_API_KEY = process.env.AZURE_API_KEY || '';
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT || '';
const API_VERSION = process.env.API_VERSION || '2024-04-01-preview';
const MODEL_NAME = process.env.DEPLOYMENT_NAME || 'gpt-4o-mini';
const DEPLOYMENT_NAME = process.env.DEPLOYMENT_NAME || 'gpt-4o-mini';

// This is an async function that handles POST requests to the API endpoint
export async function POST(request) {
  try {
    // Extract the form data from the request
    const formData = await request.json();
    
    // Generate AI suggestions using the Azure AI service
    const suggestion = await generateAISuggestion(formData);
    
    // Return the suggestion as a JSON response
    return NextResponse.json(suggestion);
  } catch (error) {
    console.error('Error generating AI suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestion', details: error.message },
      { status: 500 }
    );
  }
}

// Function that uses Azure AI to generate suggestions
async function generateAISuggestion(formData) {
  // Check if API key is available
  if (!AZURE_API_KEY) {
    console.warn('Missing Azure API key. Falling back to mock implementation.');
    return getFallbackSuggestion(formData);
  }

  try {
    console.log('Initializing Azure OpenAI client...');
    
    // Initialize the Azure OpenAI client with API key authentication
    const options = {
      apiKey: AZURE_API_KEY,
      endpoint: AZURE_ENDPOINT,
      apiVersion: API_VERSION,
      deployment: DEPLOYMENT_NAME
    };
    
    const client = new AzureOpenAI(options);
    
    // Compose the messages for the chat completion
    const systemMessage = "You are a helpful assistant that suggests creative and engaging session titles and descriptions for unconference events.";
    const userMessage = buildPromptFromFormData(formData);
    
    console.log('Sending request to Azure OpenAI service...');
    
    // Call the OpenAI API for chat completion
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      max_tokens: 800,
      temperature: 0.7,
      model: MODEL_NAME
    });
    
    console.log('Received response from Azure OpenAI service');
    
    // Extract the content from the response
    if (response.choices && response.choices.length > 0) {
      const content = response.choices[0].message.content;
      
      // Parse the AI response
      const parsedResult = parseAIResponse(content);
      console.log('Parsed result:', parsedResult);
      
      return parsedResult;
    } else {
      console.warn('No choices returned from Azure OpenAI');
      return getFallbackSuggestion(formData);
    }
  } catch (error) {
    console.error('Azure OpenAI error:', error);
    
    // Fallback to the mock implementation if Azure AI fails
    return getFallbackSuggestion(formData);
  }
}

// Helper function to build the prompt from form data
function buildPromptFromFormData(formData) {
  let prompt = "Please suggest a session title and description for an unconference. Format your response like this:\n\nTitle: [Your suggested title]\nDescription: [Your suggested description]\n\n";
  
  if (formData.track) prompt += `The session is for the "${formData.track}" track. `;
  if (formData.presenter) prompt += `The presenter is ${formData.presenter}. `;
  if (formData.title) prompt += `Here's their initial title idea: "${formData.title}". `;
  if (formData.description) prompt += `And their initial description: "${formData.description}". `;
  
  prompt += "\nPlease enhance and improve these ideas while maintaining the core subject. Make the title catchy and the description engaging.";
  
  return prompt;
}

// Helper function to parse the AI response
function parseAIResponse(content) {
  // Try to parse title/description from the text
  const match = content.match(/Title:(.*?)(?:\n|$)(.*?)(?:Description:)(.*)/s);
  
  if (match) {
    return {
      title: match[1].trim(),
      description: match[3].trim()
    };
  }
  
  // Fallback: try a simpler pattern
  const titleMatch = content.match(/Title:(.*?)(?:\n|$)/);
  const descMatch = content.match(/Description:(.*?)(?:\n|$)/s);
  
  if (titleMatch && descMatch) {
    return {
      title: titleMatch[1].trim(),
      description: descMatch[1].trim()
    };
  }
  
  // If all parsing fails, return the whole text as description with a default title
  return {
    title: "AI-Suggested Session",
    description: content.trim()
  };
}

// Fallback function that provides suggestions without calling Azure
function getFallbackSuggestion(formData) {
  const track = formData.track || "General";
  const presenter = formData.presenter || "you";
  
  // Track-based suggestion templates
  const suggestions = {
    "Design": {
      title: `UX Design Patterns for ${new Date().getFullYear()}`,
      description: `Join ${presenter} for an interactive session exploring the latest UX design patterns and trends. We'll analyze real-world examples, discuss best practices, and provide actionable insights you can apply to your own projects immediately. This session is perfect for designers looking to stay current with evolving user expectations and industry standards.`
    },
    "Development": {
      title: "Modern Frontend Architecture: Patterns and Pitfalls",
      description: `In this technical deep-dive, ${presenter} will explore scalable frontend architecture patterns that work in real-world applications. We'll examine component composition, state management strategies, and performance optimization techniques. You'll leave with practical approaches to common architectural challenges and ways to avoid typical implementation pitfalls.`
    },
    "Product": {
      title: "From Insight to Feature: Product Discovery That Works",
      description: `How do you transform user research into features that actually solve problems? In this session, ${presenter} will walk through a structured approach to product discovery that bridges user needs with business goals. We'll cover practical frameworks for prioritization, validation techniques, and effective ways to communicate findings to stakeholders.`
    },
    "Leadership": {
      title: "Building High-Performing Engineering Teams",
      description: `What makes the difference between good and truly exceptional engineering teams? Join ${presenter} to explore proven strategies for fostering technical excellence, promoting psychological safety, and creating an environment where innovation thrives. This session combines research-backed principles with real-world examples suitable for engineering leaders at all levels.`
    },
    "General": {
      title: "The Future of Tech: Trends and Opportunities",
      description: `A forward-looking exploration of emerging technologies and their potential impact on our industry. ${presenter} will analyze current trends, discuss upcoming challenges, and highlight areas of opportunity. This session is designed for anyone interested in staying ahead of technological shifts and preparing for the next wave of innovation.`
    }
  };
  
  return suggestions[track] || suggestions["General"];
}
```

### Step 3: Client-Side Implementation

Create or update `lib/ai-session-suggest.js`:

```javascript
// lib/ai-session-suggest.js
// Implementation that calls the server-side API endpoint for AI suggestions

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
 * @param {Object} formData - The current form data
 * @returns {Object} - Mock suggestion for title and description
 */
function getFallbackSuggestion(formData) {
  // Generate suggestion based on track
  const track = formData.track || "General";
  const presenter = formData.presenter || "you";
  
  // Track-based suggestion templates
  const suggestions = {
    "Design": {
      title: `UX Design Patterns for ${new Date().getFullYear()}`,
      description: `Join ${presenter} for an interactive session exploring the latest UX design patterns and trends. We'll analyze real-world examples, discuss best practices, and provide actionable insights you can apply to your own projects immediately. This session is perfect for designers looking to stay current with evolving user expectations and industry standards.`
    },
    "Development": {
      title: "Modern Frontend Architecture: Patterns and Pitfalls",
      description: `In this technical deep-dive, ${presenter} will explore scalable frontend architecture patterns that work in real-world applications. We'll examine component composition, state management strategies, and performance optimization techniques. You'll leave with practical approaches to common architectural challenges and ways to avoid typical implementation pitfalls.`
    },
    "Product": {
      title: "From Insight to Feature: Product Discovery That Works",
      description: `How do you transform user research into features that actually solve problems? In this session, ${presenter} will walk through a structured approach to product discovery that bridges user needs with business goals. We'll cover practical frameworks for prioritization, validation techniques, and effective ways to communicate findings to stakeholders.`
    },
    "Leadership": {
      title: "Building High-Performing Engineering Teams",
      description: `What makes the difference between good and truly exceptional engineering teams? Join ${presenter} to explore proven strategies for fostering technical excellence, promoting psychological safety, and creating an environment where innovation thrives. This session combines research-backed principles with real-world examples suitable for engineering leaders at all levels.`
    },
    "General": {
      title: "The Future of Tech: Trends and Opportunities",
      description: `A forward-looking exploration of emerging technologies and their potential impact on our industry. ${presenter} will analyze current trends, discuss upcoming challenges, and highlight areas of opportunity. This session is designed for anyone interested in staying ahead of technological shifts and preparing for the next wave of innovation.`
    }
  };
  
  return suggestions[track] || suggestions["General"];
}
```

### Step 4: Submit Form Component Update

Modify the `components/submit-form.tsx` to include the AI suggestion button:

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FaStar } from "react-icons/fa"
// Import the AI suggestion function
import { getAISessionSuggestion } from "@/lib/ai-session-suggest"

export default function SubmitForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: "",
    presenter: "",
    track: "",
    description: "",
  })

  const [errors, setErrors] = useState({})
  const [isAISuggesting, setIsAISuggesting] = useState(false)

  // AI Suggestion handler
  const handleAISuggest = async () => {
    setIsAISuggesting(true)
    try {
      const suggestion = await getAISessionSuggestion(formData)
      setFormData((prev) => ({
        ...prev,
        title: suggestion.title || prev.title,
        description: suggestion.description || prev.description,
      }))
    } catch (e) {
      // Optionally show a toast or error
      console.error("AI suggestion failed", e)
    } finally {
      setIsAISuggesting(false)
    }
  }

  // Rest of the form component code...

  return (
    <form onSubmit={handleSubmit} className="needs-validation">
      <div className="d-flex justify-content-end mb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAISuggest}
          disabled={isAISuggesting || isSubmitting}
          title="Suggest title & description with AI"
        >
          <FaStar className="me-2 text-warning" />
          {isAISuggesting ? "Suggesting..." : "AI Suggest"}
        </Button>
      </div>
      
      {/* Rest of the form UI */}
    </form>
  )
}
```

### Step 5: Environment Configuration

Create or update your `.env.local` file:

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

### Step 6: Install Required Packages

Install the required packages:

```bash
npm install openai
# or
pnpm add openai
# or
yarn add openai
```

## Simple Prompt for GitHub Copilot

If you need to quickly request the AI feature implementation from GitHub Copilot, use this straightforward prompt:

```
Implement an Azure OpenAI feature for my unconference app that allows users to get AI-generated session title and description suggestions. 

I need:
1. A "Suggest with AI" button on the session submission form
2. Integration with Azure OpenAI using environment variables for configuration
3. A fallback mechanism when Azure AI is unavailable 

The API endpoint should be at /api/ai-suggest and connect to Azure OpenAI's gpt-4o-mini model. Make the suggestion enhance the user's input while keeping their core ideas.
```

## Detailed Usage with GitHub Copilot

For a more comprehensive implementation request, you can use the following detailed prompt:

```
I need to implement the AI session suggestion feature for my unconference app. Please:

1. Create an Azure OpenAI service endpoint configuration by updating the route.js file
2. Implement the client-side AI suggestion function in lib/ai-session-suggest.js
3. Add the AI suggestion button to the submit form component
4. Set up proper error handling and fallback mechanism
5. Use secure Azure OpenAI authentication

Here's what I've done so far: [Include any relevant context about your current implementation]

The feature should:
- Allow users to get AI-generated title and description suggestions
- Show a loading state while the AI is generating suggestions
- Fall back to predefined templates if the Azure service is unavailable
- Enhance the user's initial input while maintaining their core ideas
```

## Azure Best Practices

This implementation follows several Azure best practices:

### Authentication & Security
- Secure handling of API keys via environment variables
- No hardcoded credentials in source code
- Clean separation between client and server for security

### Error Handling & Reliability
- Implements proper error handling for API requests
- Includes fallback mechanisms when the service is unavailable
- Provides logging throughout the codebase

### Performance & Scaling
- Configures appropriate token limits and temperature settings
- Optimizes prompt engineering for better results
- Uses lightweight client-side implementation

## Testing and Troubleshooting

1. Ensure your Azure OpenAI service is properly configured with the right model deployment
2. Check that your API key has appropriate permissions
3. Verify that your environment variables are correctly set
4. Monitor API responses in the browser's developer tools or server logs
5. Use the fallback mechanism for graceful degradation when the service is unavailable
