import type { ContactFormPayload, ContactSubmitResult } from '../types/contact'
import { apiRequest } from './httpClient'

export const contactApi = {
  submitContactForm(payload: ContactFormPayload): Promise<ContactSubmitResult> {
    return apiRequest<ContactSubmitResult>('/content/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
