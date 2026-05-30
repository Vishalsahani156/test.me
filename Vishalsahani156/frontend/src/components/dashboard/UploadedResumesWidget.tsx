import { Link } from 'react-router-dom'
import type { DashboardResumeItem } from '../../types/dashboard'

interface UploadedResumesWidgetProps {
  versions: DashboardResumeItem[]
}

export function UploadedResumesWidget({ versions }: UploadedResumesWidgetProps) {
  return (
    <section className="resume-card">
      <div className="section-header-row">
        <div>
          <h2>Uploaded Resumes</h2>
          <p className="resume-card-subtitle">Latest 5 versions from Resume Manager.</p>
        </div>
        <Link to="/resume-manager" className="btn-secondary btn-sm btn-link">
          View all
        </Link>
      </div>

      {versions.length ? (
        <ul className="dashboard-list">
          {versions.map((item) => (
            <li key={item.versionId}>
              <Link to={`/resume-manager/${item.resumeId}`} className="dashboard-list-item">
                <div>
                  <strong>
                    {item.resumeTitle} · v{item.versionNumber}
                    {item.isActive ? ' (active)' : ''}
                  </strong>
                  <span>{item.fileName}</span>
                </div>
                <div className="dashboard-list-meta">
                  {item.atsScore !== null ? (
                    <span className="score-badge score-badge--mid">ATS {item.atsScore}</span>
                  ) : (
                    <span className="score-badge score-badge--none">No score</span>
                  )}
                  <time dateTime={item.createdAt}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-note">No resume versions yet.</p>
      )}
    </section>
  )
}
