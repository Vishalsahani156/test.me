import type { FaqItemDto } from '../types/content.js'

export const FAQ_DATA: FaqItemDto[] = [
  {
    id: 'faq-1',
    category: 'getting-started',
    question: 'What is Career Toolkit?',
    answer:
      'Career Toolkit is an all-in-one platform for resume optimization, job discovery, and career learning. It includes ATS checking, resume version management, job alerts, and a career blog.',
  },
  {
    id: 'faq-2',
    category: 'getting-started',
    question: 'Do I need an account to use the app?',
    answer:
      'You can browse the About and Contact pages without signing in. Features like the ATS Checker, Resume Manager, Dashboard, and Job Alerts require a free account.',
  },
  {
    id: 'faq-3',
    category: 'getting-started',
    question: 'Is Career Toolkit free to use?',
    answer:
      'Core features are free during our frontend demo phase. Premium tiers for advanced analytics may be introduced when the backend launches.',
  },
  {
    id: 'faq-4',
    category: 'resume-ats',
    question: 'What file formats does the ATS Checker support?',
    answer:
      'You can upload resumes in PDF or DOCX format up to 5 MB. The checker extracts text and compares it against your pasted job description.',
  },
  {
    id: 'faq-5',
    category: 'resume-ats',
    question: 'How is the ATS score calculated?',
    answer:
      'Scores combine keyword match rate, resume section detection (contact, experience, skills, etc.), and content length heuristics. It is a guidance score, not a guarantee of hiring outcomes.',
  },
  {
    id: 'faq-6',
    category: 'resume-ats',
    question: 'Can I manage multiple resume versions?',
    answer:
      'Yes. Resume Manager lets you upload versions, set an active resume, track ATS scores over time, and view a history of changes.',
  },
  {
    id: 'faq-7',
    category: 'job-alerts',
    question: 'How do job recommendations work?',
    answer:
      'Set your skills, target role, locations, and preferences in Job Alerts. We match seed job listings based on skill overlap and your stated preferences.',
  },
  {
    id: 'faq-8',
    category: 'job-alerts',
    question: 'Can I save jobs for later?',
    answer:
      'Yes. Use the Save button on recommended jobs or from the Dashboard widget. Saved jobs appear in the Saved tab of Job Alerts.',
  },
  {
    id: 'faq-9',
    category: 'account',
    question: 'How do I reset my password?',
    answer:
      'Click "Forgot password?" on the login page and follow the reset link flow. In demo mode, backend email delivery may not be active yet.',
  },
  {
    id: 'faq-10',
    category: 'account',
    question: 'Is my data stored securely?',
    answer:
      'During the frontend-only phase, preferences and resume metadata are stored in your browser localStorage. Full server-side encryption will come with the backend release.',
  },
  {
    id: 'faq-11',
    category: 'general',
    question: 'How quickly will you respond to contact messages?',
    answer:
      'We aim to reply within 1–2 business days. Messages submitted through the contact form receive a mock ticket ID instantly in demo mode.',
  },
  {
    id: 'faq-12',
    category: 'general',
    question: 'Can I suggest new features?',
    answer:
      'Absolutely. Choose "Product feedback" as your topic on the contact form and describe your idea. We review every submission.',
  },
]
