import type {
  HistoryEntry,
  HistoryFilter,
  ManagedResume,
  ResumeVersion,
  ScoreStats,
  UploadVersionInput,
} from '../types/resumeManager'
import { apiRequest, apiUpload, ApiError } from './httpClient'

export const resumeManagerApi = {
  async getResumes(): Promise<ManagedResume[]> {
    const { resumes } = await apiRequest<{ resumes: ManagedResume[] }>('/resumes')
    return resumes
  },

  async getResumeById(resumeId: string): Promise<ManagedResume | null> {
    try {
      const { resume } = await apiRequest<{ resume: ManagedResume }>(`/resumes/${resumeId}`)
      return resume
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null
      throw err
    }
  },

  async getHistory(resumeId?: string, filter: HistoryFilter = 'all'): Promise<HistoryEntry[]> {
    const params = new URLSearchParams()
    if (filter !== 'all') params.set('filter', filter)

    const path = resumeId
      ? `/resumes/${resumeId}/history?${params.toString()}`
      : `/resumes/history?${params.toString()}`

    const { history } = await apiRequest<{ history: HistoryEntry[] }>(path)
    return history
  },

  async getScoreStats(resumeId: string): Promise<ScoreStats> {
    const { stats } = await apiRequest<{ stats: ScoreStats }>(`/resumes/${resumeId}/stats`)
    return stats
  },

  async uploadVersion(resumeId: string, input: UploadVersionInput): Promise<ResumeVersion> {
    const formData = new FormData()
    formData.append('file', input.file)
    if (input.label?.trim()) formData.append('label', input.label.trim())
    if (input.notes?.trim()) formData.append('notes', input.notes.trim())

    const { version } = await apiUpload<{ version: ResumeVersion }>(
      `/resumes/${resumeId}/versions`,
      formData,
    )
    return version
  },

  async setActiveVersion(resumeId: string, versionId: string): Promise<ManagedResume> {
    const { resume } = await apiRequest<{ resume: ManagedResume }>(
      `/resumes/${resumeId}/versions/${versionId}/active`,
      { method: 'PATCH' },
    )
    return resume
  },

  async deleteVersion(resumeId: string, versionId: string): Promise<ManagedResume> {
    const { resume } = await apiRequest<{ resume: ManagedResume }>(
      `/resumes/${resumeId}/versions/${versionId}`,
      { method: 'DELETE' },
    )
    return resume
  },

  async updateVersionScore(
    resumeId: string,
    versionId: string,
    score: number,
  ): Promise<ResumeVersion> {
    const { version } = await apiRequest<{ version: ResumeVersion }>(
      `/resumes/${resumeId}/versions/${versionId}/score`,
      {
        method: 'PATCH',
        body: JSON.stringify({ score }),
      },
    )
    return version
  },

  async getVersion(resumeId: string, versionId: string): Promise<ResumeVersion | null> {
    try {
      const { version } = await apiRequest<{ version: ResumeVersion }>(
        `/resumes/${resumeId}/versions/${versionId}`,
      )
      return version
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null
      throw err
    }
  },

  downloadVersionContent(version: ResumeVersion): void {
    const blob = new Blob([version.fileContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = version.fileName.replace(/\.(pdf|docx)$/i, '') + '-export.txt'
    link.click()
    URL.revokeObjectURL(url)
  },
}
