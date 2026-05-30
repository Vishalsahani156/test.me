import { Link } from 'react-router-dom'
import type { DashboardActivity } from '../../types/dashboard'

interface RecentActivityFeedProps {
  activities: DashboardActivity[]
}

const TYPE_LABELS: Record<DashboardActivity['type'], string> = {
  upload: 'Upload',
  score_change: 'Score',
  activation: 'Active',
  deletion: 'Deleted',
  job_saved: 'Saved job',
  job_unsaved: 'Unsaved',
  preferences_updated: 'Preferences',
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  return (
    <section className="resume-card">
      <h2>Recent Activity</h2>
      <p className="resume-card-subtitle">
        Uploads, score changes, saved jobs, and preference updates in one feed.
      </p>

      {activities.length ? (
        <ol className="activity-feed">
          {activities.map((item) => (
            <li key={item.id} className={`activity-item activity-item--${item.type}`}>
              <span className="activity-type">{TYPE_LABELS[item.type]}</span>
              <div className="activity-body">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time>
              </div>
              {item.link ? (
                <Link to={item.link} className="activity-link">
                  View
                </Link>
              ) : null}
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty-note">Activity will appear as you use Resume Manager and Job Alerts.</p>
      )}
    </section>
  )
}
