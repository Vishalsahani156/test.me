import type { DashboardData } from '../types/dashboard'
import { apiRequest } from './httpClient'

export const dashboardApi = {
  async getDashboardData(): Promise<DashboardData> {
    const { dashboard } = await apiRequest<{ dashboard: DashboardData }>('/dashboard')
    return dashboard
  },

  async toggleSaveJob(jobId: string): Promise<boolean> {
    const { saved } = await apiRequest<{ saved: boolean }>(`/dashboard/jobs/${jobId}/save`, {
      method: 'POST',
    })
    return saved
  },
}
