import type { AboutData } from '../types/about'
import { apiRequest } from './httpClient'

export const aboutApi = {
  async getAbout(): Promise<AboutData> {
    const { about } = await apiRequest<{ about: AboutData }>('/content/about')
    return about
  },
}
