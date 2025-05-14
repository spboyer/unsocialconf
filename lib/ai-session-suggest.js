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
