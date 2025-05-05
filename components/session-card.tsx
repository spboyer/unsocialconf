"use client"

import { useState } from "react"
import Link from "next/link"
import { useSessionStore } from "@/lib/session-store"

// Utility functions for track styling
const getTrackColor = (track) => {
  switch (track) {
    case "Development":
      return "primary"
    case "Design":
      return "success"
    case "Product":
      return "info"
    case "Leadership":
      return "warning"
    default:
      return "secondary"
  }
}

const getTrackIcon = (track) => {
  switch (track) {
    case "Development":
      return "fa-code"
    case "Design":
      return "fa-palette"
    case "Product":
      return "fa-chart-line"
    case "Leadership":
      return "fa-users"
    default:
      return "fa-star"
  }
}

export default function SessionCard({ session, showVotes = false }) {
  const { upvoteSession } = useSessionStore()
  const [isUpvoting, setIsUpvoting] = useState(false)

  const handleUpvote = (e) => {
    e.preventDefault()
    e.stopPropagation()

    setIsUpvoting(true)

    // Simulate API call
    setTimeout(() => {
      upvoteSession(session.id)
      setIsUpvoting(false)
    }, 300)
  }

  return (
    <Link href={`/sessions/${session.id}`} className="text-decoration-none">
      <div className="card session-card h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              {session.status === "scheduled" ? (
                <span className="badge gradient-badge me-2">
                  <i className="fas fa-check-circle me-1"></i> Scheduled
                </span>
              ) : (
                <span className="badge bg-light text-dark me-2">
                  <i className="fas fa-hourglass-half me-1"></i> Proposed
                </span>
              )}
              <span className={`badge bg-light track-badge text-${getTrackColor(session.track)}`}>
                <i className={`fas ${getTrackIcon(session.track)} me-1`}></i> {session.track}
              </span>
            </div>
            {showVotes && (
              <button
                className={`btn btn-sm ${isUpvoting ? "btn-secondary" : "btn-outline-primary"}`}
                onClick={handleUpvote}
                disabled={isUpvoting}
              >
                <i className="fas fa-thumbs-up me-1"></i> {session.votes}
              </button>
            )}
          </div>

          <h5 className="card-title mb-1">{session.title}</h5>
          <p className="text-muted small mb-3">
            <i className="fas fa-user me-1"></i> {session.presenter}
          </p>

          <p className="card-text text-muted small mb-3 line-clamp-2" style={{ minHeight: "40px" }}>
            {session.description}
          </p>

          {session.status === "scheduled" && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="time-badge">
                <i className="fas fa-clock me-1"></i> {session.time}
              </span>
              <span className="location-badge">
                <i className="fas fa-map-marker-alt me-1"></i> {session.location}
              </span>
            </div>
          )}
        </div>
        <div className="card-footer bg-white border-top-0">
          <div className="d-flex justify-content-between align-items-center">
            <div className="avatar-stack">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`/placeholder.svg?height=32&width=32`}
                  alt="User"
                  className="rounded-circle"
                  width="24"
                  height="24"
                />
              ))}
              <span className="ms-2 small text-muted">+{session.votes - 3 > 0 ? session.votes - 3 : 0} interested</span>
            </div>
            <i className="fas fa-arrow-right text-primary"></i>
          </div>
        </div>
      </div>
    </Link>
  )
}
