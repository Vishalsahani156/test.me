import type { ContactFormPayload, ContactSubmitResult } from '../types/contact'
import { apiRequest } from './httpClient'

export function validateContactForm(payload: ContactFormPayload, full = false): string | null {
  if (!payload.name.trim()) return 'Name is required.'
  if (!payload.email.trim()) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    return 'Enter a valid email address.'
  }
  if (full && !payload.topic) return 'Please select a topic.'
  if (!payload.subject.trim()) return 'Subject is required.'
  if (payload.message.trim().length < 10) return 'Message must be at least 10 characters.'
  if (full && !payload.priority) return 'Please select a priority.'
  return null
}

export const contactApi = {
  async submitContactForm(
    payload: ContactFormPayload,
    full = false,
  ): Promise<ContactSubmitResult> {
    const error = validateContactForm(payload, full)
    if (error) throw new Error(error)

    return apiRequest<ContactSubmitResult>('/content/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
