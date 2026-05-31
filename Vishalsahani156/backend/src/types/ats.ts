export interface KeywordMatchDto {
  keyword: string
  found: boolean
  count: number
}

export interface ResumeSuggestionDto {
  id: string
  priority: 'high' | 'medium' | 'low'
  title: string
  detail: string
}

export interface AtsAnalysisResultDto {
  score: number
  resumeText: string
  fileName: string
  keywords: KeywordMatchDto[]
  matchedCount: number
  totalKeywords: number
  missingSkills: string[]
  suggestions: ResumeSuggestionDto[]
  sections: {
    contact: boolean
    summary: boolean
    experience: boolean
    education: boolean
    skills: boolean
  }
}

export interface GeminiAtsResponse {
  atsScore: number
  matchPercentage: number
  matchingSkills: string[]
  missingKeywords: string[]
  strengths: string[]
  weaknesses: string[]
  sectionFeedback: {
    summary: string
    skills: string
    experience: string
    education: string
    projects: string
  }
  improvements: string[]
}

export interface AnalyzeAtsInput {
  resumeText: string
  fileName: string
  jobDescription: string
}
