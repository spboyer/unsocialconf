# Adding AI Session Suggestion Capability to the Unconference App

## Current State
I have a Next.js application for managing unconference sessions. The app includes a submit form where users can propose new sessions with title, presenter, track, and description fields. I have an Azure OpenAI integration sample in `.snippets/ai-snippet.js` that I want to integrate with the form.

## What I Need
I need to add an "AI Suggest" button to the session submission form that will generate creative title and description suggestions for unconference sessions using Azure OpenAI.

## Implementation Requirements

1. **UI Component**: 
   - Add a button with a sparkle icon (✨) next to the title and description fields in the submit form
   - The button should show a loading state while suggestions are being generated

2. **Backend Integration**:
   - Create an API route at `/api/ai-suggest` that will securely call Azure OpenAI
   - Use the code pattern from `.snippets/ai-snippet.js` but adapt it to return structured session suggestions
   - Ensure proper error handling and fallbacks if the AI service is unavailable

3. **Frontend Logic**:
   - Implement a client-side function to call the API and handle the response
   - Update the form state with the AI suggestions while preserving user inputs for other fields
   - Add appropriate loading and error states to the UI

## Technical Considerations
- Use environment variables for all Azure credentials (endpoint, API key, deployment name)
- Format the AI prompt to explicitly request structured "Title:" and "Description:" in the response
- If the user has already started typing, incorporate their partial input in the AI prompt for better context
- Include a fallback mechanism that provides creative suggestions even if the API call fails

## Example Desired Output
When clicking the "AI Suggest" button with "Development" selected as the track, the form should populate with creative session ideas like:
- Title: "Building Resilient Microservices: Patterns for Success"
- Description: "A practical exploration of design patterns that lead to robust microservice architectures..."

Please help implement this feature using the sample Azure OpenAI code as a starting point, adapting it to work securely in a Next.js environment.