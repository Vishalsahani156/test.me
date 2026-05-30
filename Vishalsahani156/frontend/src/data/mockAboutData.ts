import type { AboutData } from '../types/about'

export const mockAboutData: AboutData = {
  hero: {
    title: 'Empowering careers with smarter tools',
    subtitle: 'Career Toolkit helps job seekers optimize resumes, discover roles, and grow with confidence.',
    tagline: 'Built for students, professionals, and career changers across India.',
  },
  mission: {
    statement:
      'Our mission is to democratize career success by giving everyone access to ATS-friendly resume tools, personalized job insights, and practical career content—without expensive coaching or opaque hiring black boxes.',
    vision:
      'We envision a world where every candidate can present their best self, track their progress, and land roles that match their skills—not just their connections.',
  },
  values: [
    {
      title: 'Accessibility',
      description: 'Career tools should be simple, affordable, and usable by anyone starting their job search.',
    },
    {
      title: 'Transparency',
      description: 'We explain how ATS scoring and job matching work so you can improve with clarity, not guesswork.',
    },
    {
      title: 'Continuous growth',
      description: 'Resumes evolve, skills change, and markets shift—we build for iteration, not one-time fixes.',
    },
    {
      title: 'User-first design',
      description: 'Every feature is shaped around real job-seeker workflows, from upload to interview prep.',
    },
  ],
  stats: [
    { label: 'Active users', value: '12K+' },
    { label: 'Resumes analyzed', value: '48K+' },
    { label: 'Avg ATS improvement', value: '+18 pts' },
    { label: 'Career articles', value: '120+' },
  ],
  features: [
    {
      title: 'Authentication',
      description: 'Secure sign-in, signup, and password recovery to protect your career data.',
      route: '/login',
    },
    {
      title: 'ATS Resume Checker',
      description: 'Upload PDF/DOCX resumes, get ATS scores, keyword analysis, and improvement suggestions.',
      route: '/resume-checker',
    },
    {
      title: 'Resume Manager',
      description: 'Track multiple resume versions, scores over time, and upload history in one place.',
      route: '/resume-manager',
    },
    {
      title: 'Job Alerts',
      description: 'Set preferences and receive skill-based job recommendations tailored to your profile.',
      route: '/job-alerts',
    },
    {
      title: 'Blog System',
      description: 'Read career tips, resume advice, and interview prep articles from industry experts.',
      route: '/blog',
    },
    {
      title: 'Dashboard',
      description: 'Your home hub aggregating scores, resumes, jobs, and recent activity at a glance.',
      route: '/dashboard',
    },
  ],
  team: [
    {
      name: 'Priya Sharma',
      role: 'Co-founder & CEO',
      bio: 'Former talent lead at a Series B SaaS startup. Passionate about equitable hiring and resume accessibility.',
      initials: 'PS',
      social: { linkedin: '#', twitter: '#' },
    },
    {
      name: 'Arjun Mehta',
      role: 'Head of Product',
      bio: 'Product manager with 8 years building HR-tech tools. Focused on ATS transparency and user outcomes.',
      initials: 'AM',
      social: { linkedin: '#', github: '#' },
    },
    {
      name: 'Sana Iqbal',
      role: 'Lead Engineer',
      bio: 'Full-stack developer specializing in React and Node. Builds fast, reliable career tools for scale.',
      initials: 'SI',
      social: { github: '#', linkedin: '#' },
    },
    {
      name: 'Rahul Verma',
      role: 'Career Content Lead',
      bio: 'Career coach and writer helping thousands of candidates land roles in tech and product.',
      initials: 'RV',
      social: { linkedin: '#', twitter: '#' },
    },
    {
      name: 'Neha Kapoor',
      role: 'Design Lead',
      bio: 'UX designer crafting intuitive flows for resume upload, scoring, and job discovery experiences.',
      initials: 'NK',
      social: { linkedin: '#', twitter: '#' },
    },
  ],
  contact: {
    email: 'hello@careertoolkit.in',
    phone: '+91 98765 43210',
    address: 'Indiranagar, Bangalore, Karnataka 560038, India',
    hours: 'Mon–Fri, 9:00 AM – 6:00 PM IST',
  },
}
