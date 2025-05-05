import Link from "next/link"

export default function AgendaView({ sessions }) {
  const scheduledSessions = sessions.filter((session) => session.status === "scheduled")

  // Group sessions by time slot
  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:15 AM - 11:15 AM",
    "11:30 AM - 12:30 PM",
    "1:30 PM - 2:30 PM",
    "2:45 PM - 3:45 PM",
    "4:00 PM - 5:00 PM",
  ]

  // Group sessions by track
  const tracks = ["Design", "Development", "Product", "Leadership"]

  if (scheduledSessions.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <i className="fas fa-calendar-times fa-4x text-muted"></i>
        </div>
        <h3 className="h4 mb-3">No sessions scheduled yet</h3>
        <p className="text-muted mb-4">Check back later or upvote proposed sessions to help shape the agenda!</p>
        <Link href="/#sessions">
          <button className="btn btn-primary">
            <i className="fas fa-thumbs-up me-2"></i> Vote on Sessions
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <ul className="nav nav-tabs mb-4" id="agendaTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="time-tab"
            data-bs-toggle="tab"
            data-bs-target="#time-tab-pane"
            type="button"
            role="tab"
            aria-controls="time-tab-pane"
            aria-selected="true"
          >
            <i className="fas fa-clock me-2"></i> By Time
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="track-tab"
            data-bs-toggle="tab"
            data-bs-target="#track-tab-pane"
            type="button"
            role="tab"
            aria-controls="track-tab-pane"
            aria-selected="false"
          >
            <i className="fas fa-tags me-2"></i> By Track
          </button>
        </li>
      </ul>

      <div className="tab-content" id="agendaTabsContent">
        <div
          className="tab-pane fade show active"
          id="time-tab-pane"
          role="tabpanel"
          aria-labelledby="time-tab"
          tabIndex="0"
        >
          <div className="timeline">
            {timeSlots.map((timeSlot, index) => {
              const sessionsInSlot = scheduledSessions.filter((s) => s.time === timeSlot)

              if (sessionsInSlot.length === 0) return null

              return (
                <div key={timeSlot} className="mb-5">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary text-white rounded-circle p-2 me-3">
                      <i className="fas fa-clock"></i>
                    </div>
                    <h3 className="h5 mb-0">{timeSlot}</h3>
                  </div>
                  <div className="row g-4">
                    {sessionsInSlot.map((session) => (
                      <div key={session.id} className="col-md-6 col-lg-4">
                        <Link href={`/sessions/${session.id}`} className="text-decoration-none">
                          <div className="card session-card h-100">
                            <div className="card-body">
                              <span className={`badge bg-light track-badge text-${getTrackColor(session.track)} mb-2`}>
                                <i className={`fas ${getTrackIcon(session.track)} me-1`}></i> {session.track}
                              </span>
                              <h5 className="card-title mb-1">{session.title}</h5>
                              <p className="text-muted small mb-3">
                                <i className="fas fa-user me-1"></i> {session.presenter}
                              </p>
                              <div className="d-flex justify-content-between align-items-center mt-3">
                                <span className="location-badge">
                                  <i className="fas fa-map-marker-alt me-1"></i> {session.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="tab-pane fade" id="track-tab-pane" role="tabpanel" aria-labelledby="track-tab" tabIndex="0">
          <div className="row">
            {tracks.map((track) => {
              const sessionsInTrack = scheduledSessions.filter((s) => s.track === track)

              if (sessionsInTrack.length === 0) return null

              return (
                <div key={track} className="col-12 mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className={`bg-${getTrackColor(track)} text-white rounded-circle p-2 me-3`}>
                      <i className={`fas ${getTrackIcon(track)}`}></i>
                    </div>
                    <h3 className="h5 mb-0">{track}</h3>
                  </div>
                  <div className="row g-4">
                    {sessionsInTrack.map((session) => (
                      <div key={session.id} className="col-md-6 col-lg-4">
                        <Link href={`/sessions/${session.id}`} className="text-decoration-none">
                          <div className="card session-card h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-center mb-2">
                                <span className="time-badge">
                                  <i className="fas fa-clock me-1"></i> {session.time}
                                </span>
                              </div>
                              <h5 className="card-title mb-1">{session.title}</h5>
                              <p className="text-muted small mb-3">
                                <i className="fas fa-user me-1"></i> {session.presenter}
                              </p>
                              <div className="d-flex justify-content-between align-items-center mt-3">
                                <span className="location-badge">
                                  <i className="fas fa-map-marker-alt me-1"></i> {session.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
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
