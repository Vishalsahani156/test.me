import { buildImprovedResume } from '../utils/atsAnalyzer'
import { parseResumeFile } from '../utils/resumeParser'
import { apiRequest } from './httpClient'
import type { AtsAnalysisResult } from '../types/resume'

const GEMINI_FALLBACK_MESSAGE =
  'AI analysis is temporarily unavailable. Please try again in a moment.'

export async function analyzeResumeFile(
  file: File,
  jobDescription: string,
): Promise<AtsAnalysisResult> {
  const resumeText = await parseResumeFile(file)

  try {
    const { result } = await apiRequest<{ result: AtsAnalysisResult }>('/ats/analyze', {
      method: 'POST',
      body: JSON.stringify({
        resumeText,
        fileName: file.name,
        jobDescription,
      }),
    })
    return result
  } catch (err) {
    const message = err instanceof Error ? err.message : GEMINI_FALLBACK_MESSAGE
    throw new Error(message || GEMINI_FALLBACK_MESSAGE)
  }
}

export function getImprovedResumeContent(
  result: AtsAnalysisResult,
  jobDescription: string,
): string {
  return buildImprovedResume(result, jobDescription)
}
