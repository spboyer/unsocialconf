"use client"

import { create } from "zustand"

// Mock data for initial sessions
const initialSessions = [
  {
    id: "1",
    title: "Building Accessible Web Applications",
    presenter: "Alex Johnson",
    description:
      "Learn how to create web applications that are accessible to everyone. We'll cover ARIA attributes, keyboard navigation, and testing tools.",
    track: "Development",
    votes: 24,
    status: "scheduled",
    time: "9:00 AM - 10:00 AM",
    location: "Room A",
  },
  {
    id: "2",
    title: "Design Systems at Scale",
    presenter: "Maya Patel",
    description:
      "How to build and maintain design systems that scale across multiple products and teams. We'll share our experience and best practices.",
    track: "Design",
    votes: 18,
    status: "scheduled",
    time: "10:15 AM - 11:15 AM",
    location: "Room B",
  },
  {
    id: "3",
    title: "Product Discovery Techniques",
    presenter: "Carlos Rodriguez",
    description:
      "Effective techniques for product discovery that help you build the right thing. We'll cover user interviews, prototyping, and validation methods.",
    track: "Product",
    votes: 15,
    status: "scheduled",
    time: "11:30 AM - 12:30 PM",
    location: "Room C",
  },
  {
    id: "4",
    title: "Microservices Architecture Patterns",
    presenter: "Samantha Lee",
    description:
      "Explore common patterns and anti-patterns in microservices architecture. Learn from our mistakes and successes.",
    track: "Development",
    votes: 12,
    status: "proposed",
  },
  {
    id: "5",
    title: "Leading Engineering Teams",
    presenter: "David Chen",
    description:
      "Strategies for leading and growing engineering teams. We'll discuss hiring, mentoring, and creating a positive team culture.",
    track: "Leadership",
    votes: 10,
    status: "proposed",
  },
  {
    id: "6",
    title: "React Performance Optimization",
    presenter: "Priya Sharma",
    description:
      "Deep dive into React performance optimization techniques. Learn how to identify and fix performance bottlenecks in your React applications.",
    track: "Development",
    votes: 9,
    status: "proposed",
  },
  {
    id: "7",
    title: "User Research on a Budget",
    presenter: "James Wilson",
    description:
      "How to conduct effective user research with limited resources. We'll share practical tips and tools that won't break the bank.",
    track: "Design",
    votes: 8,
    status: "proposed",
  },
  {
    id: "8",
    title: "Building a Product Roadmap",
    presenter: "Elena Gonzalez",
    description:
      "A step-by-step guide to creating and communicating a product roadmap that aligns stakeholders and guides development.",
    track: "Product",
    votes: 7,
    status: "scheduled",
    time: "1:30 PM - 2:30 PM",
    location: "Room A",
  },
  {
    id: "9",
    title: "Inclusive Design Principles",
    presenter: "Omar Hassan",
    description:
      "Learn how to design products that work for diverse users. We'll cover inclusive design principles and practical implementation strategies.",
    track: "Design",
    votes: 6,
    status: "scheduled",
    time: "2:45 PM - 3:45 PM",
    location: "Room B",
  },
  {
    id: "10",
    title: "DevOps Best Practices",
    presenter: "Lina Kim",
    description:
      "Essential DevOps practices for modern development teams. We'll cover CI/CD, infrastructure as code, and monitoring.",
    track: "Development",
    votes: 5,
    status: "scheduled",
    time: "4:00 PM - 5:00 PM",
    location: "Room C",
  },
]

export const useSessionStore = create((set) => ({
  sessions: initialSessions,

  addSession: (session) =>
    set((state) => ({
      sessions: [...state.sessions, session],
    })),

  upvoteSession: (sessionId) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId ? { ...session, votes: session.votes + 1 } : session,
      ),
    })),

  scheduleSession: (sessionId, time, location) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId ? { ...session, status: "scheduled", time, location } : session,
      ),
    })),
}))
