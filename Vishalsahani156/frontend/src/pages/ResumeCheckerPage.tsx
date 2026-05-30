import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DashboardNav } from '../components/layout/DashboardNav'
import { AtsScoreCard } from '../components/resume/AtsScoreCard'
import { KeywordAnalysis } from '../components/resume/KeywordAnalysis'
import { MissingSkills } from '../components/resume/MissingSkills'
import { ResumeDownload } from '../components/resume/ResumeDownload'
import { ResumeSuggestions } from '../components/resume/ResumeSuggestions'
import { ResumeUpload } from '../components/resume/ResumeUpload'
import { resumeManagerApi } from '../services/resumeManagerApi'
import { analyzeResumeFile, getImprovedResumeContent } from '../services/resumeService'
import type { AtsAnalysisResult } from '../types/resume'

export function ResumeCheckerPage() {
  const [searchParams] = useSearchParams()
  const linkedResumeId = searchParams.get('resumeId')
  const linkedVersionId = searchParams.get('versionId')

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<AtsAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!linkedResumeId || !linkedVersionId) return

    resumeManagerApi.getVersion(linkedResumeId, linkedVersionId).then((version) => {
      if (version) {
        setSyncMessage(`Linked to ${version.fileName} (v${version.versionNumber}). Run analysis to sync ATS score.`)
      }
    })
  }, [linkedResumeId, linkedVersionId])

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSyncMessage(null)

    if (!selectedFile) {
      setError('Please upload a resume file.')
      return
    }

    if (jobDescription.trim().length < 30) {
      setError('Paste a job description with at least 30 characters for meaningful analysis.')
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File must be 5 MB or smaller.')
      return
    }

    setAnalyzing(true)

    try {
      const analysis = await analyzeResumeFile(selectedFile, jobDescription)
      setResult(analysis)

      if (linkedResumeId && linkedVersionId) {
        await resumeManagerApi.updateVersionScore(linkedResumeId, linkedVersionId, analysis.score)
        setSyncMessage(`ATS score ${analysis.score} synced to Resume Manager.`)
      }
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Failed to analyze resume.')
    } finally {
      setAnalyzing(false)
    }
  }

  const improvedContent =
    result && jobDescription ? getImprovedResumeContent(result, jobDescription) : ''

  return (
    <div className="app-shell">
      <DashboardNav />

      <main className="checker-main">
        {linkedResumeId && linkedVersionId ? (
          <div className="form-success linked-banner">
            Resume Manager link active — scores will sync after analysis.
          </div>
        ) : null}

        {syncMessage ? <div className="form-success">{syncMessage}</div> : null}

        <form className="checker-form" onSubmit={handleAnalyze}>
          <div className="checker-inputs">
            <ResumeUpload
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              disabled={analyzing}
            />

            <section className="resume-card">
              <h2>Job Description</h2>
              <p className="resume-card-subtitle">
                Paste the job posting so we can compare keywords and detect missing skills.
              </p>
              <textarea
                className="job-description-input"
                rows={10}
                placeholder="Paste the full job description here…"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={analyzing}
              />
            </section>
          </div>

          {error ? <div className="form-error">{error}</div> : null}

          <button type="submit" className="btn-primary analyze-btn" disabled={analyzing}>
            {analyzing ? 'Analyzing…' : 'Analyze resume'}
          </button>
        </form>

        {result ? (
          <div className="checker-results">
            <div className="results-top">
              <AtsScoreCard
                score={result.score}
                matchedCount={result.matchedCount}
                totalKeywords={result.totalKeywords}
              />

              <section className="resume-card sections-card">
                <h2>Resume Sections</h2>
                <ul className="sections-list">
                  {Object.entries(result.sections).map(([name, found]) => (
                    <li key={name} className={found ? 'section-found' : 'section-missing'}>
                      <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                      <span>{found ? 'Found' : 'Missing'}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <KeywordAnalysis keywords={result.keywords} />
            <MissingSkills skills={result.missingSkills} />
            <ResumeSuggestions suggestions={result.suggestions} />
            <ResumeDownload fileName={result.fileName} content={improvedContent} />
          </div>
        ) : null}
      </main>
    </div>
  )
}
