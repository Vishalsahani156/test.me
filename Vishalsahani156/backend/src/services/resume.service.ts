import type { ActivityType } from '@prisma/client'
import type { Express } from 'express'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/errors.js'
import { activityService } from './activity.service.js'
import {
  computeScoreStats,
  detectFileType,
  readStoredFileContent,
  toHistoryDto,
  toManagedResumeDto,
  toVersionDto,
  type ResumeWithVersions,
} from './resume.mapper.js'
import type { HistoryEventType, ManagedResumeDto, ScoreStatsDto } from '../types/resume.js'

const resumeInclude = { versions: { orderBy: { versionNumber: 'asc' as const } } }

async function getOwnedResume(userId: string, resumeId: string): Promise<ResumeWithVersions> {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
    include: resumeInclude,
  })
  if (!resume) throw new AppError('Resume not found', 404)
  return resume
}

async function addHistory(input: {
  userId: string
  resumeId: string
  versionId?: string
  type: HistoryEventType
  description: string
  score?: number
  previousScore?: number
}) {
  const entry = await prisma.resumeHistory.create({ data: input })

  const activityType = input.type as ActivityType
  if (['upload', 'score_change', 'activation', 'deletion'].includes(activityType)) {
    await activityService.log({
      userId: input.userId,
      type: activityType,
      title: input.type.replace('_', ' '),
      description: input.description,
      link: `/resume-manager/${input.resumeId}`,
    })
  }

  return entry
}

async function seedDemoResumes(userId: string): Promise<void> {
  const count = await prisma.resume.count({ where: { userId } })
  if (count > 0) return

  const resume1 = await prisma.resume.create({
    data: {
      userId,
      title: 'Software Engineer Resume',
      description: 'Full-stack and backend role applications',
    },
  })

  const v1 = await prisma.resumeVersion.create({
    data: {
      resumeId: resume1.id,
      versionNumber: 1,
      label: 'Initial draft',
      notes: 'First version sent to recruiters',
      fileName: 'software-engineer-v1.pdf',
      fileType: 'pdf',
      fileSize: 248000,
      fileContent: 'Software Engineer Resume - Version 1\n\nExperience, projects, and education content.',
      atsScore: 62,
      isActive: false,
      createdAt: new Date('2026-05-01T10:00:00.000Z'),
    },
  })

  const v2 = await prisma.resumeVersion.create({
    data: {
      resumeId: resume1.id,
      versionNumber: 2,
      label: 'React & Node keywords',
      notes: 'Tailored for full-stack roles',
      fileName: 'software-engineer-v2.pdf',
      fileType: 'pdf',
      fileSize: 256000,
      fileContent: 'Software Engineer Resume - Version 2\n\nAdded React, Node.js, and MongoDB keywords.',
      atsScore: 78,
      isActive: true,
      createdAt: new Date('2026-05-10T14:30:00.000Z'),
    },
  })

  await prisma.resumeVersion.create({
    data: {
      resumeId: resume1.id,
      versionNumber: 3,
      label: 'Metrics-focused',
      fileName: 'software-engineer-v3.docx',
      fileType: 'docx',
      fileSize: 198000,
      fileContent: 'Software Engineer Resume - Version 3\n\nQuantified achievements and leadership bullets.',
      atsScore: 85,
      isActive: false,
      createdAt: new Date('2026-05-20T09:15:00.000Z'),
    },
  })

  await prisma.resume.update({
    where: { id: resume1.id },
    data: { activeVersionId: v2.id },
  })

  const resume2 = await prisma.resume.create({
    data: {
      userId,
      title: 'Product Manager Resume',
      description: 'Product leadership and strategy roles',
    },
  })

  await prisma.resumeVersion.create({
    data: {
      resumeId: resume2.id,
      versionNumber: 1,
      label: 'Product manager base',
      fileName: 'product-manager-v1.pdf',
      fileType: 'pdf',
      fileSize: 210000,
      fileContent: 'Product Manager Resume - Version 1\n\nRoadmaps, stakeholder management, and launches.',
      atsScore: 71,
      isActive: false,
      createdAt: new Date('2026-05-05T11:00:00.000Z'),
    },
  })

  const pmV2 = await prisma.resumeVersion.create({
    data: {
      resumeId: resume2.id,
      versionNumber: 2,
      label: 'SaaS-focused',
      notes: 'Optimized for B2B SaaS postings',
      fileName: 'product-manager-v2.pdf',
      fileType: 'pdf',
      fileSize: 223000,
      fileContent: 'Product Manager Resume - Version 2\n\nAdded OKRs, analytics, and agile delivery keywords.',
      atsScore: 82,
      isActive: true,
      createdAt: new Date('2026-05-18T16:45:00.000Z'),
    },
  })

  await prisma.resume.update({
    where: { id: resume2.id },
    data: { activeVersionId: pmV2.id },
  })
}

export const resumeService = {
  async listResumes(userId: string): Promise<ManagedResumeDto[]> {
    await seedDemoResumes(userId)
    const resumes = await prisma.resume.findMany({
      where: { userId },
      include: resumeInclude,
      orderBy: { updatedAt: 'desc' },
    })
    return resumes.map(toManagedResumeDto)
  },

  async createResume(userId: string, title: string, description?: string): Promise<ManagedResumeDto> {
    const resume = await prisma.resume.create({
      data: {
        userId,
        title: title.trim(),
        description: description?.trim() || null,
      },
      include: resumeInclude,
    })
    return toManagedResumeDto(resume)
  },

  async getResumeById(userId: string, resumeId: string): Promise<ManagedResumeDto | null> {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: resumeInclude,
    })
    return resume ? toManagedResumeDto(resume) : null
  },

  async getHistory(userId: string, resumeId?: string, filter = 'all') {
    await seedDemoResumes(userId)

    const entries = await prisma.resumeHistory.findMany({
      where: {
        userId,
        ...(resumeId ? { resumeId } : {}),
        ...(filter !== 'all' ? { type: filter } : {}),
      },
      orderBy: { createdAt: 'desc' },
    })

    return entries.map(toHistoryDto)
  },

  async getScoreStats(userId: string, resumeId: string): Promise<ScoreStatsDto> {
    const resume = await getOwnedResume(userId, resumeId)
    return computeScoreStats(resume)
  },

  async uploadVersion(
    userId: string,
    resumeId: string,
    file: Express.Multer.File,
    label?: string,
    notes?: string,
  ) {
    const resume = await getOwnedResume(userId, resumeId)
    const fileType = detectFileType(file.originalname, file.mimetype)
    if (!fileType) throw new AppError('Only PDF and DOCX files are supported', 400)

    const nextNumber =
      resume.versions.reduce((max, version) => Math.max(max, version.versionNumber), 0) + 1

    const fileContent = await readStoredFileContent(file)
    const versionLabel = label?.trim() || `Version ${nextNumber}`

    const version = await prisma.resumeVersion.create({
      data: {
        resumeId,
        versionNumber: nextNumber,
        label: versionLabel,
        notes: notes?.trim() || null,
        fileName: file.originalname,
        fileType,
        fileSize: file.size,
        fileContent,
        isActive: false,
      },
    })

    await prisma.resume.update({
      where: { id: resumeId },
      data: { updatedAt: new Date() },
    })

    await addHistory({
      userId,
      resumeId,
      versionId: version.id,
      type: 'upload',
      description: `Uploaded ${version.fileName} (${version.label})`,
    })

    return toVersionDto(version)
  },

  async setActiveVersion(userId: string, resumeId: string, versionId: string) {
    const resume = await getOwnedResume(userId, resumeId)
    const version = resume.versions.find((entry) => entry.id === versionId)
    if (!version) throw new AppError('Version not found', 404)

    await prisma.$transaction([
      prisma.resumeVersion.updateMany({
        where: { resumeId },
        data: { isActive: false },
      }),
      prisma.resumeVersion.update({
        where: { id: versionId },
        data: { isActive: true },
      }),
      prisma.resume.update({
        where: { id: resumeId },
        data: { activeVersionId: versionId, updatedAt: new Date() },
      }),
    ])

    await addHistory({
      userId,
      resumeId,
      versionId,
      type: 'activation',
      description: `Set v${version.versionNumber} as active version`,
    })

    return toManagedResumeDto(await getOwnedResume(userId, resumeId))
  },

  async deleteVersion(userId: string, resumeId: string, versionId: string) {
    const resume = await getOwnedResume(userId, resumeId)
    const version = resume.versions.find((entry) => entry.id === versionId)
    if (!version) throw new AppError('Version not found', 404)
    if (resume.versions.length <= 1) {
      throw new AppError('Cannot delete the only remaining version', 400)
    }

    const remaining = resume.versions.filter((entry) => entry.id !== versionId)
    const fallback = remaining[remaining.length - 1]
    const nextActiveId = resume.activeVersionId === versionId ? fallback.id : resume.activeVersionId

    await prisma.$transaction([
      prisma.resumeVersion.delete({ where: { id: versionId } }),
      prisma.resumeVersion.updateMany({
        where: { resumeId },
        data: { isActive: false },
      }),
      ...(nextActiveId
        ? [
            prisma.resumeVersion.update({
              where: { id: nextActiveId },
              data: { isActive: true },
            }),
          ]
        : []),
      prisma.resume.update({
        where: { id: resumeId },
        data: { activeVersionId: nextActiveId, updatedAt: new Date() },
      }),
    ])

    await addHistory({
      userId,
      resumeId,
      versionId,
      type: 'deletion',
      description: `Deleted v${version.versionNumber} (${version.fileName})`,
    })

    return toManagedResumeDto(await getOwnedResume(userId, resumeId))
  },

  async updateVersionScore(userId: string, resumeId: string, versionId: string, score: number) {
    const resume = await getOwnedResume(userId, resumeId)
    const version = resume.versions.find((entry) => entry.id === versionId)
    if (!version) throw new AppError('Version not found', 404)

    const previousScore = version.atsScore
    const updated = await prisma.resumeVersion.update({
      where: { id: versionId },
      data: { atsScore: score },
    })

    await prisma.resume.update({
      where: { id: resumeId },
      data: { updatedAt: new Date() },
    })

    await addHistory({
      userId,
      resumeId,
      versionId,
      type: 'score_change',
      description: `ATS score updated for v${version.versionNumber}`,
      score,
      previousScore: previousScore ?? undefined,
    })

    return toVersionDto(updated)
  },

  async getVersion(userId: string, resumeId: string, versionId: string) {
    const resume = await getOwnedResume(userId, resumeId)
    const version = resume.versions.find((entry) => entry.id === versionId)
    return version ? toVersionDto(version) : null
  },
}
