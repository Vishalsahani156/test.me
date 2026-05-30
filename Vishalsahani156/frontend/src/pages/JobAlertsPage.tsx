import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { JobCard } from '../components/job-alerts/JobCard'
import { JobPreferencesForm } from '../components/job-alerts/JobPreferencesForm'
import { jobAlertsApi } from '../services/jobAlertsApi'
import type { JobAlertsTab, JobListing, JobPreferences, JobRecommendation } from '../types/jobAlerts'

const TABS: { id: JobAlertsTab; label: string }[] = [
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'saved', label: 'Saved' },
  { id: 'preferences', label: 'Preferences' },
]

export function JobAlertsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as JobAlertsTab) || 'recommendations'

  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([])
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([])
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [preferences, setPreferences] = useState<JobPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [recs, saved, ids, prefs] = await Promise.all([
        jobAlertsApi.getRecommendations(),
        jobAlertsApi.getSavedJobs(),
        jobAlertsApi.getSavedJobIds(),
        jobAlertsApi.getPreferences(),
      ])
      setRecommendations(recs)
      setSavedJobs(saved)
      setSavedIds(ids)
      setPreferences(prefs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job alerts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  function setTab(tab: JobAlertsTab) {
    setSearchParams({ tab })
  }

  async function handleToggleSave(jobId: string) {
    await jobAlertsApi.toggleSaveJob(jobId)
    await loadData()
  }

  async function handleSavePreferences(prefs: JobPreferences) {
    await jobAlertsApi.savePreferences(prefs)
    await loadData()
  }

  return (
    <main className="manager-main">
        <div className="page-header">
          <div>
            <h2>Job Alerts</h2>
            <p className="resume-card-subtitle">
              Skill-based recommendations, saved jobs, and personalized preferences.
            </p>
          </div>
        </div>

        <div className="tab-bar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab-btn${activeTab === tab.id ? ' tab-btn--active' : ''}`}
              onClick={() => setTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? <p className="loading-text">Loading…</p> : null}
        {error ? <div className="form-error">{error}</div> : null}

        {!loading && activeTab === 'recommendations' ? (
          <div className="job-list">
            {recommendations.length ? (
              recommendations.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={savedIds.includes(job.id)}
                  onToggleSave={handleToggleSave}
                  showMatch
                />
              ))
            ) : (
              <p className="empty-note">Add skills in Preferences to get recommendations.</p>
            )}
          </div>
        ) : null}

        {!loading && activeTab === 'saved' ? (
          <div className="job-list">
            {savedJobs.length ? (
              savedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved
                  onToggleSave={handleToggleSave}
                />
              ))
            ) : (
              <p className="empty-note">No saved jobs yet. Bookmark roles from Recommendations.</p>
            )}
          </div>
        ) : null}

        {!loading && activeTab === 'preferences' && preferences ? (
          <JobPreferencesForm preferences={preferences} onSave={handleSavePreferences} />
        ) : null}
    </main>
  )
}
