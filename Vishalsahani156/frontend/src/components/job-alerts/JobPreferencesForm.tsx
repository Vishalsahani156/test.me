import { useState, type FormEvent } from 'react'
import type { JobPreferences } from '../../types/jobAlerts'

interface JobPreferencesFormProps {
  preferences: JobPreferences
  onSave: (prefs: JobPreferences) => Promise<void>
}

export function JobPreferencesForm({ preferences, onSave }: JobPreferencesFormProps) {
  const [form, setForm] = useState(preferences)
  const [locationsInput, setLocationsInput] = useState(preferences.locations.join(', '))
  const [skillsInput, setSkillsInput] = useState(preferences.skills.join(', '))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage(null)

    const next: JobPreferences = {
      ...form,
      locations: locationsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      skills: skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }

    try {
      await onSave(next)
      setForm(next)
      setMessage('Preferences saved. Recommendations will update.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="resume-card">
      <h2>Job Preferences</h2>
      <p className="resume-card-subtitle">
        Set your target role, locations, skills, and salary to improve recommendations.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="pref-role">Target role</label>
          <input
            id="pref-role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="e.g. Full Stack Engineer"
          />
        </div>

        <div className="form-field">
          <label htmlFor="pref-locations">Locations (comma-separated)</label>
          <input
            id="pref-locations"
            value={locationsInput}
            onChange={(e) => setLocationsInput(e.target.value)}
            placeholder="Bangalore, Remote, Mumbai"
          />
        </div>

        <div className="form-field">
          <label htmlFor="pref-skills">Skills (comma-separated)</label>
          <input
            id="pref-skills"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="react, node.js, typescript, mongodb"
          />
        </div>

        <div className="form-field">
          <label htmlFor="pref-experience">Experience level</label>
          <select
            id="pref-experience"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          >
            <option value="">Any</option>
            <option value="1-3 years">1-3 years</option>
            <option value="2-4 years">2-4 years</option>
            <option value="2-5 years">2-5 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="4-6 years">4-6 years</option>
          </select>
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.remote}
            onChange={(e) => setForm({ ...form, remote: e.target.checked })}
          />
          Prefer remote roles
        </label>

        <div className="salary-row">
          <div className="form-field">
            <label htmlFor="salary-min">Min salary (₹/year)</label>
            <input
              id="salary-min"
              type="number"
              value={form.salaryMin ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  salaryMin: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="800000"
            />
          </div>
          <div className="form-field">
            <label htmlFor="salary-max">Max salary (₹/year)</label>
            <input
              id="salary-max"
              type="number"
              value={form.salaryMax ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  salaryMax: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="1500000"
            />
          </div>
        </div>

        {message ? <div className="form-success">{message}</div> : null}

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save preferences'}
        </button>
      </form>
    </section>
  )
}
