import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AUTH_BYPASS_FOR_TESTING, SIGNUP_ENABLED } from '../config/features'
import { AuthLayout } from '../components/auth/AuthLayout'
import { FormError } from '../components/auth/FormError'
import { PasswordInput } from '../components/auth/PasswordInput'
import { useAuth } from '../context/AuthContext'
import { AuthApiError } from '../services/authApi'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof AuthApiError ? err.message : 'Unable to sign in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle={
        AUTH_BYPASS_FOR_TESTING
          ? 'Auth validation is off for feature testing. Use any email/password or click below.'
          : 'Welcome back. Enter your credentials to continue.'
      }
    >
      <FormError message={error} />

      {AUTH_BYPASS_FOR_TESTING ? (
        <div className="form-success" style={{ marginBottom: '1rem' }}>
          Demo mode: backend auth is bypassed. Signup is disabled.
        </div>
      ) : null}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="any email works in demo mode"
          />
        </div>

        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {!AUTH_BYPASS_FOR_TESTING ? (
          <div className="form-actions">
            <Link to="/forgot-password" className="text-link">
              Forgot password?
            </Link>
          </div>
        ) : null}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Signing in…' : AUTH_BYPASS_FOR_TESTING ? 'Continue to app' : 'Sign in'}
        </button>
      </form>

      {SIGNUP_ENABLED ? (
        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      ) : (
        <p className="auth-footer">Signup is temporarily disabled for feature testing.</p>
      )}

      <p className="auth-footer">
        <Link to="/about">About Career Toolkit</Link>
      </p>
    </AuthLayout>
  )
}
