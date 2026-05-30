import type { ContactFormPayload } from '../types/about'

const MOCK_DELAY_MS = 800

function delay(ms = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateContactForm(payload: ContactFormPayload): string | null {
  if (!payload.name.trim()) return 'Name is required.'
  if (!payload.email.trim()) return 'Email is required.'
  if (!isValidEmail(payload.email.trim())) return 'Enter a valid email address.'
  if (!payload.subject.trim()) return 'Subject is required.'
  if (payload.message.trim().length < 10) return 'Message must be at least 10 characters.'
  return null
}

export const aboutApi = {
  async submitContactForm(payload: ContactFormPayload): Promise<{ message: string }> {
    const error = validateContactForm(payload)
    if (error) throw new Error(error)

    await delay()
    return {
      message: 'Thanks for reaching out! We received your message and will respond within 1–2 business days.',
    }
  },
}
