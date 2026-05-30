import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LINKS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/jobs', label: 'Jobs' },
  { to: '/admin/blogs', label: 'Blogs' },
  { to: '/admin/messages', label: 'Messages' },
]

export function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar resume-card">
        <div className="admin-brand">
          <strong>Admin Panel</strong>
          <span>{user?.email}</span>
        </div>
        <nav className="admin-nav">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/dashboard" className="admin-nav-link">
          ← Back to app
        </NavLink>
        <button type="button" className="btn-secondary btn-sm" onClick={logout}>
          Sign out
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
