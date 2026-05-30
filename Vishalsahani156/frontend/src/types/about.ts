export interface AboutValue {
  title: string
  description: string
}

export interface AboutStat {
  label: string
  value: string
}

export interface AboutFeature {
  title: string
  description: string
  route: string
}

export interface TeamMember {
  name: string
  role: string
  bio: string
  initials: string
  social: {
    linkedin?: string
    github?: string
    twitter?: string
  }
}

export interface ContactInfo {
  email: string
  phone: string
  address: string
  hours: string
}

export interface AboutData {
  hero: {
    title: string
    subtitle: string
    tagline: string
  }
  mission: {
    statement: string
    vision: string
  }
  values: AboutValue[]
  stats: AboutStat[]
  features: AboutFeature[]
  team: TeamMember[]
  contact: ContactInfo
}

export interface ContactFormPayload {
  name: string
  email: string
  subject: string
  message: string
}
