"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FaStar } from "react-icons/fa"
// Import the AI suggestion function
import { getAISessionSuggestion } from "@/lib/ai-session-suggest"

export default function SubmitForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: "",
    presenter: "",
    track: "",
    description: "",
  })

  const [errors, setErrors] = useState({})
  const [isAISuggesting, setIsAISuggesting] = useState(false)

  // AI Suggestion handler
  const handleAISuggest = async () => {
    setIsAISuggesting(true)
    try {
      const suggestion = await getAISessionSuggestion(formData)
      setFormData((prev) => ({
        ...prev,
        title: suggestion.title || prev.title,
        description: suggestion.description || prev.description,
      }))
    } catch (e) {
      // Optionally show a toast or error
      // eslint-disable-next-line no-console
      console.error("AI suggestion failed", e)
    } finally {
      setIsAISuggesting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.presenter.trim()) {
      newErrors.presenter = "Presenter name is required"
    }

    if (!formData.track) {
      newErrors.track = "Track is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Generate a unique ID and add default values
    const sessionData = {
      ...formData,
      id: Date.now().toString(),
      votes: 1,
      status: "proposed",
      time: null,
      location: null,
    }

    onSubmit(sessionData)
  }

  return (
    <form onSubmit={handleSubmit} className="needs-validation">
      <div className="d-flex justify-content-end mb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAISuggest}
          disabled={isAISuggesting || isSubmitting}
          title="Suggest title & description with AI"
        >
          <FaStar className="me-2 text-warning" />
          {isAISuggesting ? "Suggesting..." : "AI Suggest"}
        </Button>
      </div>
      <div className="mb-4">
        <label htmlFor="title" className="form-label fw-medium">
          <i className="fas fa-heading me-2 text-primary"></i>Session Title
        </label>
        <input
          type="text"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter a descriptive title for your session"
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      <div className="mb-4">
        <label htmlFor="presenter" className="form-label fw-medium">
          <i className="fas fa-user me-2 text-primary"></i>Presenter Name
        </label>
        <input
          type="text"
          className={`form-control ${errors.presenter ? "is-invalid" : ""}`}
          id="presenter"
          name="presenter"
          value={formData.presenter}
          onChange={handleChange}
          placeholder="Your name"
        />
        {errors.presenter && <div className="invalid-feedback">{errors.presenter}</div>}
      </div>

      <div className="mb-4">
        <label htmlFor="track" className="form-label fw-medium">
          <i className="fas fa-tag me-2 text-primary"></i>Track
        </label>
        <select
          className={`form-select ${errors.track ? "is-invalid" : ""}`}
          id="track"
          name="track"
          value={formData.track}
          onChange={handleChange}
        >
          <option value="">Select a track</option>
          <option value="Design">Design</option>
          <option value="Development">Development</option>
          <option value="Product">Product</option>
          <option value="Leadership">Leadership</option>
        </select>
        {errors.track && <div className="invalid-feedback">{errors.track}</div>}
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="form-label fw-medium">
          <i className="fas fa-align-left me-2 text-primary"></i>Description
        </label>
        <textarea
          className={`form-control ${errors.description ? "is-invalid" : ""}`}
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what your session will cover and why people should attend"
          rows={5}
        ></textarea>
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
      </div>

      <button type="submit" className="btn btn-gradient w-100 py-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Submitting...
          </>
        ) : (
          <>
            <i className="fas fa-paper-plane me-2"></i> Submit Session
          </>
        )}
      </button>
    </form>
  )
}
