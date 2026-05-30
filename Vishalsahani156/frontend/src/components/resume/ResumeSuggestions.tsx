import type { ResumeSuggestion } from '../../types/resume'

interface ResumeSuggestionsProps {
  suggestions: ResumeSuggestion[]
}

const priorityClass: Record<ResumeSuggestion['priority'], string> = {
  high: 'priority-high',
  medium: 'priority-medium',
  low: 'priority-low',
}

export function ResumeSuggestions({ suggestions }: ResumeSuggestionsProps) {
  return (
    <section className="resume-card">
      <h2>Resume Suggestions</h2>
      <p className="resume-card-subtitle">Actionable improvements to boost your ATS compatibility.</p>

      {suggestions.length ? (
        <ul className="suggestions-list">
          {suggestions.map((item) => (
            <li key={item.id} className="suggestion-item">
              <span className={`priority-badge ${priorityClass[item.priority]}`}>
                {item.priority}
              </span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-note success-note">Your resume looks well optimized for this role.</p>
      )}
    </section>
  )
}
