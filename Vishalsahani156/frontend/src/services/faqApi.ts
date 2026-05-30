import type { FaqItem } from '../types/contact'
import { apiRequest } from './httpClient'

export const faqApi = {
  async getFaq(options: { category?: string; query?: string } = {}): Promise<FaqItem[]> {
    const params = new URLSearchParams()
    if (options.category && options.category !== 'all') {
      params.set('category', options.category)
    }
    if (options.query?.trim()) params.set('q', options.query.trim())

    const query = params.toString()
    const { faq } = await apiRequest<{ faq: FaqItem[] }>(
      `/content/faq${query ? `?${query}` : ''}`,
    )
    return faq
  },
}
