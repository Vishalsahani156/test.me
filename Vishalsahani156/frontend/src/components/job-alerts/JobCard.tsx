import type { JobListing, JobRecommendation } from '../../types/jobAlerts'
import { formatSalary } from '../../services/jobAlertsApi'

interface JobCardProps {
  job: JobListing | JobRecommendation
  saved: boolean
  onToggleSave: (jobId: string) => void
  showMatch?: boolean
}

export function JobCard({ job, saved, onToggleSave, showMatch = false }: JobCardProps) {
  const match = 'matchPercent' in job ? job.matchPercent : null
  const matchedSkills = 'matchedSkills' in job ? job.matchedSkills : []

  return (
    <article className="job-card">
      <div className="job-card-header">
        <div>
          <h3>{job.title}</h3>
          <p className="job-company">{job.company}</p>
        </div>
        {showMatch && match !== null ? (
          <span className={`match-badge${match >= 70 ? ' match-badge--high' : match >= 50 ? ' match-badge--mid' : ''}`}>
            {match}% match
          </span>
        ) : null}
      </div>

      <ul className="job-meta">
        <li>{job.location}</li>
        <li>{job.remote ? 'Remote OK' : 'On-site'}</li>
        <li>{formatSalary(job.salaryMin, job.salaryMax)}</li>
        <li>{job.experience}</li>
      </ul>

      <p className="job-description">{job.description}</p>

      {matchedSkills.length ? (
        <div className="tag-list">
          {matchedSkills.map((skill) => (
            <span key={skill} className="tag tag--found">
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <div className="tag-list">
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="tag tag--missing">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="job-card-actions">
        <button type="button" className="btn-secondary btn-sm" onClick={() => onToggleSave(job.id)}>
          {saved ? 'Unsave' : 'Save job'}
        </button>
        <span className="job-posted">Posted {new Date(job.postedAt).toLocaleDateString()}</span>
      </div>
    </article>
  )
}
