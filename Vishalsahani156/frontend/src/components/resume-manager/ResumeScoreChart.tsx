import type { ResumeVersion, ScoreStats } from '../../types/resumeManager'

interface ResumeScoreChartProps {
  versions: ResumeVersion[]
  stats: ScoreStats
}

export function ResumeScoreChart({ versions, stats }: ResumeScoreChartProps) {
  const scored = [...versions]
    .filter((v) => v.atsScore !== null)
    .sort((a, b) => a.versionNumber - b.versionNumber)

  const width = 560
  const height = 220
  const padX = 40
  const padY = 30
  const chartW = width - padX * 2
  const chartH = height - padY * 2

  const points = scored.map((v, i) => {
    const x = padX + (scored.length === 1 ? chartW / 2 : (i / (scored.length - 1)) * chartW)
    const y = padY + chartH - ((v.atsScore ?? 0) / 100) * chartH
    return { x, y, version: v }
  })

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <section className="resume-card score-chart-section">
      <h2>Resume Score Tracking</h2>
      <p className="resume-card-subtitle">ATS scores across versions over time.</p>

      <div className="score-stats-row">
        <div className="stat-box">
          <span>Current</span>
          <strong>{stats.current ?? '—'}</strong>
        </div>
        <div className="stat-box">
          <span>Best</span>
          <strong>{stats.best ?? '—'}</strong>
        </div>
        <div className="stat-box">
          <span>Average</span>
          <strong>{stats.average ?? '—'}</strong>
        </div>
      </div>

      {points.length ? (
        <svg viewBox={`0 0 ${width} ${height}`} className="score-chart" role="img" aria-label="ATS score line chart">
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = padY + chartH - (tick / 100) * chartH
            return (
              <g key={tick}>
                <line x1={padX} y1={y} x2={width - padX} y2={y} className="chart-grid-line" />
                <text x={8} y={y + 4} className="chart-axis-label">
                  {tick}
                </text>
              </g>
            )
          })}

          {points.length > 1 ? (
            <polyline points={polyline} className="chart-line" fill="none" />
          ) : null}

          {points.map((p) => (
            <g key={p.version.id}>
              <circle cx={p.x} cy={p.y} r={5} className="chart-point" />
              <text x={p.x} y={height - 8} textAnchor="middle" className="chart-axis-label">
                v{p.version.versionNumber}
              </text>
            </g>
          ))}
        </svg>
      ) : (
        <p className="empty-note">Run ATS checks on versions to populate the score chart.</p>
      )}
    </section>
  )
}
