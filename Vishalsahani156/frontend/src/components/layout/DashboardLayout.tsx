import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/resume-checker', label: 'ATS Checker' },
  { to: '/resume-manager', label: 'Resume Manager' },
  { to: '/job-alerts', label: 'Job Alerts' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
]

export function DashboardLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>Career Toolkit</h1>
          <p>Your career hub</p>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link${isActive ? ' sidebar-link--active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-user">{user?.name}</span>
          <button type="button" className="btn-secondary btn-sm" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  )
}
