import type { Prisma, Resume, ResumeHistory, ResumeVersion } from '@prisma/client'
import type {
  HistoryEntryDto,
  HistoryEventType,
  ManagedResumeDto,
  ResumeFileType,
  ResumeVersionDto,
  ScoreStatsDto,
} from '../types/resume.js'

export type ResumeWithVersions = Prisma.ResumeGetPayload<{ include: { versions: true } }>

export function toVersionDto(version: ResumeVersion): ResumeVersionDto {
  return {
    id: version.id,
    versionNumber: version.versionNumber,
    label: version.label,
    notes: version.notes ?? undefined,
    fileName: version.fileName,
    fileType: version.fileType as ResumeFileType,
    fileSize: version.fileSize,
    fileContent: version.fileContent,
    atsScore: version.atsScore,
    isActive: version.isActive,
    createdAt: version.createdAt.toISOString(),
  }
}

export function toManagedResumeDto(resume: ResumeWithVersions): ManagedResumeDto {
  return {
    id: resume.id,
    title: resume.title,
    description: resume.description ?? undefined,
    activeVersionId: resume.activeVersionId,
    versions: resume.versions
      .sort((a, b) => a.versionNumber - b.versionNumber)
      .map(toVersionDto),
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
  }
}

export function toHistoryDto(entry: ResumeHistory): HistoryEntryDto {
  return {
    id: entry.id,
    resumeId: entry.resumeId,
    versionId: entry.versionId ?? undefined,
    type: entry.type as HistoryEventType,
    description: entry.description,
    score: entry.score ?? undefined,
    previousScore: entry.previousScore ?? undefined,
    createdAt: entry.createdAt.toISOString(),
  }
}

export function computeScoreStats(resume: ResumeWithVersions): ScoreStatsDto {
  const scores = resume.versions
    .map((version) => version.atsScore)
    .filter((score): score is number => score !== null)

  const active = resume.versions.find((version) => version.id === resume.activeVersionId)

  return {
    current: active?.atsScore ?? null,
    best: scores.length ? Math.max(...scores) : null,
    average: scores.length
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : null,
  }
}

export function detectFileType(fileName: string, mimeType?: string): ResumeFileType | null {
  const name = fileName.toLowerCase()
  if (name.endsWith('.pdf') || mimeType === 'application/pdf') return 'pdf'
  if (
    name.endsWith('.docx') ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'docx'
  }
  return null
}

export async function readStoredFileContent(file: Express.Multer.File): Promise<string> {
  if (file.size <= 500_000) {
    const binary = file.buffer.toString('binary')
    return `[Stored file: ${file.originalname}]\n\n${Buffer.from(binary, 'binary').toString('base64')}`
  }

  return `[Resume file: ${file.originalname}]\nSize: ${Math.round(file.size / 1024)} KB\n\nFull binary not stored (file exceeds 500 KB). Metadata saved for version tracking.`
}
