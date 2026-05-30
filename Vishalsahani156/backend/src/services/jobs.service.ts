import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/errors.js'
import { activityService } from './activity.service.js'
import { computeMatch, rankRecommendations, toJobListingDto } from './jobMatching.service.js'
import { DEFAULT_PREFERENCES, type JobPreferencesDto } from '../types/jobs.js'

function toPreferencesDto(record: {
  role: string
  locations: string[]
  skills: string[]
  experience: string
  remote: boolean
  salaryMin: number | null
  salaryMax: number | null
}): JobPreferencesDto {
  return {
    role: record.role,
    locations: record.locations,
    skills: record.skills,
    experience: record.experience,
    remote: record.remote,
    salaryMin: record.salaryMin,
    salaryMax: record.salaryMax,
  }
}

async function getOrCreatePreferences(userId: string): Promise<JobPreferencesDto> {
  const existing = await prisma.jobPreference.findUnique({ where: { userId } })
  if (existing) return toPreferencesDto(existing)

  const created = await prisma.jobPreference.create({
    data: {
      userId,
      role: DEFAULT_PREFERENCES.role,
      locations: DEFAULT_PREFERENCES.locations,
      skills: DEFAULT_PREFERENCES.skills,
      experience: DEFAULT_PREFERENCES.experience,
      remote: DEFAULT_PREFERENCES.remote,
      salaryMin: DEFAULT_PREFERENCES.salaryMin,
      salaryMax: DEFAULT_PREFERENCES.salaryMax,
    },
  })

  return toPreferencesDto(created)
}

export const jobsService = {
  async getAllJobs() {
    const jobs = await prisma.job.findMany({ orderBy: { postedAt: 'desc' } })
    return jobs.map(toJobListingDto)
  },

  async getPreferences(userId: string) {
    return getOrCreatePreferences(userId)
  },

  async savePreferences(userId: string, input: JobPreferencesDto) {
    const saved = await prisma.jobPreference.upsert({
      where: { userId },
      update: {
        role: input.role.trim(),
        locations: input.locations.map((loc) => loc.trim()).filter(Boolean),
        skills: input.skills.map((skill) => skill.trim()).filter(Boolean),
        experience: input.experience.trim(),
        remote: input.remote,
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
      },
      create: {
        userId,
        role: input.role.trim(),
        locations: input.locations.map((loc) => loc.trim()).filter(Boolean),
        skills: input.skills.map((skill) => skill.trim()).filter(Boolean),
        experience: input.experience.trim(),
        remote: input.remote,
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
      },
    })

    await activityService.log({
      userId,
      type: 'preferences_updated',
      title: 'Preferences updated',
      description: 'Job alert preferences were saved',
      link: '/job-alerts?tab=preferences',
    })

    return toPreferencesDto(saved)
  },

  async getRecommendations(userId: string) {
    const [jobs, prefs] = await Promise.all([
      prisma.job.findMany({ orderBy: { postedAt: 'desc' } }),
      getOrCreatePreferences(userId),
    ])

    return rankRecommendations(jobs.map(toJobListingDto), prefs)
  },

  async getSavedJobIds(userId: string) {
    const saved = await prisma.savedJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { jobId: true },
    })
    return saved.map((entry) => entry.jobId)
  },

  async getSavedJobs(userId: string) {
    const saved = await prisma.savedJob.findMany({
      where: { userId },
      include: { job: true },
      orderBy: { createdAt: 'desc' },
    })
    return saved.map((entry) => toJobListingDto(entry.job))
  },

  async isJobSaved(userId: string, jobId: string) {
    const saved = await prisma.savedJob.findUnique({
      where: { userId_jobId: { userId, jobId } },
    })
    return Boolean(saved)
  },

  async toggleSaveJob(userId: string, jobId: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) throw new AppError('Job not found', 404)

    const existing = await prisma.savedJob.findUnique({
      where: { userId_jobId: { userId, jobId } },
    })

    if (existing) {
      await prisma.savedJob.delete({ where: { id: existing.id } })
      await activityService.log({
        userId,
        type: 'job_unsaved',
        title: 'Job removed',
        description: `${job.title} at ${job.company}`,
        link: '/job-alerts?tab=saved',
      })
      return false
    }

    await prisma.savedJob.create({ data: { userId, jobId } })
    await activityService.log({
      userId,
      type: 'job_saved',
      title: 'Job saved',
      description: `${job.title} at ${job.company}`,
      link: '/job-alerts?tab=saved',
    })
    return true
  },

  async getRecommendationForJob(userId: string, jobId: string) {
    const [job, prefs] = await Promise.all([
      prisma.job.findUnique({ where: { id: jobId } }),
      getOrCreatePreferences(userId),
    ])
    if (!job) throw new AppError('Job not found', 404)
    return computeMatch(toJobListingDto(job), prefs)
  },
}
