export interface JobPreferencesDto {
  role: string
  locations: string[]
  skills: string[]
  experience: string
  remote: boolean
  salaryMin: number | null
  salaryMax: number | null
}

export interface JobListingDto {
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

export interface JobRecommendationDto extends JobListingDto {
  matchPercent: number
  matchedSkills: string[]
}

export const DEFAULT_PREFERENCES: JobPreferencesDto = {
  role: '',
  locations: [],
  skills: [],
  experience: '',
  remote: false,
  salaryMin: null,
  salaryMax: null,
}
