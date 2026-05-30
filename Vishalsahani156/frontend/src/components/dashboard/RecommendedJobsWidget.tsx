import { Link } from 'react-router-dom'
import type { JobRecommendation } from '../../types/jobAlerts'
import { formatSalary } from '../../services/jobAlertsApi'

interface RecommendedJobsWidgetProps {
  jobs: JobRecommendation[]
  savedIds: string[]
  onToggleSave: (jobId: string) => void
}

export function RecommendedJobsWidget({ jobs, savedIds, onToggleSave }: RecommendedJobsWidgetProps) {
  return (
    <section className="resume-card">
      <div className="section-header-row">
        <div>
          <h2>Recommended Jobs</h2>
          <p className="resume-card-subtitle">Top skill-matched roles from Job Alerts.</p>
        </div>
        <Link to="/job-alerts" className="btn-secondary btn-sm btn-link">
          View all
        </Link>
      </div>

      {jobs.length ? (
        <ul className="dashboard-list">
          {jobs.map((job) => (
            <li key={job.id} className="dashboard-job-item">
              <div>
                <strong>{job.title}</strong>
                <span>
                  {job.company} · {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
              </div>
              <div className="dashboard-list-meta">
                <span className={`match-badge${job.matchPercent >= 70 ? ' match-badge--high' : ' match-badge--mid'}`}>
                  {job.matchPercent}%
                </span>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => onToggleSave(job.id)}
                >
                  {savedIds.includes(job.id) ? 'Saved' : 'Save'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-note">Add skills in Job Preferences to see recommendations.</p>
      )}
    </section>
  )
}
