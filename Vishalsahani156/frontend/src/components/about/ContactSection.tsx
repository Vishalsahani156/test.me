import { useState, type FormEvent } from 'react'
import type { ContactInfo } from '../../types/about'
import { aboutApi } from '../../services/aboutApi'

interface ContactSectionProps {
  contact: ContactInfo
}

export function ContactSection({ contact }: ContactSectionProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setSubmitting(true)

    try {
      const result = await aboutApi.submitContactForm({ name, email, subject, message })
      setSuccess(result.message)
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="about-section">
      <h2>Contact Us</h2>
      <p className="about-section-lead">Questions, feedback, or partnership inquiries—we would love to hear from you.</p>

      <div className="contact-grid">
        <div className="contact-info-cards">
          <div className="contact-info-card">
            <strong>Email</strong>
            <span>{contact.email}</span>
          </div>
          <div className="contact-info-card">
            <strong>Phone</strong>
            <span>{contact.phone}</span>
          </div>
          <div className="contact-info-card">
            <strong>Address</strong>
            <span>{contact.address}</span>
          </div>
          <div className="contact-info-card">
            <strong>Hours</strong>
            <span>{contact.hours}</span>
          </div>
        </div>

        <form className="resume-card contact-form auth-form" onSubmit={handleSubmit}>
          <h3>Send a message</h3>

          <div className="form-field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              className="job-description-input"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          {error ? <div className="form-error">{error}</div> : null}
          {success ? <div className="form-success">{success}</div> : null}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  )
}
