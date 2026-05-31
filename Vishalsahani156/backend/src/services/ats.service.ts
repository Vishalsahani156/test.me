import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env.js'
import type {
  AnalyzeAtsInput,
  AtsAnalysisResultDto,
  GeminiAtsResponse,
  ResumeSuggestionDto,
} from '../types/ats.js'
import { AppError } from '../utils/errors.js'

const SECTION_PATTERNS = {
  contact: /\b(email|phone|linkedin|github|@\w+\.\w+|\+?\d[\d\s\-()]{7,})\b/i,
  summary: /\b(summary|profile|objective|about me)\b/i,
  experience: /\b(experience|employment|work history|professional experience)\b/i,
  education: /\b(education|degree|university|college|b\.?s\.?|m\.?s\.?|bachelor|master)\b/i,
  skills: /\b(skills|technologies|technical skills|core competencies|stack)\b/i,
}

const ATS_PROMPT = `You are an ATS Resume Analyzer.

Analyze the provided Resume and Job Description.

Return ONLY valid JSON in the following format:

{
"atsScore": 85,
"matchPercentage": 88,
"matchingSkills": [],
"missingKeywords": [],
"strengths": [],
"weaknesses": [],
"sectionFeedback": {
"summary": "",
"skills": "",
"experience": "",
"education": "",
"projects": ""
},
"improvements": []
}

RESUME:
{{resumeText}}

JOB DESCRIPTION:
{{jobDescription}}

Compare the resume against the job description and calculate ATS score realistically. Identify missing keywords, matching skills, strengths, weaknesses, and provide actionable improvement suggestions.

IMPORTANT:
Return JSON only. No markdown. No explanations.`

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(100, Math.round(value)))
}

function countKeywordInText(resumeText: string, keyword: string): number {
  const normalized = resumeText.toLowerCase()
  const escaped = keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`\\b${escaped}\\b`, 'g')
  return normalized.match(pattern)?.length ?? 0
}

function detectSections(resumeText: string): AtsAnalysisResultDto['sections'] {
  return {
    contact: SECTION_PATTERNS.contact.test(resumeText),
    summary: SECTION_PATTERNS.summary.test(resumeText),
    experience: SECTION_PATTERNS.experience.test(resumeText),
    education: SECTION_PATTERNS.education.test(resumeText),
    skills: SECTION_PATTERNS.skills.test(resumeText),
  }
}

function sectionFeedbackIndicatesPresent(feedback: string): boolean {
  const normalized = feedback.trim().toLowerCase()
  if (!normalized) return false
  return !/\b(missing|not found|absent|no section|lacking|none|n\/a)\b/.test(normalized)
}

function mergeSections(
  resumeText: string,
  sectionFeedback: GeminiAtsResponse['sectionFeedback'],
): AtsAnalysisResultDto['sections'] {
  const detected = detectSections(resumeText)

  return {
    contact: detected.contact,
    summary: detected.summary || sectionFeedbackIndicatesPresent(sectionFeedback.summary),
    experience: detected.experience || sectionFeedbackIndicatesPresent(sectionFeedback.experience),
    education: detected.education || sectionFeedbackIndicatesPresent(sectionFeedback.education),
    skills: detected.skills || sectionFeedbackIndicatesPresent(sectionFeedback.skills),
  }
}

function buildSuggestions(gemini: GeminiAtsResponse): ResumeSuggestionDto[] {
  const suggestions: ResumeSuggestionDto[] = []
  let idCounter = 0

  const addSuggestion = (
    priority: ResumeSuggestionDto['priority'],
    title: string,
    detail: string,
  ) => {
    idCounter += 1
    suggestions.push({
      id: `gemini-${idCounter}`,
      priority,
      title,
      detail,
    })
  }

  for (const weakness of gemini.weaknesses ?? []) {
    if (weakness.trim()) {
      addSuggestion('high', 'Weakness', weakness.trim())
    }
  }

  for (const improvement of gemini.improvements ?? []) {
    if (improvement.trim()) {
      addSuggestion('high', 'Improvement', improvement.trim())
    }
  }

  const sectionEntries: Array<[string, string]> = [
    ['Summary', gemini.sectionFeedback?.summary ?? ''],
    ['Skills', gemini.sectionFeedback?.skills ?? ''],
    ['Experience', gemini.sectionFeedback?.experience ?? ''],
    ['Education', gemini.sectionFeedback?.education ?? ''],
    ['Projects', gemini.sectionFeedback?.projects ?? ''],
  ]

  for (const [section, feedback] of sectionEntries) {
    if (feedback.trim()) {
      addSuggestion('medium', `${section} feedback`, feedback.trim())
    }
  }

  for (const strength of gemini.strengths ?? []) {
    if (strength.trim()) {
      addSuggestion('low', 'Strength', strength.trim())
    }
  }

  return suggestions
}

function parseGeminiJson(raw: string): GeminiAtsResponse {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const jsonText = (fenced?.[1] ?? trimmed).trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText)
  } catch {
    throw new AppError('Gemini returned an invalid analysis response. Please try again.', 502)
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new AppError('Gemini returned an invalid analysis response. Please try again.', 502)
  }

  const data = parsed as Partial<GeminiAtsResponse>

  return {
    atsScore: clampScore(Number(data.atsScore)),
    matchPercentage: clampScore(Number(data.matchPercentage)),
    matchingSkills: Array.isArray(data.matchingSkills)
      ? data.matchingSkills.filter((item): item is string => typeof item === 'string')
      : [],
    missingKeywords: Array.isArray(data.missingKeywords)
      ? data.missingKeywords.filter((item): item is string => typeof item === 'string')
      : [],
    strengths: Array.isArray(data.strengths)
      ? data.strengths.filter((item): item is string => typeof item === 'string')
      : [],
    weaknesses: Array.isArray(data.weaknesses)
      ? data.weaknesses.filter((item): item is string => typeof item === 'string')
      : [],
    sectionFeedback: {
      summary: typeof data.sectionFeedback?.summary === 'string' ? data.sectionFeedback.summary : '',
      skills: typeof data.sectionFeedback?.skills === 'string' ? data.sectionFeedback.skills : '',
      experience:
        typeof data.sectionFeedback?.experience === 'string' ? data.sectionFeedback.experience : '',
      education:
        typeof data.sectionFeedback?.education === 'string' ? data.sectionFeedback.education : '',
      projects:
        typeof data.sectionFeedback?.projects === 'string' ? data.sectionFeedback.projects : '',
    },
    improvements: Array.isArray(data.improvements)
      ? data.improvements.filter((item): item is string => typeof item === 'string')
      : [],
  }
}

function mapGeminiToResult(
  gemini: GeminiAtsResponse,
  input: AnalyzeAtsInput,
): AtsAnalysisResultDto {
  const matchingSkills = gemini.matchingSkills
  const missingKeywords = gemini.missingKeywords

  const keywords = [
    ...matchingSkills.map((keyword) => ({
      keyword,
      found: true,
      count: Math.max(1, countKeywordInText(input.resumeText, keyword)),
    })),
    ...missingKeywords.map((keyword) => ({
      keyword,
      found: false,
      count: 0,
    })),
  ]

  const matchedCount = matchingSkills.length
  const totalKeywords = matchingSkills.length + missingKeywords.length

  return {
    score: gemini.atsScore,
    resumeText: input.resumeText,
    fileName: input.fileName,
    keywords,
    matchedCount,
    totalKeywords,
    missingSkills: missingKeywords,
    suggestions: buildSuggestions(gemini),
    sections: mergeSections(input.resumeText, gemini.sectionFeedback),
  }
}

export const atsService = {
  async analyze(input: AnalyzeAtsInput): Promise<AtsAnalysisResultDto> {
    if (!env.gemini.apiKey) {
      throw new AppError(
        'ATS analysis is temporarily unavailable. Please contact support or try again later.',
        503,
      )
    }

    if (input.resumeText.trim().length < 50) {
      throw new AppError('Could not extract enough text from the resume. Try a different file.', 400)
    }

    if (input.jobDescription.trim().length < 30) {
      throw new AppError('Job description must be at least 30 characters.', 400)
    }

    const prompt = ATS_PROMPT.replace('{{resumeText}}', input.resumeText.trim()).replace(
      '{{jobDescription}}',
      input.jobDescription.trim(),
    )

    try {
      const client = new GoogleGenerativeAI(env.gemini.apiKey)
      const model = client.getGenerativeModel({
        model: env.gemini.model,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      })

      const response = await model.generateContent(prompt)
      const rawText = response.response.text()

      if (!rawText?.trim()) {
        throw new AppError(
          'AI analysis failed to produce results. Please try again in a moment.',
          502,
        )
      }

      const geminiResult = parseGeminiJson(rawText)
      return mapGeminiToResult(geminiResult, input)
    } catch (err) {
      if (err instanceof AppError) throw err

      console.error('Gemini ATS analysis failed:', err)
      throw new AppError(
        'AI analysis is temporarily unavailable. Please try again in a moment.',
        502,
      )
    }
  },
}
