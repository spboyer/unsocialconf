"use client"

import { create } from "zustand"

// Define session types
export interface Session {
  id: string
  title: string
  presenter: string
  description: string
  track: string
  votes: number
  status: "proposed" | "scheduled"
  time?: string
  location?: string
}

interface SessionState {
  sessions: Session[]
  addSession: (session: Omit<Session, "id" | "votes" | "status">) => void
  upvoteSession: (id: string) => void
  scheduleSession: (sessionId: string, time: string, location: string) => void
}

// Import session data from the JS file
import { useSessionStore as useSessionStoreJs } from "./session-store.js"

// Export the type-safe hook
export const useSessionStore = useSessionStoreJs as unknown as typeof create<SessionState>