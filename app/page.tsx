"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import AgendaView from "@/components/agenda-view"
import SessionList from "@/components/session-list"
import { useSessionStore } from "@/lib/session-store"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function HomePage() {
  const { sessions } = useSessionStore()
  const [activeTab, setActiveTab] = useState("popular")

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section py-16 md:py-24">
        <div className="container mx-auto px-4 hero-content">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">Unconference 2025</h1>
              <p className="lead mb-4">
                Join our community-driven unconference where the agenda is created by participants. Vote for sessions
                you'd like to attend or submit your own session idea!
              </p>
              <div className="d-flex gap-3">
                <Link href="/submit">
                  <button className="btn btn-gradient btn-lg">
                    <i className="fas fa-plus-circle me-2"></i> Submit Session
                  </button>
                </Link>
                <a href="#sessions" className="btn btn-outline-light btn-lg">
                  <i className="fas fa-calendar-alt me-2"></i> View Schedule
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <img
                  src="/main-box-unconference.png?height=400&width=600"
                  alt="Unconference"
                  className="img-fluid rounded-4 shadow-lg"
                />
                <div className="position-absolute top-0 end-0 bg-white p-3 rounded-4 shadow-lg m-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary rounded-circle p-2 me-2">
                      <i className="fas fa-users text-white"></i>
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold session-count">{sessions.length}</h5>
                      <p className="mb-0 small session-count">Sessions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-8" id="sessions">
        <div className="mb-8 text-center">
          <span className="badge bg-primary-subtle text-primary mb-2">
            <i className="fas fa-star me-1"></i> Discover
          </span>
          <h2 className="display-6 fw-bold mb-3">Explore Sessions</h2>
          <p className="text-muted-foreground mx-auto" style={{ maxWidth: "700px" }}>
            Browse through our community-submitted sessions, vote for your favorites, and help shape the unconference
            agenda.
          </p>
        </div>

        <Tabs defaultValue="popular" className="mb-8" onValueChange={setActiveTab}>
          <div className="d-flex justify-content-center mb-4">
            <TabsList>
              <TabsTrigger value="popular">
                <i className="fas fa-fire me-2"></i> Popular Sessions
              </TabsTrigger>
              <TabsTrigger value="agenda">
                <i className="fas fa-calendar-day me-2"></i> Today's Agenda
              </TabsTrigger>
              <TabsTrigger value="all">
                <i className="fas fa-list me-2"></i> All Sessions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="popular">
            <SessionList sessions={[...sessions].sort((a, b) => b.votes - a.votes).slice(0, 6)} showVotes={true} />
          </TabsContent>
          <TabsContent value="agenda">
            <AgendaView sessions={sessions} />
          </TabsContent>
          <TabsContent value="all">
            <SessionList sessions={sessions} showVotes={true} />
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="card bg-primary text-white p-4 mt-12 rounded-4">
          <div className="card-body text-center py-5">
            <h3 className="card-title mb-3">Have a great idea to share?</h3>
            <p className="card-text mb-4">
              Submit your session proposal and contribute to our community-driven unconference.
            </p>
            <Link href="/submit">
              <button className="btn btn-light btn-lg">
                <i className="fas fa-lightbulb me-2"></i> Submit Your Session
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
