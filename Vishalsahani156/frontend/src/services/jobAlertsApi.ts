import type { JobListing, JobPreferences, JobRecommendation } from '../types/jobAlerts'
import { apiRequest } from './httpClient'

export const jobAlertsApi = {
  async getAllJobs(): Promise<JobListing[]> {
    const { jobs } = await apiRequest<{ jobs: JobListing[] }>('/jobs')
    return jobs
  },

  async getPreferences(): Promise<JobPreferences> {
    const { preferences } = await apiRequest<{ preferences: JobPreferences }>('/jobs/preferences')
    return preferences
  },

  async savePreferences(preferences: JobPreferences): Promise<JobPreferences> {
    const { preferences: saved } = await apiRequest<{ preferences: JobPreferences }>(
      '/jobs/preferences',
      {
        method: 'PUT',
        body: JSON.stringify(preferences),
      },
    )
    return saved
  },

  async getRecommendations(): Promise<JobRecommendation[]> {
    const { recommendations } = await apiRequest<{ recommendations: JobRecommendation[] }>(
      '/jobs/recommendations',
    )
    return recommendations
  },

  async getSavedJobIds(): Promise<string[]> {
    const { ids } = await apiRequest<{ ids: string[] }>('/jobs/saved/ids')
    return ids
  },

  async getSavedJobs(): Promise<JobListing[]> {
    const { jobs } = await apiRequest<{ jobs: JobListing[] }>('/jobs/saved')
    return jobs
  },

  async isJobSaved(jobId: string): Promise<boolean> {
    const { saved } = await apiRequest<{ saved: boolean }>(`/jobs/${jobId}/saved`)
    return saved
  },

  async toggleSaveJob(jobId: string): Promise<boolean> {
    const { saved } = await apiRequest<{ saved: boolean }>(`/jobs/${jobId}/save`, {
      method: 'POST',
    })
    return saved
  },
}

export function formatSalary(min: number, max: number): string {
  const fmt = (n: number) => `₹${(n / 100000).toFixed(1)}L`
  return `${fmt(min)} – ${fmt(max)}`
}
