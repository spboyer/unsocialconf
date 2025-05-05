"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useSessionStore } from "@/lib/session-store"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()
  const { sessions, upvoteSession } = useSessionStore()
  const [session, setSession] = useState(null)
  const [isUpvoting, setIsUpvoting] = useState(false)

  useEffect(() => {
    if (params.id) {
      const foundSession = sessions.find((s) => s.id === params.id)
      if (foundSession) {
        setSession(foundSession)
      } else {
        router.push("/")
      }
    }
  }, [params.id, sessions, router])

  const handleUpvote = () => {
    if (!session) return

    setIsUpvoting(true)

    // Simulate API call
    setTimeout(() => {
      upvoteSession(session.id)
      setIsUpvoting(false)
    }, 300)
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow d-flex align-items-center justify-content-center">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading session details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Link href="/" className="d-inline-flex align-items-center mb-4 text-decoration-none text-muted">
          <i className="fas fa-arrow-left me-2"></i> Back to sessions
        </Link>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="card-header bg-primary text-white p-4">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  {session.status === "scheduled" ? (
                    <span className="badge bg-white text-primary">
                      <i className="fas fa-check-circle me-1"></i> Scheduled
                    </span>
                  ) : (
                    <span className="badge bg-white text-dark">
                      <i className="fas fa-hourglass-half me-1"></i> Proposed
                    </span>
                  )}
                  <span className={`badge bg-white text-${getTrackColor(session.track)}`}>
                    <i className={`fas ${getTrackIcon(session.track)} me-1`}></i> {session.track}
                  </span>
                </div>
                <h1 className="h3 mb-2">{session.title}</h1>
                <p className="mb-0 text-white-50">
                  <i className="fas fa-user me-1"></i> Presented by {session.presenter}
                </p>
              </div>
              <button
                className={`btn ${isUpvoting ? "btn-light" : "btn-outline-light"}`}
                onClick={handleUpvote}
                disabled={isUpvoting}
              >
                <i className="fas fa-thumbs-up me-2"></i>
                <span className="fw-bold">{session.votes}</span> Votes
              </button>
            </div>
          </div>

          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-8 mb-4 mb-lg-0">
                <h4 className="mb-3">
                  <i className="fas fa-info-circle me-2 text-primary"></i> About this session
                </h4>
                <p className="text-muted">{session.description}</p>

                <div className="mt-4">
                  <h4 className="mb-3">
                    <i className="fas fa-users me-2 text-primary"></i> Who should attend
                  </h4>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item bg-light rounded-3 mb-2 border-0">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      Developers interested in {session.track.toLowerCase()} best practices
                    </li>
                    <li className="list-group-item bg-light rounded-3 mb-2 border-0">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      Team leads looking to improve their {session.track.toLowerCase()} processes
                    </li>
                    <li className="list-group-item bg-light rounded-3 border-0">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      Anyone curious about the latest trends in {session.track.toLowerCase()}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card bg-light border-0 rounded-4">
                  <div className="card-body">
                    {session.status === "scheduled" ? (
                      <>
                        <h4 className="mb-4 text-center">Session Details</h4>

                        <div className="mb-4">
                          <div className="d-flex align-items-center mb-2">
                            <div className="bg-primary text-white rounded-circle p-2 me-3">
                              <i className="fas fa-calendar-day"></i>
                            </div>
                            <h5 className="mb-0">Date</h5>
                          </div>
                          <p className="ms-5 mb-0 text-muted">May 15, 2025</p>
                        </div>

                        <div className="mb-4">
                          <div className="d-flex align-items-center mb-2">
                            <div className="bg-primary text-white rounded-circle p-2 me-3">
                              <i className="fas fa-clock"></i>
                            </div>
                            <h5 className="mb-0">Time</h5>
                          </div>
                          <p className="ms-5 mb-0 text-muted">{session.time}</p>
                        </div>

                        <div className="mb-4">
                          <div className="d-flex align-items-center mb-2">
                            <div className="bg-primary text-white rounded-circle p-2 me-3">
                              <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <h5 className="mb-0">Location</h5>
                          </div>
                          <p className="ms-5 mb-0 text-muted">{session.location}</p>
                        </div>

                        <button className="btn btn-gradient w-100">
                          <i className="fas fa-calendar-plus me-2"></i> Add to Calendar
                        </button>
                      </>
                    ) : (
                      <>
                        <h4 className="mb-3 text-center">Proposed Session</h4>
                        <div className="text-center mb-4">
                          <i className="fas fa-hourglass-half fa-3x text-muted mb-3"></i>
                          <p className="text-muted">This session is not yet scheduled. Upvote to show your interest!</p>
                        </div>
                        <div className="progress mb-3" style={{ height: "10px" }}>
                          <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: `${Math.min(session.votes * 5, 100)}%` }}
                            aria-valuenow={session.votes}
                            aria-valuemin="0"
                            aria-valuemax="20"
                          ></div>
                        </div>
                        <p className="text-center text-muted small mb-4">
                          {session.votes} of 20 votes needed to be considered for scheduling
                        </p>
                        <button className="btn btn-gradient w-100" onClick={handleUpvote} disabled={isUpvoting}>
                          {isUpvoting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Upvoting...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-thumbs-up me-2"></i> Upvote This Session
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="card border-0 rounded-4 mt-4">
                  <div className="card-body">
                    <h5 className="mb-3">
                      <i className="fas fa-users me-2 text-primary"></i> Interested Attendees
                    </h5>
                    <div className="d-flex mb-3">
                      {[1, 2, 3, 4].map((i) => (
                        <img
                          key={i}
                          src={`/placeholder.svg?height=40&width=40`}
                          alt="User"
                          className="rounded-circle border border-2 border-white"
                          width="40"
                          height="40"
                          style={{ marginLeft: i > 1 ? "-10px" : "0" }}
                        />
                      ))}
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle bg-light text-muted"
                        style={{ width: "40px", height: "40px", marginLeft: "-10px" }}
                      >
                        +{session.votes - 4 > 0 ? session.votes - 4 : 0}
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <i className="fas fa-share-alt fa-lg text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Share this session</h6>
                        <div className="d-flex gap-2">
                          <a href="#" className="text-muted">
                            <i className="fab fa-twitter"></i>
                          </a>
                          <a href="#" className="text-muted">
                            <i className="fab fa-facebook"></i>
                          </a>
                          <a href="#" className="text-muted">
                            <i className="fab fa-linkedin"></i>
                          </a>
                          <a href="#" className="text-muted">
                            <i className="fas fa-envelope"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Helper functions for track colors and icons
function getTrackColor(track) {
  switch (track) {
    case "Design":
      return "primary"
    case "Development":
      return "success"
    case "Product":
      return "warning"
    case "Leadership":
      return "info"
    default:
      return "secondary"
  }
}

function getTrackIcon(track) {
  switch (track) {
    case "Design":
      return "fa-palette"
    case "Development":
      return "fa-code"
    case "Product":
      return "fa-lightbulb"
    case "Leadership":
      return "fa-users"
    default:
      return "fa-tag"
  }
}
