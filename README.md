# Social Unconference App

A modern web application for organizing and managing community-driven unconference events. This platform allows participants to propose sessions, vote on their favorites, and participate in creating a collaborative agenda.

## What is a Social Unconference?

A "social unconference" is a type of event that combines the characteristics of both social gatherings and unconferences. Unlike traditional conferences with predefined schedules and speakers, unconferences have a low-structure, participatory format where attendees collectively create the agenda and lead discussions. Participants come together to share their experiences, interests, and knowledge in a more democratic and flexible environment.

This application provides the digital infrastructure to facilitate these events, making it easier to organize sessions, gather interest through voting, and create a schedule that reflects the community's preferences.

![Unconference Screenshot](public/placeholder.svg?height=400&width=600)

## Features

- **Session Proposals**: Attendees can propose and submit session ideas on topics they're passionate about
- **Community Voting**: Participants collectively decide which sessions should be included through upvoting
- **Dynamic Agenda Building**: The schedule evolves organically based on community interest and speaker availability
- **Tracks Organization**: Sessions are categorized by tracks (Development, Design, Product, Leadership) for easier navigation
- **AI-Powered Suggestions**: Azure AI integration to suggest titles and descriptions for session proposals
- **Responsive Design**: Works seamlessly on all devices, allowing participation from anywhere
- **Dark/Light Mode**: Supports theme switching for comfortable viewing in any environment
- **Real-time Updates**: Stay informed about new sessions, schedule changes, and popular topics

## Technology Stack

- **Framework**: Next.js 15 with React
- **Styling**: 
  - Tailwind CSS for utility classes
  - Bootstrap 5 for components and layout
  - Radix UI for accessible UI primitives
- **State Management**: Custom store with React hooks
- **Theming**: next-themes for dark/light mode support
- **AI Integration**: Azure AI services for intelligent suggestions
- **Deployment**: Containerized with Docker for Azure Container Apps

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm
- Docker (for containerization)
- Azure subscription (for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/unsocial-v.git
   cd unsocial-v
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Copy the example environment file and update the values:
   ```bash
   cp .env.example .env.local
   ```
     Update the Azure AI service configuration in `.env.local`:
   ```
   AZURE_AI_ENDPOINT=your-azure-ai-endpoint
   AZURE_AI_AGENT_ID=your-agent-id
   AZURE_AI_THREAD_ID=your-thread-id
   
   # Authentication options:
   # Option 1: Use DefaultAzureCredential (managed identity or Azure CLI)
   # (no additional configuration needed if logged in with 'az login')
   
   # Option 2: Use API Key authentication 
   AZURE_API_KEY=your-api-key-from-azure-portal
   # (no additional configuration needed if logged in with 'az login')
   
   # Option 2: Use API Key authentication 
   AZURE_API_KEY=your-api-key-from-azure-portal
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- **`/app`**: Next.js app router pages and layouts
- **`/components`**: React components
  - **`/ui`**: Reusable UI components based on Radix UI
- **`/lib`**: Utility functions and state management
- **`/public`**: Static assets
- **`/styles`**: Global CSS and theme configuration

## How It Works

1. **Proposal Phase**: Before the unconference, attendees submit session ideas through the platform, indicating the topic, format, and their expertise.

2. **Voting Period**: All registered participants can browse proposed sessions and vote on those they find most interesting or valuable.

3. **Agenda Formation**: Based on voting results and available time slots, the most popular sessions are scheduled automatically.

4. **Day of Event**: The finalized schedule is displayed with room assignments, and participants can easily navigate between sessions.

5. **Feedback Loop**: After sessions, attendees can provide feedback and continue discussions through the platform.

This democratic approach ensures that the content is relevant to the community's interests and creates opportunities for unexpected connections and collaborations.

## Key Components

- **SessionCard**: Displays session details with voting capability
- **AgendaView**: Shows the scheduled sessions in a time-based view
- **SessionList**: Lists all proposed sessions with sorting options
- **ThemeProvider**: Manages theming and Bootstrap/Tailwind integration

## Customization

### Styling

The application integrates both Bootstrap and Tailwind CSS with custom integration to ensure they work together:

- CSS variables for theming are defined in `app/globals.css`
- Bootstrap components are enhanced with Tailwind utility classes
- Radix UI components are styled to match the overall design

### Adding Tracks

To add a new track category:

1. Update the `getTrackColor` and `getTrackIcon` functions in `components/session-card.tsx`
2. Add the new track to the options in the submission form

## Containerization and Deployment

### Docker

The application comes with a multi-stage Dockerfile optimized for production:

```bash
# Build the container
docker build -t unsocial-app .

# Run the container locally
docker run -p 3000:3000 unsocial-app
```

### Azure Deployment

This project is configured for deployment to Azure Container Apps using Azure Developer CLI (azd):

1. Login to Azure:
   ```bash
   az login
   ```

2. Initialize the Azure Developer CLI environment:
   ```bash
   azd init
   ```

3. Provision infrastructure and deploy the application:
   ```bash
   azd up
   ```

This will:
- Create the required Azure resources defined in the Bicep templates
- Build and push the Docker container to Azure Container Registry
- Deploy the container to Azure Container Apps
- Set up managed identity for secure access to Azure AI services

### Environment Variables

The following environment variables are required for the AI features:

- `AZURE_AI_ENDPOINT`: The endpoint URL for your Azure AI service
- `AZURE_AI_AGENT_ID`: The ID of your AI agent
- `AZURE_AI_THREAD_ID`: The thread ID for conversation context

In production, these are securely provided through the Azure Container App environment.

## AI Session Suggestion Feature

The application includes an AI-powered feature that helps users generate session titles and descriptions based on their initial input. This feature uses Azure AI services to provide intelligent suggestions.

### How It Works

1. Users enter basic information like track, presenter name, and optionally initial title/description
2. Users click the "AI Suggest" button with the sparkle icon
3. The client sends this data to the server-side API endpoint
4. The API uses Azure AI with managed identity to generate relevant suggestions
5. Suggestions are returned and populated into the form fields
6. Users can edit the suggestions before submitting

### Implementation Details

- Client-side code in `lib/ai-session-suggest.js` makes the API call
- Server-side API endpoint in `app/api/ai-suggest/route.js` processes the request
- Azure AI integration is achieved using the `@azure/ai-projects` SDK
- The system uses DefaultAzureCredential for secure authentication
- If Azure AI is unavailable, the system falls back to pre-defined templates

### Customizing AI Behavior

To customize the AI suggestions:
1. Create your own Azure AI service in Azure Portal
2. Update the environment variables with your service details
3. Modify the prompt in `generateAISuggestion()` function to guide the AI response

Social unconferences offer several advantages over traditional conference formats:

- **Emergent Content**: Topics reflect the current interests and needs of the community rather than being predetermined months in advance
- **Diverse Voices**: Lower barriers to presenting give space for perspectives that might not be represented in conventional conferences
- **Meaningful Connections**: The participatory format encourages more authentic interaction and relationship building
- **Collective Ownership**: Attendees feel greater investment in the event because they helped shape it
- **Adaptability**: The format can flex to accommodate unexpected topics or discussions that emerge during the event

This application aims to preserve these benefits while reducing the logistical challenges that can sometimes make unconferences difficult to organize at scale.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Bootstrap](https://getbootstrap.com/) - Frontend component library
- [Radix UI](https://www.radix-ui.com/) - UI component primitives
- [FontAwesome](https://fontawesome.com/) - Icon library
