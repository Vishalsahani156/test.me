import type { Job } from '@prisma/client'
import type { JobListingDto, JobPreferencesDto, JobRecommendationDto } from '../types/jobs.js'

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase()
}

export function toJobListingDto(job: Job): JobListingDto {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    remote: job.remote,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    experience: job.experience,
    skills: job.skills,
    description: job.description,
    postedAt: job.postedAt.toISOString(),
  }
}

export function computeMatch(job: JobListingDto, prefs: JobPreferencesDto): JobRecommendationDto {
  const prefSkills = prefs.skills.map(normalizeSkill).filter(Boolean)
  const jobSkills = job.skills.map(normalizeSkill)

  const matchedSkills = prefSkills.filter((skill) =>
    jobSkills.some((jobSkill) => jobSkill.includes(skill) || skill.includes(jobSkill)),
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

export function rankRecommendations(
  jobs: JobListingDto[],
  prefs: JobPreferencesDto,
): JobRecommendationDto[] {
  return jobs.map((job) => computeMatch(job, prefs)).sort((a, b) => b.matchPercent - a.matchPercent)
}
