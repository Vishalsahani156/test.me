import { useEffect, useMemo, useState } from 'react'
import { faqApi } from '../../services/faqApi'
import { FAQ_CATEGORIES, type FaqCategory, type FaqItem } from '../../types/contact'

export function FaqSection() {
  const [items, setItems] = useState<FaqItem[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<FaqCategory>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    faqApi
      .getFaq({ category, query })
      .then((faq) => {
        setItems(faq)
        setOpenId(faq[0]?.id ?? null)
      })
      .finally(() => setLoading(false))
  }, [category, query])

  const filtered = useMemo(() => items, [items])

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

      {loading ? <p className="loading-text">Loading FAQs…</p> : null}

      {!loading && filtered.length ? (
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
      ) : null}

      {!loading && !filtered.length ? (
        <p className="empty-note">No FAQs match your search. Try another keyword or category.</p>
      ) : null}
    </section>
  )
}
