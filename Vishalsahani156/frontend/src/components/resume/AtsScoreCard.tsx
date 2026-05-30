import type { CSSProperties } from 'react'

interface AtsScoreCardProps {
  score: number
  matchedCount: number
  totalKeywords: number
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 65) return 'Good'
  if (score >= 45) return 'Fair'
  return 'Needs work'
}

function scoreColor(score: number): string {
  if (score >= 80) return '#16a34a'
  if (score >= 65) return '#2563eb'
  if (score >= 45) return '#d97706'
  return '#dc2626'
}

export function AtsScoreCard({ score, matchedCount, totalKeywords }: AtsScoreCardProps) {
  const color = scoreColor(score)

  return (
    <section className="resume-card score-card">
      <h2>ATS Score</h2>
      <div className="score-ring" style={{ '--score-color': color, '--score-percent': `${score}%` } as CSSProperties}>
        <div className="score-value">{score}</div>
        <div className="score-label">{scoreLabel(score)}</div>
      </div>
      <p className="score-detail">
        {matchedCount} of {totalKeywords} job keywords found in your resume
      </p>
    </section>
  )
}
