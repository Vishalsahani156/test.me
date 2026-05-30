import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { adminApi } from '../../services/adminApi'
import type { AdminUser } from '../../types/admin'

export function AdminUsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setUsers(await adminApi.getUsers())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  async function handleRoleChange(userId: string, role: 'USER' | 'ADMIN') {
    try {
      await adminApi.updateUserRole(userId, role)
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role')
    }
  }

  async function handleDelete(userId: string) {
    if (!window.confirm('Delete this user and all related data?')) return
    try {
      await adminApi.deleteUser(userId)
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Users</h2>
      </div>
      {error ? <div className="form-error">{error}</div> : null}
      {loading ? <p className="loading-text">Loading users…</p> : null}

      {!loading ? (
        <div className="admin-table-wrap resume-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Resumes</th>
                <th>Saved jobs</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.name}</td>
                  <td>{entry.email}</td>
                  <td>
                    <select
                      value={entry.role}
                      disabled={entry.id === user?.id}
                      onChange={(e) =>
                        void handleRoleChange(entry.id, e.target.value as 'USER' | 'ADMIN')
                      }
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>{entry.resumeCount}</td>
                  <td>{entry.savedJobsCount}</td>
                  <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-danger btn-sm"
                      disabled={entry.id === user?.id}
                      onClick={() => void handleDelete(entry.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
