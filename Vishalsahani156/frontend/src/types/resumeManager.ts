export type ResumeFileType = 'pdf' | 'docx'

export type HistoryEventType = 'upload' | 'activation' | 'deletion' | 'score_change'

export type HistoryFilter = 'all' | HistoryEventType

export interface ResumeVersion {
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

export interface HistoryEntry {
  id: string
  resumeId: string
  versionId?: string
  type: HistoryEventType
  description: string
  score?: number
  previousScore?: number
  createdAt: string
}

export interface ManagedResume {
  id: string
  title: string
  description?: string
  activeVersionId: string | null
  versions: ResumeVersion[]
  createdAt: string
  updatedAt: string
}

export interface ResumeManagerData {
  resumes: ManagedResume[]
  history: HistoryEntry[]
}

export interface ScoreStats {
  current: number | null
  best: number | null
  average: number | null
}

export interface UploadVersionInput {
  file: File
  label?: string
  notes?: string
}
