export interface BlogCategory {
  slug: string
  name: string
  description: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
  readMinutes: number
  featured?: boolean
}

export interface BlogListResult {
  posts: BlogPost[]
  total: number
  page: number
  totalPages: number
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: 'career-tips', name: 'Career Tips', description: 'Grow your career with actionable advice.' },
  { slug: 'resume-advice', name: 'Resume Advice', description: 'Build resumes that get interviews.' },
  { slug: 'interview-prep', name: 'Interview Prep', description: 'Prepare for technical and behavioral rounds.' },
  { slug: 'job-search', name: 'Job Search', description: 'Find and land the right opportunities.' },
  { slug: 'tech-skills', name: 'Tech Skills', description: 'Stay current with in-demand technologies.' },
  { slug: 'workplace', name: 'Workplace', description: 'Thrive in modern team environments.' },
]
