import { useEffect, useState } from 'react'
import { adminApi } from '../../services/adminApi'
import type { AdminStats } from '../../types/admin'

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    adminApi
      .getStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load stats'))
  }, [])

  return (
    <div>
      <div className="page-header">
        <h2>Admin Overview</h2>
        <p className="resume-card-subtitle">Platform metrics from the live database.</p>
      </div>

      {error ? <div className="form-error">{error}</div> : null}

      {stats ? (
        <div className="admin-stats-grid">
          <div className="stat-box analytics-card">
            <span>Users</span>
            <strong>{stats.users}</strong>
          </div>
          <div className="stat-box analytics-card">
            <span>Jobs</span>
            <strong>{stats.jobs}</strong>
          </div>
          <div className="stat-box analytics-card">
            <span>Blog posts</span>
            <strong>{stats.posts}</strong>
          </div>
          <div className="stat-box analytics-card">
            <span>Messages</span>
            <strong>{stats.messages}</strong>
          </div>
        </div>
      ) : (
        <p className="loading-text">Loading stats…</p>
      )}
    </div>
  )
}
