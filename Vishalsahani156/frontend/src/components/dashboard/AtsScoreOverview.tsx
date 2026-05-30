import { Link } from 'react-router-dom'
import type { DashboardAtsOverview } from '../../types/dashboard'

interface AtsScoreOverviewProps {
  overview: DashboardAtsOverview
}

export function AtsScoreOverview({ overview }: AtsScoreOverviewProps) {
  const { currentScore, delta, sparkline, activeResumeId, activeVersionId, resumeTitle, versionLabel } =
    overview

  const width = 200
  const height = 48
  const pad = 4
  const chartW = width - pad * 2
  const chartH = height - pad * 2

  const points =
    sparkline.length > 0
      ? sparkline.map((score, i) => {
          const x = pad + (sparkline.length === 1 ? chartW / 2 : (i / (sparkline.length - 1)) * chartW)
          const y = pad + chartH - (score / 100) * chartH
          return `${x},${y}`
        }).join(' ')
      : ''

  const checkerLink =
    activeResumeId && activeVersionId
      ? `/resume-checker?resumeId=${activeResumeId}&versionId=${activeVersionId}`
      : '/resume-checker'

  return (
    <section className="resume-card ats-overview">
      <div className="section-header-row">
        <div>
          <h2>ATS Score Overview</h2>
          <p className="resume-card-subtitle">{resumeTitle}{versionLabel ? ` · ${versionLabel}` : ''}</p>
        </div>
        <Link to={checkerLink} className="btn-secondary btn-sm btn-link">
          Open ATS Checker
        </Link>
      </div>

      <div className="ats-overview-body">
        <div className="ats-gauge">
          <div className="ats-gauge-value">{currentScore ?? '—'}</div>
          <div className="ats-gauge-label">Active score</div>
          {delta !== null ? (
            <div className={`ats-delta${delta >= 0 ? ' ats-delta--up' : ' ats-delta--down'}`}>
              {delta >= 0 ? '+' : ''}
              {delta} vs last version
            </div>
          ) : (
            <div className="ats-delta">No previous score</div>
          )}
        </div>

        {sparkline.length > 1 ? (
          <svg viewBox={`0 0 ${width} ${height}`} className="sparkline" aria-hidden="true">
            <polyline points={points} className="sparkline-line" fill="none" />
          </svg>
        ) : (
          <p className="empty-note">Upload more versions to see score trends.</p>
        )}
      </div>
    </section>
  )
}
