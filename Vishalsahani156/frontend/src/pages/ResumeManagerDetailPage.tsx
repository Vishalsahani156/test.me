import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ResumeHistoryTimeline } from '../components/resume-manager/ResumeHistoryTimeline'
import { ResumeScoreChart } from '../components/resume-manager/ResumeScoreChart'
import { ResumeVersionCard } from '../components/resume-manager/ResumeVersionCard'
import { UploadVersionModal } from '../components/resume-manager/UploadVersionModal'
import { resumeManagerApi } from '../services/resumeManagerApi'
import type { HistoryEntry, HistoryFilter, ManagedResume, ScoreStats } from '../types/resumeManager'

export function ResumeManagerDetailPage() {
  const { resumeId = '' } = useParams()
  const [resume, setResume] = useState<ManagedResume | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [stats, setStats] = useState<ScoreStats>({ current: null, best: null, average: null })
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  const loadData = useCallback(async () => {
    if (!resumeId) return

    setLoading(true)
    setError(null)

    try {
      const [nextResume, nextHistory, nextStats] = await Promise.all([
        resumeManagerApi.getResumeById(resumeId),
        resumeManagerApi.getHistory(resumeId, historyFilter),
        resumeManagerApi.getScoreStats(resumeId),
      ])

      if (!nextResume) {
        setError('Resume not found')
        setResume(null)
        return
      }

      setResume(nextResume)
      setHistory(nextHistory)
      setStats(nextStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resume')
    } finally {
      setLoading(false)
    }
  }, [resumeId, historyFilter])

  useEffect(() => {
    void loadData()
  }, [loadData])

  async function handleSetActive(versionId: string) {
    if (!resumeId) return
    setBusy(true)
    try {
      await resumeManagerApi.setActiveVersion(resumeId, versionId)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set active version')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(versionId: string) {
    if (!resumeId) return
    if (!window.confirm('Delete this version? This cannot be undone.')) return

    setBusy(true)
    try {
      await resumeManagerApi.deleteVersion(resumeId, versionId)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete version')
    } finally {
      setBusy(false)
    }
  }

  async function handleUpload(file: File, label: string, notes: string) {
    if (!resumeId) return
    setBusy(true)
    try {
      await resumeManagerApi.uploadVersion(resumeId, { file, label, notes })
      await loadData()
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <main className="manager-main">
        <div className="page-header">
          <div>
            <Link to="/resume-manager" className="back-link">← All resumes</Link>
            <h2>{resume?.title ?? 'Resume detail'}</h2>
            {resume?.description ? <p className="resume-card-subtitle">{resume.description}</p> : null}
          </div>
          <button type="button" className="btn-primary" onClick={() => setUploadOpen(true)} disabled={busy}>
            Upload new version
          </button>
        </div>

        {loading ? <p className="loading-text">Loading…</p> : null}
        {error ? <div className="form-error">{error}</div> : null}

        {resume && !loading ? (
          <>
            <section className="resume-card">
              <h2>Versions</h2>
              <p className="resume-card-subtitle">Multiple resume versions with ATS scores and actions.</p>
              <div className="version-grid">
                {[...resume.versions]
                  .sort((a, b) => b.versionNumber - a.versionNumber)
                  .map((version) => (
                    <ResumeVersionCard
                      key={version.id}
                      resumeId={resume.id}
                      version={version}
                      onSetActive={handleSetActive}
                      onDelete={handleDelete}
                      busy={busy}
                    />
                  ))}
              </div>
            </section>

            <ResumeScoreChart versions={resume.versions} stats={stats} />
            <ResumeHistoryTimeline
              entries={history}
              filter={historyFilter}
              onFilterChange={setHistoryFilter}
            />
          </>
        ) : null}
      </main>

      <UploadVersionModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />
    </>
  )
}
