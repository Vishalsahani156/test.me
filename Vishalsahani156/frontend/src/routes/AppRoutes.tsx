import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SIGNUP_ENABLED } from '../config/features'
import { useAuth } from '../context/AuthContext'
import { BlogCategoryPage } from '../pages/BlogCategoryPage'
import { BlogDetailPage } from '../pages/BlogDetailPage'
import { BlogListPage } from '../pages/BlogListPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { JobAlertsPage } from '../pages/JobAlertsPage'
import { LoginPage } from '../pages/LoginPage'
import { ResetPasswordPage } from '../pages/ResetPasswordPage'
import { ResumeCheckerPage } from '../pages/ResumeCheckerPage'
import { ResumeManagerDetailPage } from '../pages/ResumeManagerDetailPage'
import { ResumeManagerPage } from '../pages/ResumeManagerPage'
import { SignupPage } from '../pages/SignupPage'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="auth-page">
        <p className="loading-text">Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="auth-page">
        <p className="loading-text">Loading…</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/resume-checker" replace />
  }

  return children
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/resume-checker" replace />} />
      <Route
        path="/resume-checker"
        element={
          <ProtectedRoute>
            <ResumeCheckerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-manager"
        element={
          <ProtectedRoute>
            <ResumeManagerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-manager/:resumeId"
        element={
          <ProtectedRoute>
            <ResumeManagerDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-alerts"
        element={
          <ProtectedRoute>
            <JobAlertsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blog"
        element={
          <ProtectedRoute>
            <BlogListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blog/category/:slug"
        element={
          <ProtectedRoute>
            <BlogCategoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blog/:slug"
        element={
          <ProtectedRoute>
            <BlogDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          SIGNUP_ENABLED ? (
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<Navigate to="/resume-checker" replace />} />
    </Routes>
  )
}
