import type {
  HistoryEntry,
  HistoryFilter,
  ManagedResume,
  ResumeFileType,
  ResumeVersion,
  ScoreStats,
  UploadVersionInput,
} from '../types/resumeManager'
import { getResumeFileType } from '../utils/resumeParser'
import {
  generateId,
  loadResumeManagerData,
  saveResumeManagerData,
} from '../utils/resumeManagerStorage'

const MOCK_DELAY_MS = 350

function delay(ms = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getData() {
  return loadResumeManagerData()
}

function persist(data: ReturnType<typeof getData>) {
  saveResumeManagerData(data)
}

function findResume(resumeId: string): ManagedResume | undefined {
  return getData().resumes.find((r) => r.id === resumeId)
}

async function readFileContent(file: File): Promise<string> {
  if (file.size <= 500_000) {
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i])
    }
    return `[Stored file: ${file.name}]\n\n${btoa(binary)}`
  }

  return `[Resume file: ${file.name}]\nSize: ${Math.round(file.size / 1024)} KB\n\nFull binary not stored locally (file exceeds 500 KB). Metadata saved for version tracking.`
}

function addHistory(entry: Omit<HistoryEntry, 'id' | 'createdAt'>): void {
  const data = getData()
  data.history.unshift({
    ...entry,
    id: generateId('hist'),
    createdAt: new Date().toISOString(),
  })
  persist(data)
}

function computeScoreStats(resume: ManagedResume): ScoreStats {
  const scores = resume.versions
    .map((v) => v.atsScore)
    .filter((score): score is number => score !== null)

  const active = resume.versions.find((v) => v.id === resume.activeVersionId)

  return {
    current: active?.atsScore ?? null,
    best: scores.length ? Math.max(...scores) : null,
    average: scores.length
      ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
      : null,
  }
}

export const resumeManagerApi = {
  async getResumes(): Promise<ManagedResume[]> {
    await delay()
    return getData().resumes
  },

  async getResumeById(resumeId: string): Promise<ManagedResume | null> {
    await delay()
    return findResume(resumeId) ?? null
  },

  async getHistory(resumeId?: string, filter: HistoryFilter = 'all'): Promise<HistoryEntry[]> {
    await delay()
    let entries = getData().history

    if (resumeId) {
      entries = entries.filter((e) => e.resumeId === resumeId)
    }

    if (filter !== 'all') {
      entries = entries.filter((e) => e.type === filter)
    }

    return entries
  },

  async getScoreStats(resumeId: string): Promise<ScoreStats> {
    await delay()
    const resume = findResume(resumeId)
    if (!resume) return { current: null, best: null, average: null }
    return computeScoreStats(resume)
  },

  async uploadVersion(resumeId: string, input: UploadVersionInput): Promise<ResumeVersion> {
    await delay(500)
    const data = getData()
    const resume = data.resumes.find((r) => r.id === resumeId)
    if (!resume) throw new Error('Resume not found')

    const fileType = getResumeFileType(input.file)
    if (!fileType) throw new Error('Only PDF and DOCX files are supported')

    const nextNumber =
      resume.versions.reduce((max, v) => Math.max(max, v.versionNumber), 0) + 1

    const fileContent = await readFileContent(input.file)

    const version: ResumeVersion = {
      id: generateId('ver'),
      versionNumber: nextNumber,
      label: input.label?.trim() || `Version ${nextNumber}`,
      notes: input.notes?.trim() || undefined,
      fileName: input.file.name,
      fileType: fileType as ResumeFileType,
      fileSize: input.file.size,
      fileContent,
      atsScore: null,
      isActive: false,
      createdAt: new Date().toISOString(),
    }

    resume.versions.push(version)
    resume.updatedAt = new Date().toISOString()
    persist(data)

    addHistory({
      resumeId,
      versionId: version.id,
      type: 'upload',
      description: `Uploaded ${version.fileName} (${version.label})`,
    })

    return version
  },

  async setActiveVersion(resumeId: string, versionId: string): Promise<ManagedResume> {
    await delay()
    const data = getData()
    const resume = data.resumes.find((r) => r.id === resumeId)
    if (!resume) throw new Error('Resume not found')

    const version = resume.versions.find((v) => v.id === versionId)
    if (!version) throw new Error('Version not found')

    resume.versions.forEach((v) => {
      v.isActive = v.id === versionId
    })
    resume.activeVersionId = versionId
    resume.updatedAt = new Date().toISOString()
    persist(data)

    addHistory({
      resumeId,
      versionId,
      type: 'activation',
      description: `Set v${version.versionNumber} as active version`,
    })

    return resume
  },

  async deleteVersion(resumeId: string, versionId: string): Promise<ManagedResume> {
    await delay()
    const data = getData()
    const resume = data.resumes.find((r) => r.id === resumeId)
    if (!resume) throw new Error('Resume not found')

    const version = resume.versions.find((v) => v.id === versionId)
    if (!version) throw new Error('Version not found')

    if (resume.versions.length <= 1) {
      throw new Error('Cannot delete the only remaining version')
    }

    resume.versions = resume.versions.filter((v) => v.id !== versionId)

    if (resume.activeVersionId === versionId) {
      const fallback = resume.versions[resume.versions.length - 1]
      resume.versions.forEach((v) => {
        v.isActive = v.id === fallback.id
      })
      resume.activeVersionId = fallback.id
    }

    resume.updatedAt = new Date().toISOString()
    persist(data)

    addHistory({
      resumeId,
      versionId,
      type: 'deletion',
      description: `Deleted v${version.versionNumber} (${version.fileName})`,
    })

    return resume
  },

  async updateVersionScore(
    resumeId: string,
    versionId: string,
    score: number,
  ): Promise<ResumeVersion> {
    await delay()
    const data = getData()
    const resume = data.resumes.find((r) => r.id === resumeId)
    if (!resume) throw new Error('Resume not found')

    const version = resume.versions.find((v) => v.id === versionId)
    if (!version) throw new Error('Version not found')

    const previousScore = version.atsScore
    version.atsScore = score
    resume.updatedAt = new Date().toISOString()
    persist(data)

    addHistory({
      resumeId,
      versionId,
      type: 'score_change',
      description: `ATS score updated for v${version.versionNumber}`,
      score,
      previousScore: previousScore ?? undefined,
    })

    return version
  },

  async getVersion(resumeId: string, versionId: string): Promise<ResumeVersion | null> {
    await delay()
    const resume = findResume(resumeId)
    return resume?.versions.find((v) => v.id === versionId) ?? null
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
