import type { HistoryEntry, HistoryFilter } from '../../types/resumeManager'

interface ResumeHistoryTimelineProps {
  entries: HistoryEntry[]
  filter: HistoryFilter
  onFilterChange: (filter: HistoryFilter) => void
}

const FILTERS: { value: HistoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'upload', label: 'Uploads' },
  { value: 'activation', label: 'Activations' },
  { value: 'deletion', label: 'Deletions' },
  { value: 'score_change', label: 'Score changes' },
]

const TYPE_LABELS: Record<HistoryEntry['type'], string> = {
  upload: 'Upload',
  activation: 'Activation',
  deletion: 'Deletion',
  score_change: 'Score change',
}

export function ResumeHistoryTimeline({
  entries,
  filter,
  onFilterChange,
}: ResumeHistoryTimelineProps) {
  return (
    <section className="resume-card history-section">
      <div className="section-header-row">
        <div>
          <h2>Resume History</h2>
          <p className="resume-card-subtitle">Timeline of uploads, activations, deletions, and score changes.</p>
        </div>
      </div>

      <div className="history-filters">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`filter-chip${filter === item.value ? ' filter-chip--active' : ''}`}
            onClick={() => onFilterChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {entries.length ? (
        <ol className="history-timeline">
          {entries.map((entry) => (
            <li key={entry.id} className={`history-item history-item--${entry.type}`}>
              <div className="history-dot" />
              <div className="history-content">
                <div className="history-top">
                  <span className="history-type">{TYPE_LABELS[entry.type]}</span>
                  <time dateTime={entry.createdAt}>
                    {new Date(entry.createdAt).toLocaleString()}
                  </time>
                </div>
                <p>{entry.description}</p>
                {entry.type === 'score_change' && entry.score !== undefined ? (
                  <p className="history-score">
                    Score: {entry.previousScore !== undefined ? `${entry.previousScore} → ` : ''}
                    {entry.score}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty-note">No history entries for this filter.</p>
      )}
    </section>
  )
}
