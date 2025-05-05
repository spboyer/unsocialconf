import SessionCard from "@/components/session-card"

export default function SessionList({ sessions, showVotes = false }) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No sessions found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} showVotes={showVotes} />
      ))}
    </div>
  )
}
