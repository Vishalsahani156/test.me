import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../../context/AuthContext'
import { contactApi } from '../../services/contactApi'
import { ApiError } from '../../services/httpClient'
import {
  CONTACT_PRIORITIES,
  CONTACT_TOPICS,
  type ContactFormPayload,
  type ContactPriority,
  type ContactTopic,
} from '../../types/contact'

interface ContactFormProps {
  variant: 'compact' | 'full'
  idPrefix?: string
  title?: string
  className?: string
}

const MESSAGE_MAX = 1000

export function ContactForm({
  variant,
  idPrefix = 'contact',
  title = 'Send a message',
  className = 'resume-card contact-form auth-form',
}: ContactFormProps) {
  const { user } = useAuth()
  const isFull = variant === 'full'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState<ContactTopic>('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<ContactPriority>('normal')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  function resetForm() {
    if (!user) {
      setName('')
      setEmail('')
    }
    setTopic('general')
    setSubject('')
    setMessage('')
    setPriority('normal')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setSubmitting(true)

    const payload: ContactFormPayload = {
      name,
      email,
      subject,
      message,
      ...(isFull ? { topic, priority } : {}),
    }

    try {
      const result = await contactApi.submitContactForm(payload)
      setSuccess(result.message)
      resetForm()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send message.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={className} noValidate onSubmit={handleSubmit}>
      {title ? <h3>{title}</h3> : null}

      <div className="form-field">
        <label htmlFor={`${idPrefix}-name`}>Name</label>
        <input
          id={`${idPrefix}-name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor={`${idPrefix}-email`}>Email</label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {isFull ? (
        <div className="form-field">
          <label htmlFor={`${idPrefix}-topic`}>Topic</label>
          <select
            id={`${idPrefix}-topic`}
            value={topic}
            onChange={(e) => setTopic(e.target.value as ContactTopic)}
          >
            {CONTACT_TOPICS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="form-field">
        <label htmlFor={`${idPrefix}-subject`}>Subject</label>
        <input
          id={`${idPrefix}-subject`}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="form-field">
        <div className="message-label-row">
          <label htmlFor={`${idPrefix}-message`}>Message</label>
          {isFull ? (
            <span className="char-count">
              {message.length}/{MESSAGE_MAX}
            </span>
          ) : null}
        </div>
        <textarea
          id={`${idPrefix}-message`}
          className="job-description-input"
          rows={isFull ? 6 : 5}
          maxLength={isFull ? MESSAGE_MAX : undefined}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {isFull ? (
        <div className="form-field">
          <label htmlFor={`${idPrefix}-priority`}>Priority</label>
          <select
            id={`${idPrefix}-priority`}
            value={priority}
            onChange={(e) => setPriority(e.target.value as ContactPriority)}
          >
            {CONTACT_PRIORITIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {error ? <div className="form-error">{error}</div> : null}
      {success ? <div className="form-success">{success}</div> : null}

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
