export type ResumeFileType = 'pdf' | 'docx'

export interface ResumeFile {
  name: string
  type: ResumeFileType
  file: File
}

export interface KeywordMatch {
  keyword: string
  found: boolean
  count: number
}

export interface ResumeSuggestion {
  id: string
  priority: 'high' | 'medium' | 'low'
  title: string
  detail: string
}

export interface AtsAnalysisResult {
  score: number
  resumeText: string
  fileName: string
  keywords: KeywordMatch[]
  matchedCount: number
  totalKeywords: number
  missingSkills: string[]
  suggestions: ResumeSuggestion[]
  sections: {
    contact: boolean
    summary: boolean
    experience: boolean
    education: boolean
    skills: boolean
  }
}

export interface AnalyzeResumeInput {
  resumeText: string
  fileName: string
  jobDescription: string
}
