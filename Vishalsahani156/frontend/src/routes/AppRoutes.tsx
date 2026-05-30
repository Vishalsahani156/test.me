import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SIGNUP_ENABLED } from '../config/features'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { AboutPage } from '../pages/AboutPage'
import { BlogCategoryPage } from '../pages/BlogCategoryPage'
import { BlogDetailPage } from '../pages/BlogDetailPage'
import { BlogListPage } from '../pages/BlogListPage'
import { DashboardPage } from '../pages/DashboardPage'
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
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/resume-checker" element={<ResumeCheckerPage />} />
        <Route path="/resume-manager" element={<ResumeManagerPage />} />
        <Route path="/resume-manager/:resumeId" element={<ResumeManagerDetailPage />} />
        <Route path="/job-alerts" element={<JobAlertsPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/category/:slug" element={<BlogCategoryPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
      </Route>

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
      <Route path="/about" element={<AboutPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
