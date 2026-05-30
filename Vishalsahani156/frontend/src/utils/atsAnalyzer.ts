import type { AnalyzeResumeInput, AtsAnalysisResult, KeywordMatch, ResumeSuggestion } from '../types/resume'

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'shall', 'can', 'need', 'dare', 'ought', 'used', 'i', 'you', 'he', 'she', 'it', 'we',
  'they', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'your',
  'our', 'their', 'my', 'his', 'her', 'its', 'about', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under',
  'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how',
  'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'able', 'work',
  'working', 'role', 'position', 'job', 'team', 'company', 'years', 'year', 'experience',
  'required', 'preferred', 'including', 'using', 'use', 'well', 'strong', 'excellent',
])

const SECTION_PATTERNS = {
  contact: /\b(email|phone|linkedin|github|@\w+\.\w+|\+?\d[\d\s\-()]{7,})\b/i,
  summary: /\b(summary|profile|objective|about me)\b/i,
  experience: /\b(experience|employment|work history|professional experience)\b/i,
  education: /\b(education|degree|university|college|b\.?s\.?|m\.?s\.?|bachelor|master)\b/i,
  skills: /\b(skills|technologies|technical skills|core competencies|stack)\b/i,
}

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s+#.+/-]/g, ' ')
}

function extractKeywords(jobDescription: string): string[] {
  const normalized = normalizeText(jobDescription)
  const tokens = normalized.split(/\s+/).filter(Boolean)
  const counts = new Map<string, number>()

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]
    if (token.length < 2 || STOP_WORDS.has(token)) continue

    counts.set(token, (counts.get(token) ?? 0) + 1)

    if (i < tokens.length - 1) {
      const bigram = `${token} ${tokens[i + 1]}`
      if (!STOP_WORDS.has(tokens[i + 1]) && bigram.length > 4) {
        counts.set(bigram, (counts.get(bigram) ?? 0) + 1)
      }
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([keyword]) => keyword)
}

function analyzeKeywords(resumeText: string, keywords: string[]): KeywordMatch[] {
  const normalizedResume = normalizeText(resumeText)

  return keywords.map((keyword) => {
    const pattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')
    const matches = normalizedResume.match(pattern)
    const count = matches?.length ?? 0
    return { keyword, found: count > 0, count }
  })
}

function detectSections(resumeText: string): AtsAnalysisResult['sections'] {
  return {
    contact: SECTION_PATTERNS.contact.test(resumeText),
    summary: SECTION_PATTERNS.summary.test(resumeText),
    experience: SECTION_PATTERNS.experience.test(resumeText),
    education: SECTION_PATTERNS.education.test(resumeText),
    skills: SECTION_PATTERNS.skills.test(resumeText),
  }
}

function buildSuggestions(
  sections: AtsAnalysisResult['sections'],
  missingSkills: string[],
  keywordScore: number,
  resumeText: string,
): ResumeSuggestion[] {
  const suggestions: ResumeSuggestion[] = []

  if (missingSkills.length > 0) {
    suggestions.push({
      id: 'missing-skills',
      priority: 'high',
      title: 'Add missing keywords from the job description',
      detail: `Include relevant terms such as ${missingSkills.slice(0, 6).join(', ')} in your skills and experience bullets.`,
    })
  }

  if (keywordScore < 60) {
    suggestions.push({
      id: 'keyword-density',
      priority: 'high',
      title: 'Improve keyword alignment',
      detail: 'Mirror important phrases from the job posting in your summary and recent role descriptions.',
    })
  }

  if (!sections.contact) {
    suggestions.push({
      id: 'contact-info',
      priority: 'high',
      title: 'Add clear contact information',
      detail: 'Include email, phone, and LinkedIn/GitHub links at the top of your resume.',
    })
  }

  if (!sections.summary) {
    suggestions.push({
      id: 'summary-section',
      priority: 'medium',
      title: 'Add a professional summary',
      detail: 'Write a 2–3 line summary tailored to the target role with top keywords.',
    })
  }

  if (!sections.skills) {
    suggestions.push({
      id: 'skills-section',
      priority: 'medium',
      title: 'Add a dedicated skills section',
      detail: 'List technical and soft skills as scannable bullet points or comma-separated tags.',
    })
  }

  if (!sections.experience) {
    suggestions.push({
      id: 'experience-section',
      priority: 'high',
      title: 'Highlight work experience clearly',
      detail: 'Use a labeled Experience section with role, company, dates, and quantified achievements.',
    })
  }

  if (resumeText.length < 400) {
    suggestions.push({
      id: 'content-length',
      priority: 'medium',
      title: 'Expand resume content',
      detail: 'Add more detail to project outcomes, metrics, and tools used so ATS systems can parse your background.',
    })
  }

  if (/\t|\|{3,}|_{3,}/.test(resumeText)) {
    suggestions.push({
      id: 'formatting',
      priority: 'low',
      title: 'Simplify formatting',
      detail: 'Avoid tables, text boxes, and multi-column layouts that ATS parsers often miss.',
    })
  }

  return suggestions
}

function calculateScore(
  keywordMatches: KeywordMatch[],
  sections: AtsAnalysisResult['sections'],
  resumeText: string,
): number {
  const matched = keywordMatches.filter((k) => k.found).length
  const keywordScore = keywordMatches.length ? (matched / keywordMatches.length) * 100 : 50

  const sectionValues = Object.values(sections)
  const sectionScore = (sectionValues.filter(Boolean).length / sectionValues.length) * 100

  const lengthScore = resumeText.length >= 400 && resumeText.length <= 6000 ? 100 : 70

  return Math.round(keywordScore * 0.55 + sectionScore * 0.3 + lengthScore * 0.15)
}

export function analyzeResume(input: AnalyzeResumeInput): AtsAnalysisResult {
  const { resumeText, fileName, jobDescription } = input
  const keywords = extractKeywords(jobDescription)
  const keywordMatches = analyzeKeywords(resumeText, keywords)
  const matchedCount = keywordMatches.filter((k) => k.found).length
  const missingSkills = keywordMatches.filter((k) => !k.found).map((k) => k.keyword)
  const sections = detectSections(resumeText)
  const keywordScore = keywords.length ? (matchedCount / keywords.length) * 100 : 0
  const score = calculateScore(keywordMatches, sections, resumeText)
  const suggestions = buildSuggestions(sections, missingSkills, keywordScore, resumeText)

  return {
    score,
    resumeText,
    fileName,
    keywords: keywordMatches,
    matchedCount,
    totalKeywords: keywordMatches.length,
    missingSkills,
    suggestions,
    sections,
  }
}

export function buildImprovedResume(result: AtsAnalysisResult, jobDescription: string): string {
  const topMissing = result.missingSkills.slice(0, 8)
  const matched = result.keywords.filter((k) => k.found).map((k) => k.keyword)

  return [
    'IMPROVED RESUME DRAFT',
    '=====================',
    '',
    '--- Professional Summary (suggested) ---',
    `Results-driven professional aligned with the target role. Experienced with ${matched.slice(0, 5).join(', ') || 'relevant industry skills'}.`,
    '',
    '--- Skills to highlight ---',
    matched.length ? matched.join(', ') : 'Add role-specific skills here',
    '',
    '--- Recommended additions based on job description ---',
    topMissing.length ? topMissing.join(', ') : 'Your resume already covers most listed keywords.',
    '',
    '--- Original resume content ---',
    result.resumeText,
    '',
    '--- Target job description reference ---',
    jobDescription.trim(),
    '',
    '--- ATS suggestions ---',
    ...result.suggestions.map((s, i) => `${i + 1}. [${s.priority.toUpperCase()}] ${s.title}: ${s.detail}`),
  ].join('\n')
}
