import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardNav } from '../components/layout/DashboardNav'
import { resumeManagerApi } from '../services/resumeManagerApi'
import type { ManagedResume } from '../types/resumeManager'

function activeScore(resume: ManagedResume): number | null {
  const active = resume.versions.find((v) => v.id === resume.activeVersionId)
  return active?.atsScore ?? null
}

export function ResumeManagerPage() {
  const [resumes, setResumes] = useState<ManagedResume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    resumeManagerApi
      .getResumes()
      .then(setResumes)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load resumes'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="app-shell">
      <DashboardNav />

      <main className="manager-main">
        <div className="page-header">
          <div>
            <h2>Resume Manager</h2>
            <p className="resume-card-subtitle">Manage multiple resume versions, track scores, and view history.</p>
          </div>
        </div>

        {loading ? <p className="loading-text">Loading resumes…</p> : null}
        {error ? <div className="form-error">{error}</div> : null}

        {!loading && !error ? (
          <div className="resume-list-grid">
            {resumes.map((resume) => {
              const score = activeScore(resume)
              return (
                <Link key={resume.id} to={`/resume-manager/${resume.id}`} className="resume-list-card">
                  <div className="resume-list-card-top">
                    <h3>{resume.title}</h3>
                    {score !== null ? (
                      <span className="score-badge score-badge--mid">ATS {score}</span>
                    ) : (
                      <span className="score-badge score-badge--none">No score</span>
                    )}
                  </div>
                  {resume.description ? <p>{resume.description}</p> : null}
                  <ul className="resume-list-meta">
                    <li>{resume.versions.length} version{resume.versions.length === 1 ? '' : 's'}</li>
                    <li>Updated {new Date(resume.updatedAt).toLocaleDateString()}</li>
                  </ul>
                </Link>
              )
            })}
          </div>
        ) : null}
      </main>
    </div>
  )
}
