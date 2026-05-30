export type ContactTopic =
  | 'general'
  | 'support'
  | 'billing'
  | 'partnership'
  | 'feedback'

export type ContactPriority = 'low' | 'normal' | 'high'

export interface ContactFormPayload {
  name: string
  email: string
  subject: string
  message: string
  topic?: ContactTopic
  priority?: ContactPriority
}

export interface ContactSubmitResult {
  message: string
  ticketId: string
}

export type FaqCategory =
  | 'all'
  | 'getting-started'
  | 'resume-ats'
  | 'job-alerts'
  | 'account'
  | 'general'

export interface FaqItem {
  id: string
  category: Exclude<FaqCategory, 'all'>
  question: string
  answer: string
}

export interface FaqCategoryMeta {
  slug: Exclude<FaqCategory, 'all'>
  label: string
}

export const FAQ_CATEGORIES: FaqCategoryMeta[] = [
  { slug: 'getting-started', label: 'Getting Started' },
  { slug: 'resume-ats', label: 'Resume & ATS' },
  { slug: 'job-alerts', label: 'Job Alerts' },
  { slug: 'account', label: 'Account & Auth' },
  { slug: 'general', label: 'General' },
]

export const CONTACT_TOPICS: { value: ContactTopic; label: string }[] = [
  { value: 'general', label: 'General inquiry' },
  { value: 'support', label: 'Technical support' },
  { value: 'billing', label: 'Billing question' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'feedback', label: 'Product feedback' },
]

export const CONTACT_PRIORITIES: { value: ContactPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
]
