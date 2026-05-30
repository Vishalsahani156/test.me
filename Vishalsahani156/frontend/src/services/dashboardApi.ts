import { SEED_JOBS } from '../data/seedJobs'
import type {
  DashboardActivity,
  DashboardAnalytics,
  DashboardAtsOverview,
  DashboardData,
  DashboardResumeItem,
} from '../types/dashboard'
import { jobAlertsApi } from './jobAlertsApi'
import { loadJobAlertsUserData } from '../utils/jobAlertsStorage'
import { loadResumeManagerData } from '../utils/resumeManagerStorage'

const MOCK_DELAY_MS = 350
const MOCK_PROFILE_VIEWS = 128

function delay(ms = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildAtsOverview(): DashboardAtsOverview {
  const data = loadResumeManagerData()
  let bestResume = data.resumes[0]
  let activeVersion = bestResume?.versions.find((v) => v.id === bestResume.activeVersionId)

  for (const resume of data.resumes) {
    const active = resume.versions.find((v) => v.id === resume.activeVersionId)
    if (active?.atsScore !== null && active?.atsScore !== undefined) {
      bestResume = resume
      activeVersion = active
      break
    }
  }

  if (!bestResume || !activeVersion) {
    return {
      currentScore: null,
      delta: null,
      sparkline: [],
      activeResumeId: null,
      activeVersionId: null,
      resumeTitle: 'No active resume',
      versionLabel: '',
    }
  }

  const sortedVersions = [...bestResume.versions].sort((a, b) => a.versionNumber - b.versionNumber)
  const sparkline = sortedVersions
    .map((v) => v.atsScore)
    .filter((score): score is number => score !== null)

  const prevVersion = sortedVersions
    .filter((v) => v.versionNumber < activeVersion.versionNumber && v.atsScore !== null)
    .pop()

  const delta =
    activeVersion.atsScore !== null && prevVersion?.atsScore !== undefined
      ? activeVersion.atsScore - prevVersion.atsScore
      : null

  return {
    currentScore: activeVersion.atsScore,
    delta,
    sparkline,
    activeResumeId: bestResume.id,
    activeVersionId: activeVersion.id,
    resumeTitle: bestResume.title,
    versionLabel: activeVersion.label,
  }
}

function buildRecentVersions(): DashboardResumeItem[] {
  const data = loadResumeManagerData()
  const items: DashboardResumeItem[] = []

  for (const resume of data.resumes) {
    for (const version of resume.versions) {
      items.push({
        resumeId: resume.id,
        resumeTitle: resume.title,
        versionId: version.id,
        versionNumber: version.versionNumber,
        fileName: version.fileName,
        atsScore: version.atsScore,
        createdAt: version.createdAt,
        isActive: version.isActive,
      })
    }
  }

  return items
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
}

function buildActivities(): DashboardActivity[] {
  const resumeData = loadResumeManagerData()
  const jobData = loadJobAlertsUserData()
  const activities: DashboardActivity[] = []

  for (const entry of resumeData.history) {
    const resume = resumeData.resumes.find((r) => r.id === entry.resumeId)
    activities.push({
      id: entry.id,
      type: entry.type,
      title: entry.type.replace('_', ' '),
      description: entry.description,
      createdAt: entry.createdAt,
      link: resume ? `/resume-manager/${entry.resumeId}` : '/resume-manager',
    })
  }

  if (jobData.preferencesUpdatedAt) {
    activities.push({
      id: 'pref-updated',
      type: 'preferences_updated',
      title: 'Preferences updated',
      description: 'Job alert preferences were saved',
      createdAt: jobData.preferencesUpdatedAt,
      link: '/job-alerts?tab=preferences',
    })
  }

  for (const jobId of jobData.savedJobIds) {
    const job = SEED_JOBS.find((j) => j.id === jobId)
    if (!job) continue
    activities.push({
      id: `saved-${jobId}`,
      type: 'job_saved',
      title: 'Job saved',
      description: `${job.title} at ${job.company}`,
      createdAt: jobData.savedJobTimestamps?.[jobId] ?? job.postedAt,
      link: '/job-alerts?tab=saved',
    })
  }

  return activities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12)
}

function buildAnalytics(
  recommendedJobs: Awaited<ReturnType<typeof jobAlertsApi.getRecommendations>>,
): DashboardAnalytics {
  const resumeData = loadResumeManagerData()
  const jobData = loadJobAlertsUserData()

  const allScores = resumeData.resumes.flatMap((r) =>
    r.versions.map((v) => v.atsScore).filter((s): s is number => s !== null),
  )

  const avgAtsScore = allScores.length
    ? Math.round(allScores.reduce((sum, s) => sum + s, 0) / allScores.length)
    : null

  const topMatches = recommendedJobs.slice(0, 5)
  const matchRate = topMatches.length
    ? Math.round(topMatches.reduce((sum, j) => sum + j.matchPercent, 0) / topMatches.length)
    : null

  const totalVersions = resumeData.resumes.reduce((sum, r) => sum + r.versions.length, 0)

  return {
    totalResumes: resumeData.resumes.length,
    totalVersions,
    avgAtsScore,
    savedJobsCount: jobData.savedJobIds.length,
    matchRate,
    profileViews: MOCK_PROFILE_VIEWS,
  }
}

export const dashboardApi = {
  async getDashboardData(): Promise<DashboardData> {
    await delay()
    const recommendedJobs = (await jobAlertsApi.getRecommendations()).slice(0, 5)

    return {
      atsOverview: buildAtsOverview(),
      recentVersions: buildRecentVersions(),
      recommendedJobs,
      activities: buildActivities(),
      analytics: buildAnalytics(recommendedJobs),
    }
  },

  async toggleSaveJob(jobId: string): Promise<boolean> {
    return jobAlertsApi.toggleSaveJob(jobId)
  },
}
