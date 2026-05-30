import { Link } from 'react-router-dom'
import { resumeManagerApi } from '../../services/resumeManagerApi'
import type { ResumeVersion } from '../../types/resumeManager'

interface ResumeVersionCardProps {
  resumeId: string
  version: ResumeVersion
  onSetActive: (versionId: string) => void
  onDelete: (versionId: string) => void
  busy?: boolean
}

function scoreBadgeClass(score: number | null): string {
  if (score === null) return 'score-badge score-badge--none'
  if (score >= 80) return 'score-badge score-badge--high'
  if (score >= 65) return 'score-badge score-badge--mid'
  return 'score-badge score-badge--low'
}

export function ResumeVersionCard({
  resumeId,
  version,
  onSetActive,
  onDelete,
  busy,
}: ResumeVersionCardProps) {
  return (
    <article className={`version-card${version.isActive ? ' version-card--active' : ''}`}>
      <div className="version-card-header">
        <div>
          <h3>v{version.versionNumber}</h3>
          <p className="version-label">{version.label}</p>
        </div>
        <div className="version-badges">
          {version.isActive ? <span className="active-badge">Active</span> : null}
          <span className={scoreBadgeClass(version.atsScore)}>
            {version.atsScore !== null ? `ATS ${version.atsScore}` : 'No score'}
          </span>
        </div>
      </div>

      <ul className="version-meta">
        <li>{version.fileName}</li>
        <li>{version.fileType.toUpperCase()} · {Math.round(version.fileSize / 1024)} KB</li>
        <li>{new Date(version.createdAt).toLocaleDateString()}</li>
      </ul>

      {version.notes ? <p className="version-notes">{version.notes}</p> : null}

      <div className="version-actions">
        <button
          type="button"
          className="btn-secondary btn-sm"
          disabled={busy || version.isActive}
          onClick={() => onSetActive(version.id)}
        >
          Set active
        </button>
        <button
          type="button"
          className="btn-secondary btn-sm"
          disabled={busy}
          onClick={() => resumeManagerApi.downloadVersionContent(version)}
        >
          Download
        </button>
        <Link
          className="btn-secondary btn-sm btn-link"
          to={`/resume-checker?resumeId=${resumeId}&versionId=${version.id}`}
        >
          Run ATS check
        </Link>
        <button
          type="button"
          className="btn-danger btn-sm"
          disabled={busy}
          onClick={() => onDelete(version.id)}
        >
          Delete
        </button>
      </div>
    </article>
  )
}
