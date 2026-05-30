import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { FormError } from '../components/auth/FormError'
import { useAuth } from '../context/AuthContext'
import { AuthApiError } from '../services/authApi'

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setSubmitting(true)

    try {
      const message = await forgotPassword({ email })
      setSuccess(message)
      setEmail('')
    } catch (err) {
      setError(err instanceof AuthApiError ? err.message : 'Unable to send reset email')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we will send you a reset link."
    >
      <FormError message={error} />

      {success ? (
        <div className="form-success" role="status">
          {success}
        </div>
      ) : null}

      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p className="auth-footer">
        Remember your password? <Link to="/login">Back to sign in</Link>
      </p>
    </AuthLayout>
  )
}
