export interface JobPreferences {
  role: string
  locations: string[]
  skills: string[]
  experience: string
  remote: boolean
  salaryMin: number | null
  salaryMax: number | null
}

export interface JobListing {
  id: string
  title: string
  company: string
  location: string
  remote: boolean
  salaryMin: number
  salaryMax: number
  experience: string
  skills: string[]
  description: string
  postedAt: string
}

export interface JobRecommendation extends JobListing {
  matchPercent: number
  matchedSkills: string[]
}

export interface JobAlertsUserData {
  preferences: JobPreferences
  savedJobIds: string[]
  savedJobTimestamps?: Record<string, string>
  preferencesUpdatedAt?: string
}

export type JobAlertsTab = 'recommendations' | 'saved' | 'preferences'

export const DEFAULT_PREFERENCES: JobPreferences = {
  role: '',
  locations: [],
  skills: [],
  experience: '',
  remote: false,
  salaryMin: null,
  salaryMax: null,
}
