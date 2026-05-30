import { prisma } from '../lib/prisma.js'
import { jobsService } from './jobs.service.js'

export interface DashboardAtsOverviewDto {
  currentScore: number | null
  delta: number | null
  sparkline: number[]
  activeResumeId: string | null
  activeVersionId: string | null
  resumeTitle: string
  versionLabel: string
}

export interface DashboardResumeItemDto {
  resumeId: string
  resumeTitle: string
  versionId: string
  versionNumber: number
  fileName: string
  atsScore: number | null
  createdAt: string
  isActive: boolean
}

export interface DashboardActivityDto {
  id: string
  type: string
  title: string
  description: string
  createdAt: string
  link?: string
}

export interface DashboardAnalyticsDto {
  totalResumes: number
  totalVersions: number
  avgAtsScore: number | null
  savedJobsCount: number
  matchRate: number | null
  profileViews: number
}

export interface DashboardDataDto {
  atsOverview: DashboardAtsOverviewDto
  recentVersions: DashboardResumeItemDto[]
  recommendedJobs: Awaited<ReturnType<typeof jobsService.getRecommendations>>
  activities: DashboardActivityDto[]
  analytics: DashboardAnalyticsDto
}

function buildAtsOverview(
  resumes: Awaited<ReturnType<typeof prisma.resume.findMany>>,
): DashboardAtsOverviewDto {
  if (!resumes.length) {
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

  let bestResume = resumes[0]
  let activeVersion = bestResume.versions.find((version) => version.id === bestResume.activeVersionId)

  for (const resume of resumes) {
    const active = resume.versions.find((version) => version.id === resume.activeVersionId)
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
      activeResumeId: bestResume?.id ?? null,
      activeVersionId: null,
      resumeTitle: bestResume?.title ?? 'No active resume',
      versionLabel: '',
    }
  }

  const sortedVersions = [...bestResume.versions].sort((a, b) => a.versionNumber - b.versionNumber)
  const sparkline = sortedVersions
    .map((version) => version.atsScore)
    .filter((score): score is number => score !== null)

  const prevVersion = sortedVersions
    .filter((version) => version.versionNumber < activeVersion.versionNumber && version.atsScore !== null)
    .pop()

  const delta =
    activeVersion.atsScore !== null && prevVersion && prevVersion.atsScore !== null
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

function buildRecentVersions(
  resumes: Awaited<ReturnType<typeof prisma.resume.findMany>>,
): DashboardResumeItemDto[] {
  const items: DashboardResumeItemDto[] = []

  for (const resume of resumes) {
    for (const version of resume.versions) {
      items.push({
        resumeId: resume.id,
        resumeTitle: resume.title,
        versionId: version.id,
        versionNumber: version.versionNumber,
        fileName: version.fileName,
        atsScore: version.atsScore,
        createdAt: version.createdAt.toISOString(),
        isActive: version.isActive,
      })
    }
  }

  return items
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
}

function buildAnalytics(
  resumes: Awaited<ReturnType<typeof prisma.resume.findMany>>,
  savedJobsCount: number,
  recommendedJobs: Awaited<ReturnType<typeof jobsService.getRecommendations>>,
): DashboardAnalyticsDto {
  const allScores = resumes.flatMap((resume) =>
    resume.versions.map((version) => version.atsScore).filter((score): score is number => score !== null),
  )

  const avgAtsScore = allScores.length
    ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
    : null

  const topMatches = recommendedJobs.slice(0, 5)
  const matchRate = topMatches.length
    ? Math.round(topMatches.reduce((sum, job) => sum + job.matchPercent, 0) / topMatches.length)
    : null

  const totalVersions = resumes.reduce((sum, resume) => sum + resume.versions.length, 0)
  const profileViews = savedJobsCount * 15 + resumes.length * 20 + (matchRate ?? 0)

  return {
    totalResumes: resumes.length,
    totalVersions,
    avgAtsScore,
    savedJobsCount,
    matchRate,
    profileViews,
  }
}

export const dashboardService = {
  async getDashboardData(userId: string): Promise<DashboardDataDto> {
    const [resumes, recommendedJobs, activities, savedJobIds] = await Promise.all([
      prisma.resume.findMany({
        where: { userId },
        include: { versions: true },
        orderBy: { updatedAt: 'desc' },
      }),
      jobsService.getRecommendations(userId),
      prisma.userActivity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 12,
      }),
      jobsService.getSavedJobIds(userId),
    ])

    return {
      atsOverview: buildAtsOverview(resumes),
      recentVersions: buildRecentVersions(resumes),
      recommendedJobs: recommendedJobs.slice(0, 5),
      activities: activities.map((activity) => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        createdAt: activity.createdAt.toISOString(),
        link: activity.link ?? undefined,
      })),
      analytics: buildAnalytics(resumes, savedJobIds.length, recommendedJobs),
    }
  },
}
