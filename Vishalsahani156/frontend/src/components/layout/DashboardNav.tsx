import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function DashboardNav() {
  const { user, logout } = useAuth()

  return (
    <header className="home-header dashboard-nav">
      <div>
        <h1>Resume Toolkit</h1>
        <p className="header-subtitle">ATS checker & resume version manager</p>
      </div>

      <nav className="dashboard-nav-links">
        <NavLink to="/resume-checker" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          ATS Checker
        </NavLink>
        <NavLink to="/resume-manager" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Resume Manager
        </NavLink>
      </nav>

      <div className="home-actions">
        <span className="home-user">{user?.name}</span>
        <button type="button" className="btn-secondary" onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  )
}
