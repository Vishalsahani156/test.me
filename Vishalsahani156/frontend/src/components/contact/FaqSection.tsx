import { useMemo, useState } from 'react'
import { mockFaqData } from '../../data/mockFaqData'
import { FAQ_CATEGORIES, type FaqCategory } from '../../types/contact'

export function FaqSection() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<FaqCategory>('all')
  const [openId, setOpenId] = useState<string | null>(mockFaqData[0]?.id ?? null)

  const filtered = useMemo(() => {
    let items = [...mockFaqData]

    if (category !== 'all') {
      items = items.filter((item) => item.category === category)
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q),
      )
    }

    return items
  }, [category, query])

  return (
    <section id="faq" className="about-section faq-section">
      <h2>Frequently Asked Questions</h2>
      <p className="about-section-lead">Quick answers before you reach out to our team.</p>

      <div className="form-field faq-search">
        <label htmlFor="faq-search">Search FAQs</label>
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions and answers…"
        />
      </div>

      <div className="history-filters">
        <button
          type="button"
          className={`filter-chip${category === 'all' ? ' filter-chip--active' : ''}`}
          onClick={() => setCategory('all')}
        >
          All
        </button>
        {FAQ_CATEGORIES.map((item) => (
          <button
            key={item.slug}
            type="button"
            className={`filter-chip${category === item.slug ? ' filter-chip--active' : ''}`}
            onClick={() => setCategory(item.slug)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="faq-accordion">
          {filtered.map((item) => {
            const isOpen = openId === item.id
            return (
              <article key={item.id} className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  <span>{item.question}</span>
                  <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen ? <div className="faq-answer">{item.answer}</div> : null}
              </article>
            )
          })}
        </div>
      ) : (
        <p className="empty-note">No FAQs match your search. Try another keyword or category.</p>
      )}
    </section>
  )
}
