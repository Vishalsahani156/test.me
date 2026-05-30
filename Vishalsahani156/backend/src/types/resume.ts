export type ResumeFileType = 'pdf' | 'docx'

export type HistoryEventType = 'upload' | 'activation' | 'deletion' | 'score_change'

export interface ResumeVersionDto {
  id: string
  versionNumber: number
  label: string
  notes?: string
  fileName: string
  fileType: ResumeFileType
  fileSize: number
  fileContent: string
  atsScore: number | null
  isActive: boolean
  createdAt: string
}

export interface HistoryEntryDto {
  id: string
  resumeId: string
  versionId?: string
  type: HistoryEventType
  description: string
  score?: number
  previousScore?: number
  createdAt: string
}

export interface ManagedResumeDto {
  id: string
  title: string
  description?: string
  activeVersionId: string | null
  versions: ResumeVersionDto[]
  createdAt: string
  updatedAt: string
}

export interface ScoreStatsDto {
  current: number | null
  best: number | null
  average: number | null
}
