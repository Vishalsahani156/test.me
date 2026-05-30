import type { JobAlertsUserData } from '../types/jobAlerts'
import { DEFAULT_PREFERENCES } from '../types/jobAlerts'

const STORAGE_KEY = 'job_alerts_data'

export function loadJobAlertsUserData(): JobAlertsUserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as JobAlertsUserData
  } catch (e) {
    console.error('Failed to read job alerts data:', e)
  }

  return {
    preferences: { ...DEFAULT_PREFERENCES },
    savedJobIds: [],
  }
}

export function saveJobAlertsUserData(data: JobAlertsUserData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save job alerts data:', e)
  }
}
