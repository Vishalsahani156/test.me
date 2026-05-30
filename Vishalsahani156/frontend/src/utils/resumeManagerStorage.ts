import type { HistoryEntry, ManagedResume, ResumeManagerData } from '../types/resumeManager'

const STORAGE_KEY = 'resume_manager_data'

function readStorage(): ResumeManagerData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ResumeManagerData
  } catch (e) {
    console.error('Failed to read resume manager data:', e)
    return null
  }
}

function writeStorage(data: ResumeManagerData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to write resume manager data:', e)
  }
}

function createSeedHistory(resumeId: string, versions: ManagedResume['versions']): HistoryEntry[] {
  const entries: HistoryEntry[] = []

  for (const version of versions) {
    entries.push({
      id: `hist-${version.id}-upload`,
      resumeId,
      versionId: version.id,
      type: 'upload',
      description: `Uploaded ${version.fileName} (${version.label})`,
      createdAt: version.createdAt,
    })

    if (version.atsScore !== null) {
      entries.push({
        id: `hist-${version.id}-score`,
        resumeId,
        versionId: version.id,
        type: 'score_change',
        description: `ATS score recorded for v${version.versionNumber}`,
        score: version.atsScore,
        createdAt: new Date(new Date(version.createdAt).getTime() + 3600000).toISOString(),
      })
    }
  }

  const active = versions.find((v) => v.isActive)
  if (active) {
    entries.push({
      id: `hist-${active.id}-active`,
      resumeId,
      versionId: active.id,
      type: 'activation',
      description: `Set v${active.versionNumber} as active version`,
      createdAt: new Date(new Date(active.createdAt).getTime() + 7200000).toISOString(),
    })
  }

  return entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

function createSeedData(): ResumeManagerData {
  const resume1Versions = [
    {
      id: 'v-se-1',
      versionNumber: 1,
      label: 'Initial draft',
      notes: 'First version sent to recruiters',
      fileName: 'software-engineer-v1.pdf',
      fileType: 'pdf' as const,
      fileSize: 248000,
      fileContent: 'Software Engineer Resume - Version 1\n\nExperience, projects, and education content.',
      atsScore: 62,
      isActive: false,
      createdAt: '2026-05-01T10:00:00.000Z',
    },
    {
      id: 'v-se-2',
      versionNumber: 2,
      label: 'React & Node keywords',
      notes: 'Tailored for full-stack roles',
      fileName: 'software-engineer-v2.pdf',
      fileType: 'pdf' as const,
      fileSize: 256000,
      fileContent: 'Software Engineer Resume - Version 2\n\nAdded React, Node.js, and MongoDB keywords.',
      atsScore: 78,
      isActive: true,
      createdAt: '2026-05-10T14:30:00.000Z',
    },
    {
      id: 'v-se-3',
      versionNumber: 3,
      label: 'Metrics-focused',
      fileName: 'software-engineer-v3.docx',
      fileType: 'docx' as const,
      fileSize: 198000,
      fileContent: 'Software Engineer Resume - Version 3\n\nQuantified achievements and leadership bullets.',
      atsScore: 85,
      isActive: false,
      createdAt: '2026-05-20T09:15:00.000Z',
    },
  ]

  const resume2Versions = [
    {
      id: 'v-pm-1',
      versionNumber: 1,
      label: 'Product manager base',
      fileName: 'product-manager-v1.pdf',
      fileType: 'pdf' as const,
      fileSize: 210000,
      fileContent: 'Product Manager Resume - Version 1\n\nRoadmaps, stakeholder management, and launches.',
      atsScore: 71,
      isActive: false,
      createdAt: '2026-05-05T11:00:00.000Z',
    },
    {
      id: 'v-pm-2',
      versionNumber: 2,
      label: 'SaaS-focused',
      notes: 'Optimized for B2B SaaS postings',
      fileName: 'product-manager-v2.pdf',
      fileType: 'pdf' as const,
      fileSize: 223000,
      fileContent: 'Product Manager Resume - Version 2\n\nAdded OKRs, analytics, and agile delivery keywords.',
      atsScore: 82,
      isActive: true,
      createdAt: '2026-05-18T16:45:00.000Z',
    },
  ]

  const resume1: ManagedResume = {
    id: 'resume-se',
    title: 'Software Engineer Resume',
    description: 'Full-stack and backend role applications',
    activeVersionId: 'v-se-2',
    versions: resume1Versions,
    createdAt: '2026-05-01T10:00:00.000Z',
    updatedAt: '2026-05-20T09:15:00.000Z',
  }

  const resume2: ManagedResume = {
    id: 'resume-pm',
    title: 'Product Manager Resume',
    description: 'Product leadership and strategy roles',
    activeVersionId: 'v-pm-2',
    versions: resume2Versions,
    createdAt: '2026-05-05T11:00:00.000Z',
    updatedAt: '2026-05-18T16:45:00.000Z',
  }

  return {
    resumes: [resume1, resume2],
    history: [
      ...createSeedHistory(resume1.id, resume1Versions),
      ...createSeedHistory(resume2.id, resume2Versions),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  }
}

export function loadResumeManagerData(): ResumeManagerData {
  const existing = readStorage()
  if (existing) return existing

  const seed = createSeedData()
  writeStorage(seed)
  return seed
}

export function saveResumeManagerData(data: ResumeManagerData): void {
  writeStorage(data)
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
