import type { DashboardAnalytics } from '../../types/dashboard'

interface AnalyticsStatsProps {
  analytics: DashboardAnalytics
}

export function AnalyticsStats({ analytics }: AnalyticsStatsProps) {
  const stats = [
    { label: 'Total resumes', value: analytics.totalResumes },
    { label: 'Avg ATS score', value: analytics.avgAtsScore ?? '—' },
    { label: 'Saved jobs', value: analytics.savedJobsCount },
    { label: 'Match rate', value: analytics.matchRate !== null ? `${analytics.matchRate}%` : '—' },
    { label: 'Profile views', value: analytics.profileViews },
  ]

  return (
    <div className="analytics-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-box analytics-card">
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </div>
      ))}
    </div>
  )
}
