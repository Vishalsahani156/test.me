import type { KeywordMatch } from '../../types/resume'

interface KeywordAnalysisProps {
  keywords: KeywordMatch[]
}

export function KeywordAnalysis({ keywords }: KeywordAnalysisProps) {
  const found = keywords.filter((k) => k.found)
  const missing = keywords.filter((k) => !k.found)

  return (
    <section className="resume-card">
      <h2>Keyword Analysis</h2>
      <p className="resume-card-subtitle">
        Keywords extracted from the job description and matched against your resume.
      </p>

      <div className="keyword-groups">
        <div>
          <h3>Matched ({found.length})</h3>
          <div className="tag-list">
            {found.length ? (
              found.map((item) => (
                <span key={item.keyword} className="tag tag--found">
                  {item.keyword}
                  {item.count > 1 ? ` ×${item.count}` : ''}
                </span>
              ))
            ) : (
              <p className="empty-note">No keyword matches yet.</p>
            )}
          </div>
        </div>

        <div>
          <h3>Not found ({missing.length})</h3>
          <div className="tag-list">
            {missing.length ? (
              missing.map((item) => (
                <span key={item.keyword} className="tag tag--missing">
                  {item.keyword}
                </span>
              ))
            ) : (
              <p className="empty-note">All tracked keywords were found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
