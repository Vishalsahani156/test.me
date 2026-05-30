export interface AboutDataDto {
  hero: {
    title: string
    subtitle: string
    tagline: string
  }
  mission: {
    statement: string
    vision: string
  }
  values: Array<{ title: string; description: string }>
  stats: Array<{ label: string; value: string }>
  features: Array<{ title: string; description: string; route: string }>
  team: Array<{
    name: string
    role: string
    bio: string
    initials: string
    social: { linkedin?: string; github?: string; twitter?: string }
  }>
  contact: {
    email: string
    phone: string
    address: string
    hours: string
  }
}

export interface FaqItemDto {
  id: string
  category: string
  question: string
  answer: string
}

export interface ContactSubmitResultDto {
  message: string
  ticketId: string
}
