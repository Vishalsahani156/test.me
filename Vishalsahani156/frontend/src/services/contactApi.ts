import type { ContactFormPayload, ContactSubmitResult } from '../types/contact'

const MOCK_DELAY_MS = 800

function delay(ms = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function generateTicketId(): string {
  return `MOCK-${Math.floor(1000 + Math.random() * 9000)}`
}

export function validateContactForm(payload: ContactFormPayload, full = false): string | null {
  if (!payload.name.trim()) return 'Name is required.'
  if (!payload.email.trim()) return 'Email is required.'
  if (!isValidEmail(payload.email.trim())) return 'Enter a valid email address.'
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

    await delay()
    const ticketId = generateTicketId()

    return {
      ticketId,
      message: full
        ? `Message received! Your ticket ID is ${ticketId}. We will respond within 1–2 business days.`
        : 'Thanks for reaching out! We received your message and will respond within 1–2 business days.',
    }
  },
}
