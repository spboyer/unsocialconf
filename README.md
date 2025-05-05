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

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm

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

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## The Value of Social Unconferences

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
