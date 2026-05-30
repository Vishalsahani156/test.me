import { useState, type FormEvent } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { FormError } from '../components/auth/FormError'
import { PasswordInput } from '../components/auth/PasswordInput'
import { useAuth } from '../context/AuthContext'
import { AuthApiError } from '../services/authApi'

export function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!token) {
    return <Navigate to="/forgot-password" replace />
  }

  if (success) {
    return (
      <AuthLayout title="Password updated" subtitle="You can now sign in with your new password.">
        <div className="form-success" role="status">
          Your password has been reset successfully.
        </div>
        <p className="auth-footer">
          <Link to="/login">Go to sign in</Link>
        </p>
      </AuthLayout>
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await resetPassword({ token, password })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof AuthApiError ? err.message : 'Unable to reset password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Reset password" subtitle="Choose a new password for your account.">
      <FormError message={error} />

      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        <PasswordInput
          id="password"
          label="New password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </form>

      <p className="auth-footer">
        <Link to="/login">Back to sign in</Link>
      </p>
    </AuthLayout>
  )
}
