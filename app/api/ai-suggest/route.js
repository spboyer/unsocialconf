// This is a server-side API endpoint for accessing Azure AI services
// It's called by the client-side code instead of trying to use Azure credentials directly in the browser

import { NextResponse } from 'next/server';
import { AzureOpenAI } from "openai";

// Get configuration from environment variables for security
const AZURE_API_KEY = process.env.AZURE_API_KEY || '';
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT || 'https://shboyer-build25-resource.cognitiveservices.azure.com/';
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
