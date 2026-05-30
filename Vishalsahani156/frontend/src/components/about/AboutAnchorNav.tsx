import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ANCHORS = [
  { id: 'mission', label: 'Mission' },
  { id: 'features', label: 'Features' },
  { id: 'team', label: 'Team' },
  { id: 'contact', label: 'Contact' },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function AboutAnchorNav() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="about-nav">
      <div className="about-nav-inner">
        <Link to="/" className="about-brand">
          Career Toolkit
        </Link>

        <nav className="about-anchor-links">
          {ANCHORS.map((item) => (
            <button key={item.id} type="button" className="about-anchor-btn" onClick={() => scrollTo(item.id)}>
              {item.label}
            </button>
          ))}
          <Link to="/contact" className="about-anchor-btn about-nav-link">
            Contact page
          </Link>
        </nav>

        <Link to={isAuthenticated ? '/dashboard' : '/login'} className="btn-secondary btn-sm btn-link">
          {isAuthenticated ? 'Go to app' : 'Sign in'}
        </Link>
      </div>
    </header>
  )
}
