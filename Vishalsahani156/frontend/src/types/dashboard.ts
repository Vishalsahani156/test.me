import type { JobRecommendation } from './jobAlerts'

export interface DashboardActivity {
  id: string
  type:
    | 'upload'
    | 'score_change'
    | 'activation'
    | 'deletion'
    | 'job_saved'
    | 'job_unsaved'
    | 'preferences_updated'
  title: string
  description: string
  createdAt: string
  link?: string
}

export interface DashboardResumeItem {
  resumeId: string
  resumeTitle: string
  versionId: string
  versionNumber: number
  fileName: string
  atsScore: number | null
  createdAt: string
  isActive: boolean
}

export interface DashboardAtsOverview {
  currentScore: number | null
  delta: number | null
  sparkline: number[]
  activeResumeId: string | null
  activeVersionId: string | null
  resumeTitle: string
  versionLabel: string
}

export interface DashboardAnalytics {
  totalResumes: number
  totalVersions: number
  avgAtsScore: number | null
  savedJobsCount: number
  matchRate: number | null
  profileViews: number
}

export interface DashboardData {
  atsOverview: DashboardAtsOverview
  recentVersions: DashboardResumeItem[]
  recommendedJobs: JobRecommendation[]
  activities: DashboardActivity[]
  analytics: DashboardAnalytics
}
