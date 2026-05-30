import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { AtsScoreCard } from '../components/resume/AtsScoreCard'
import { KeywordAnalysis } from '../components/resume/KeywordAnalysis'
import { MissingSkills } from '../components/resume/MissingSkills'
import { ResumeDownload } from '../components/resume/ResumeDownload'
import { ResumeSuggestions } from '../components/resume/ResumeSuggestions'
import { ResumeUpload } from '../components/resume/ResumeUpload'
import { analyzeResumeFile, getImprovedResumeContent } from '../services/resumeService'
import type { AtsAnalysisResult } from '../types/resume'

export function ResumeCheckerPage() {
  const { user, logout } = useAuth()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<AtsAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

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
      <header className="home-header">
        <div>
          <h1>ATS Resume Checker</h1>
          <p className="header-subtitle">Optimize your resume for applicant tracking systems</p>
        </div>
        <div className="home-actions">
          <span className="home-user">{user?.name}</span>
          <button type="button" className="btn-secondary" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="checker-main">
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
            <ResumeDownload
              fileName={result.fileName}
              content={improvedContent}
            />
          </div>
        ) : null}
      </main>
    </div>
  )
}
