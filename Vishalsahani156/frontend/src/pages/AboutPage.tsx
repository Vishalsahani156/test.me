import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { aboutApi } from '../services/aboutApi'
import { AboutAnchorNav } from '../components/about/AboutAnchorNav'
import { ContactSection } from '../components/about/ContactSection'
import type { AboutData } from '../types/about'

export function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    aboutApi
      .getAbout()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load about page'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="about-page">
        <p className="loading-text">Loading…</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="about-page">
        <div className="form-error">{error ?? 'About content unavailable'}</div>
      </div>
    )
  }

  const { hero, mission, values, stats, features, team, contact } = data

  return (
    <div className="about-page">
      <AboutAnchorNav />

      <section id="hero" className="about-hero">
        <div className="about-hero-content">
          <span className="about-hero-badge">About Career Toolkit</span>
          <h1>{hero.title}</h1>
          <p>{hero.subtitle}</p>
          <p className="about-hero-tagline">{hero.tagline}</p>
          <button type="button" className="btn-primary" onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}>
            Learn more
          </button>
        </div>
      </section>

      <main className="about-main">
        <section id="mission" className="about-section">
          <h2>Our Mission</h2>
          <p className="about-mission-text">{mission.statement}</p>
          <blockquote className="about-vision">
            <strong>Vision:</strong> {mission.vision}
          </blockquote>

          <div className="values-grid">
            {values.map((value) => (
              <article key={value.title} className="resume-card value-card">
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>

          <div className="about-stats-row">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-box analytics-card">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="about-section">
          <h2>Platform Features</h2>
          <p className="about-section-lead">Everything you need to manage your job search in one toolkit.</p>
          <div className="features-about-grid">
            {features.map((feature) => (
              <Link key={feature.title} to={feature.route} className="resume-card feature-about-card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <span className="feature-about-link">Explore →</span>
              </Link>
            ))}
          </div>
        </section>

        <section id="team" className="about-section">
          <h2>Meet the Team</h2>
          <p className="about-section-lead">The people building tools for your next career move.</p>
          <div className="team-grid">
            {team.map((member) => (
              <article key={member.name} className="resume-card team-card">
                <div className="team-avatar">{member.initials}</div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
                <div className="team-social">
                  {member.social.linkedin ? (
                    <a href={member.social.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  ) : null}
                  {member.social.github ? (
                    <a href={member.social.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  ) : null}
                  {member.social.twitter ? (
                    <a href={member.social.twitter} target="_blank" rel="noreferrer">
                      Twitter
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <ContactSection contact={contact} />
      </main>

      <footer className="about-footer">
        <p>© {new Date().getFullYear()} Career Toolkit. All rights reserved.</p>
        <div className="about-footer-links">
          <Link to="/login">Sign in</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
