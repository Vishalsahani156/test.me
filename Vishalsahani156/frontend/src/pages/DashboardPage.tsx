import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { AnalyticsStats } from '../components/dashboard/AnalyticsStats'
import { AtsScoreOverview } from '../components/dashboard/AtsScoreOverview'
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed'
import { RecommendedJobsWidget } from '../components/dashboard/RecommendedJobsWidget'
import { UploadedResumesWidget } from '../components/dashboard/UploadedResumesWidget'
import { dashboardApi } from '../services/dashboardApi'
import { jobAlertsApi } from '../services/jobAlertsApi'
import type { DashboardData } from '../types/dashboard'

export function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [dashboard, ids] = await Promise.all([
        dashboardApi.getDashboardData(),
        jobAlertsApi.getSavedJobIds(),
      ])
      setData(dashboard)
      setSavedIds(ids)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  async function handleToggleSave(jobId: string) {
    await dashboardApi.toggleSaveJob(jobId)
    await loadDashboard()
  }

  return (
    <main className="dashboard-main">
      <div className="dashboard-welcome">
        <h2>Welcome back, {user?.name ?? 'there'}</h2>
        <p className="resume-card-subtitle">Your career dashboard at a glance.</p>
      </div>

      {loading ? <p className="loading-text">Loading dashboard…</p> : null}
      {error ? <div className="form-error">{error}</div> : null}

      {data && !loading ? (
        <div className="dashboard-grid">
          <AnalyticsStats analytics={data.analytics} />
          <AtsScoreOverview overview={data.atsOverview} />

          <div className="dashboard-two-col">
            <UploadedResumesWidget versions={data.recentVersions} />
            <RecommendedJobsWidget
              jobs={data.recommendedJobs}
              savedIds={savedIds}
              onToggleSave={handleToggleSave}
            />
          </div>

          <RecentActivityFeed activities={data.activities} />
        </div>
      ) : null}
    </main>
  )
}
