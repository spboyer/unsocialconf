"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import SubmitForm from "@/components/submit-form"
import { useSessionStore } from "@/lib/session-store"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function SubmitPage() {
  const router = useRouter()
  const { addSession } = useSessionStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (sessionData) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      addSession(sessionData)
      setIsSubmitting(false)
      router.push("/")
    }, 800)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="hero-section py-10">
        <div className="container mx-auto px-4 hero-content">
          <div className="text-center">
            <h1 className="display-5 fw-bold mb-2">Submit a Session</h1>
            <p className="lead mb-0">Share your knowledge with the community and help shape our unconference</p>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Link href="/" className="d-inline-flex align-items-center mb-4 text-decoration-none text-muted">
          <i className="fas fa-arrow-left me-2"></i> Back to sessions
        </Link>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-4 p-lg-5">
                <div className="mb-4 text-center">
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle p-3 mb-3">
                    <i className="fas fa-lightbulb fa-2x text-primary"></i>
                  </div>
                  <h2 className="h3 mb-2">Share Your Expertise</h2>
                  <p className="text-muted">
                    All session proposals will be reviewed and may be selected based on community interest.
                  </p>
                </div>

                <SubmitForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mt-4">
              <div className="card-body p-4">
                <h4 className="mb-3">
                  <i className="fas fa-info-circle me-2 text-primary"></i> Submission Tips
                </h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="d-flex">
                      <div className="me-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                          <i className="fas fa-check text-primary"></i>
                        </div>
                      </div>
                      <div>
                        <h5 className="h6 mb-1">Be Specific</h5>
                        <p className="text-muted small mb-0">Clear, focused topics tend to gather more interest</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex">
                      <div className="me-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                          <i className="fas fa-check text-primary"></i>
                        </div>
                      </div>
                      <div>
                        <h5 className="h6 mb-1">Solve Problems</h5>
                        <p className="text-muted small mb-0">Focus on solutions to common challenges</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3 mb-md-0">
                    <div className="d-flex">
                      <div className="me-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                          <i className="fas fa-check text-primary"></i>
                        </div>
                      </div>
                      <div>
                        <h5 className="h6 mb-1">Be Engaging</h5>
                        <p className="text-muted small mb-0">Consider how to make your session interactive</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex">
                      <div className="me-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                          <i className="fas fa-check text-primary"></i>
                        </div>
                      </div>
                      <div>
                        <h5 className="h6 mb-1">Share Knowledge</h5>
                        <p className="text-muted small mb-0">Focus on providing valuable insights</p>
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
