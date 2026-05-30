export interface AdminStats {
  users: number
  jobs: number
  posts: number
  messages: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  resumeCount: number
  savedJobsCount: number
  messageCount: number
}

export interface AdminJob {
  id: string
  title: string
  company: string
  location: string
  remote: boolean
  salaryMin: number
  salaryMax: number
  experience: string
  skills: string[]
  description: string
  postedAt: string
}

export interface AdminMessage {
  id: string
  ticketId: string
  name: string
  email: string
  subject: string
  message: string
  topic: string | null
  priority: string | null
  createdAt: string
  user: { id: string; name: string; email: string } | null
}

export interface AdminBlogPost {
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
