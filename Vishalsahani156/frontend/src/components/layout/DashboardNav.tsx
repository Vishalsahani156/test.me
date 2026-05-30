import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function DashboardNav() {
  const { user, logout, isAdmin } = useAuth()

  return (
    <header className="home-header dashboard-nav">
      <div>
        <h1>Career Toolkit</h1>
        <p className="header-subtitle">Resume tools, job alerts & career blog</p>
      </div>

      <nav className="dashboard-nav-links">
        <NavLink to="/resume-checker" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          ATS Checker
        </NavLink>
        <NavLink to="/resume-manager" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Resumes
        </NavLink>
        <NavLink to="/job-alerts" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Job Alerts
        </NavLink>
        <NavLink to="/blog" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Blog
        </NavLink>
        {isAdmin ? (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Admin
          </NavLink>
        ) : null}
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
