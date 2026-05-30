import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { adminApi } from '../../services/adminApi'
import type { AdminJob } from '../../types/admin'

const EMPTY_JOB = {
  title: '',
  company: '',
  location: '',
  remote: false,
  salaryMin: 1000000,
  salaryMax: 1500000,
  experience: '2-4 years',
  skills: 'react, node.js',
  description: '',
}

export function AdminJobsPage() {
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [form, setForm] = useState(EMPTY_JOB)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadJobs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setJobs(await adminApi.getJobs())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadJobs()
  }, [loadJobs])

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    try {
      await adminApi.createJob({
        title: form.title,
        company: form.company,
        location: form.location,
        remote: form.remote,
        salaryMin: form.salaryMin,
        salaryMax: form.salaryMax,
        experience: form.experience,
        skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        description: form.description,
      })
      setForm(EMPTY_JOB)
      await loadJobs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job')
    }
  }

  async function handleDelete(jobId: string) {
    if (!window.confirm('Delete this job?')) return
    try {
      await adminApi.deleteJob(jobId)
      await loadJobs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Jobs</h2>
      </div>
      {error ? <div className="form-error">{error}</div> : null}

      <form className="resume-card admin-form" onSubmit={handleCreate}>
        <h3>Add job</h3>
        <div className="admin-form-grid">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          <input placeholder="Experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} required />
          <input placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} required />
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.remote} onChange={(e) => setForm({ ...form, remote: e.target.checked })} />
            Remote
          </label>
        </div>
        <textarea className="job-description-input" rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <button type="submit" className="btn-primary">Create job</button>
      </form>

      {loading ? <p className="loading-text">Loading jobs…</p> : null}

      {!loading ? (
        <div className="admin-table-wrap resume-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Remote</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>{job.location}</td>
                  <td>{job.remote ? 'Yes' : 'No'}</td>
                  <td>{new Date(job.postedAt).toLocaleDateString()}</td>
                  <td>
                    <button type="button" className="btn-danger btn-sm" onClick={() => void handleDelete(job.id)}>
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
