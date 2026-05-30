import { SEED_JOBS } from '../data/seedJobs'
import type { JobListing, JobPreferences, JobRecommendation } from '../types/jobAlerts'
import { loadJobAlertsUserData, saveJobAlertsUserData } from '../utils/jobAlertsStorage'

const MOCK_DELAY_MS = 300

function delay(ms = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase()
}

function computeMatch(job: JobListing, prefs: JobPreferences): JobRecommendation {
  const prefSkills = prefs.skills.map(normalizeSkill).filter(Boolean)
  const jobSkills = job.skills.map(normalizeSkill)

  const matchedSkills = prefSkills.filter((s) =>
    jobSkills.some((js) => js.includes(s) || s.includes(js)),
  )

  const skillScore = prefSkills.length
    ? Math.round((matchedSkills.length / prefSkills.length) * 100)
    : 40

  let bonus = 0
  if (prefs.role && job.title.toLowerCase().includes(prefs.role.toLowerCase())) bonus += 10
  if (prefs.remote && job.remote) bonus += 5
  if (prefs.locations.length) {
    const locMatch = prefs.locations.some(
      (loc) =>
        job.location.toLowerCase().includes(loc.toLowerCase()) ||
        (loc.toLowerCase() === 'remote' && job.remote),
    )
    if (locMatch) bonus += 10
  }
  if (prefs.experience && job.experience === prefs.experience) bonus += 5

  const matchPercent = Math.min(100, skillScore + bonus)

  return { ...job, matchPercent, matchedSkills }
}

export const jobAlertsApi = {
  async getAllJobs(): Promise<JobListing[]> {
    await delay()
    return SEED_JOBS
  },

  async getPreferences(): Promise<JobPreferences> {
    await delay()
    return loadJobAlertsUserData().preferences
  },

  async savePreferences(preferences: JobPreferences): Promise<JobPreferences> {
    await delay(400)
    const data = loadJobAlertsUserData()
    data.preferences = preferences
    data.preferencesUpdatedAt = new Date().toISOString()
    saveJobAlertsUserData(data)
    return preferences
  },

  async getRecommendations(): Promise<JobRecommendation[]> {
    await delay()
    const prefs = loadJobAlertsUserData().preferences
    return SEED_JOBS.map((job) => computeMatch(job, prefs)).sort(
      (a, b) => b.matchPercent - a.matchPercent,
    )
  },

  async getSavedJobIds(): Promise<string[]> {
    await delay()
    return loadJobAlertsUserData().savedJobIds
  },

  async getSavedJobs(): Promise<JobListing[]> {
    await delay()
    const ids = loadJobAlertsUserData().savedJobIds
    return SEED_JOBS.filter((job) => ids.includes(job.id))
  },

  async isJobSaved(jobId: string): Promise<boolean> {
    await delay(100)
    return loadJobAlertsUserData().savedJobIds.includes(jobId)
  },

  async toggleSaveJob(jobId: string): Promise<boolean> {
    await delay(200)
    const data = loadJobAlertsUserData()
    if (!data.savedJobTimestamps) data.savedJobTimestamps = {}
    const index = data.savedJobIds.indexOf(jobId)
    if (index >= 0) {
      data.savedJobIds.splice(index, 1)
      delete data.savedJobTimestamps[jobId]
      saveJobAlertsUserData(data)
      return false
    }
    data.savedJobIds.push(jobId)
    data.savedJobTimestamps[jobId] = new Date().toISOString()
    saveJobAlertsUserData(data)
    return true
  },
}

export function formatSalary(min: number, max: number): string {
  const fmt = (n: number) => `₹${(n / 100000).toFixed(1)}L`
  return `${fmt(min)} – ${fmt(max)}`
}
