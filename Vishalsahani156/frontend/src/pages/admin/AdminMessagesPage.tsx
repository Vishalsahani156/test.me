import { useCallback, useEffect, useState } from 'react'
import { adminApi } from '../../services/adminApi'
import type { AdminMessage } from '../../types/admin'

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadMessages = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setMessages(await adminApi.getMessages())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadMessages()
  }, [loadMessages])

  async function handleDelete(messageId: string) {
    if (!window.confirm('Delete this message?')) return
    try {
      await adminApi.deleteMessage(messageId)
      await loadMessages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Contact Messages</h2>
      </div>
      {error ? <div className="form-error">{error}</div> : null}
      {loading ? <p className="loading-text">Loading messages…</p> : null}

      {!loading ? (
        <div className="admin-message-list">
          {messages.map((message) => (
            <article key={message.id} className="resume-card admin-message-card">
              <div className="admin-message-head">
                <div>
                  <strong>{message.subject}</strong>
                  <p className="resume-card-subtitle">
                    {message.name} · {message.email} · Ticket {message.ticketId}
                  </p>
                </div>
                <button type="button" className="btn-danger btn-sm" onClick={() => void handleDelete(message.id)}>
                  Delete
                </button>
              </div>
              <p>{message.message}</p>
              <div className="blog-card-meta">
                <span>{new Date(message.createdAt).toLocaleString()}</span>
                {message.topic ? <span>Topic: {message.topic}</span> : null}
                {message.priority ? <span>Priority: {message.priority}</span> : null}
              </div>
            </article>
          ))}
          {messages.length === 0 ? <p className="empty-note">No contact messages yet.</p> : null}
        </div>
      ) : null}
    </div>
  )
}
