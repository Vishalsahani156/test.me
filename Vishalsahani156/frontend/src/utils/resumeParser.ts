import mammoth from 'mammoth'
import * as pdfjs from 'pdfjs-dist'
import type { ResumeFileType } from '../types/resume'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).href

export function getResumeFileType(file: File): ResumeFileType | null {
  const name = file.name.toLowerCase()
  if (name.endsWith('.pdf') || file.type === 'application/pdf') return 'pdf'
  if (
    name.endsWith('.docx') ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'docx'
  }
  return null
}

async function parsePdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: buffer }).promise
  const pages: string[] = []

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    pages.push(text)
  }

  return pages.join('\n').replace(/\s+/g, ' ').trim()
}

async function parseDocx(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  return result.value.replace(/\s+/g, ' ').trim()
}

export async function parseResumeFile(file: File): Promise<string> {
  const type = getResumeFileType(file)
  if (!type) {
    throw new Error('Unsupported file type. Upload a PDF or DOCX resume.')
  }

  if (type === 'pdf') return parsePdf(file)
  return parseDocx(file)
}
