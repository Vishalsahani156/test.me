import { analyzeResume, buildImprovedResume } from '../utils/atsAnalyzer'
import { parseResumeFile } from '../utils/resumeParser'
import type { AtsAnalysisResult } from '../types/resume'

export async function analyzeResumeFile(
  file: File,
  jobDescription: string,
): Promise<AtsAnalysisResult> {
  const resumeText = await parseResumeFile(file)
  return analyzeResume({
    resumeText,
    fileName: file.name,
    jobDescription,
  })
}

export function getImprovedResumeContent(
  result: AtsAnalysisResult,
  jobDescription: string,
): string {
  return buildImprovedResume(result, jobDescription)
}
