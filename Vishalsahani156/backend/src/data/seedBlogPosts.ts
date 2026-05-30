import type { BlogPostDto } from '../types/blog.js'

export const SEED_BLOG_POSTS: BlogPostDto[] = [
  {
    id: 'post-1',
    slug: 'write-resume-ats-friendly',
    title: 'How to Write an ATS-Friendly Resume in 2026',
    excerpt: 'Learn the formatting and keyword strategies that help your resume pass automated screening.',
    category: 'resume-advice',
    tags: ['ats', 'resume', 'keywords'],
    author: 'Priya Sharma',
    publishedAt: '2026-05-20T09:00:00.000Z',
    readMinutes: 6,
    featured: true,
    content: `Applicant tracking systems scan resumes before a recruiter ever sees them. To improve your pass rate, use standard section headings, avoid tables and text boxes, and mirror important phrases from the job description.

Focus on measurable outcomes in your experience bullets. Instead of "Worked on backend APIs," write "Built REST APIs serving 50k daily requests, reducing latency by 30%."

Keep file formats simple—PDF is widely accepted—and name your file professionally. Finally, maintain a master resume and tailor a version for each application.`,
  },
  {
    id: 'post-2',
    slug: 'top-interview-questions-developers',
    title: 'Top 15 Interview Questions for Developers',
    excerpt: 'Prepare for technical and behavioral questions with this structured checklist.',
    category: 'interview-prep',
    tags: ['interview', 'developers', 'preparation'],
    author: 'Arjun Mehta',
    publishedAt: '2026-05-18T11:00:00.000Z',
    readMinutes: 8,
    content: `Technical interviews often blend coding, system design, and culture fit. Review fundamentals in your primary language, practice explaining trade-offs out loud, and prepare STAR stories for behavioral prompts.

Common topics include data structures, API design, debugging production issues, and collaboration under deadlines. Mock interviews with peers can surface gaps early.`,
  },
  {
    id: 'post-3',
    slug: 'negotiate-salary-offer',
    title: 'How to Negotiate Your First Tech Salary Offer',
    excerpt: 'A practical framework for researching ranges and negotiating respectfully.',
    category: 'career-tips',
    tags: ['salary', 'negotiation', 'career'],
    author: 'Neha Kapoor',
    publishedAt: '2026-05-17T08:00:00.000Z',
    readMinutes: 5,
    content: `Research market ranges using role, location, and company stage. Anchor your ask with evidence— competing offers, specialized skills, or prior impact.

Negotiate total compensation, not just base salary: equity, bonus, learning budget, and remote flexibility all matter. Always express enthusiasm for the role while asking for time to review written details.`,
  },
  {
    id: 'post-4',
    slug: 'job-search-strategy-30-days',
    title: 'A 30-Day Job Search Strategy That Works',
    excerpt: 'Weekly milestones to stay organized and increase interview volume.',
    category: 'job-search',
    tags: ['job search', 'strategy', 'planning'],
    author: 'Rahul Verma',
    publishedAt: '2026-05-16T10:00:00.000Z',
    readMinutes: 7,
    content: `Week 1: refine resume, LinkedIn, and target company list. Week 2: apply to 10–15 tailored roles and activate your network. Week 3: interview prep and follow-ups. Week 4: evaluate offers and negotiate.

Track applications in a spreadsheet with status, contacts, and next actions. Consistency beats sporadic bursts.`,
  },
  {
    id: 'post-5',
    slug: 'typescript-skills-employers-want',
    title: 'TypeScript Skills Employers Want in 2026',
    excerpt: 'From generics to strict typing patterns—what to highlight on your resume.',
    category: 'tech-skills',
    tags: ['typescript', 'frontend', 'skills'],
    author: 'Sana Iqbal',
    publishedAt: '2026-05-15T12:00:00.000Z',
    readMinutes: 6,
    content: `Strong TypeScript candidates understand interfaces vs types, utility types, narrowing, and typing async flows. Showcase projects using strict mode, shared API contracts, and component prop safety.

Pair TS with testing—Vitest or Jest—and mention tooling like ESLint and CI type checks.`,
  },
  {
    id: 'post-6',
    slug: 'remote-work-productivity-tips',
    title: 'Remote Work Productivity Tips for New Grads',
    excerpt: 'Build routines, boundaries, and communication habits that remote teams value.',
    category: 'workplace',
    tags: ['remote', 'productivity', 'workplace'],
    author: 'Karan Joshi',
    publishedAt: '2026-05-14T09:30:00.000Z',
    readMinutes: 5,
    content: `Set core hours, over-communicate progress in async tools, and document decisions. Create a dedicated workspace and use calendar blocks for deep work.

Ask clarifying questions early—remote teams reward proactive clarity over silent struggle.`,
  },
  {
    id: 'post-7',
    slug: 'resume-summary-examples',
    title: '5 Resume Summary Examples for Software Roles',
    excerpt: 'Copy-ready summaries you can adapt for backend, frontend, and full-stack positions.',
    category: 'resume-advice',
    tags: ['resume', 'summary', 'examples'],
    author: 'Priya Sharma',
    publishedAt: '2026-05-13T08:00:00.000Z',
    readMinutes: 4,
    content: `A strong summary is 2–3 lines, role-specific, and keyword-rich. Lead with years of experience and domain, then stack and impact.

Example: "Full-stack engineer with 3+ years building React/Node products. Shipped features used by 100k+ users and improved API response times by 40%."`,
  },
  {
    id: 'post-8',
    slug: 'system-design-interview-basics',
    title: 'System Design Interview Basics for Mid-Level Engineers',
    excerpt: 'Start with requirements, estimate scale, and diagram before diving into details.',
    category: 'interview-prep',
    tags: ['system design', 'interview', 'architecture'],
    author: 'Arjun Mehta',
    publishedAt: '2026-05-12T14:00:00.000Z',
    readMinutes: 9,
    content: `Clarify functional and non-functional requirements first. Sketch clients, APIs, databases, caches, and queues. Discuss trade-offs: SQL vs NoSQL, consistency vs availability.

Practice classic problems—URL shortener, chat, feed—and time-box your depth to 45 minutes.`,
  },
  {
    id: 'post-9',
    slug: 'networking-without-awkwardness',
    title: 'Networking Without Awkwardness',
    excerpt: 'Simple scripts for reaching out to alumni and engineers on LinkedIn.',
    category: 'career-tips',
    tags: ['networking', 'linkedin', 'career'],
    author: 'Neha Kapoor',
    publishedAt: '2026-05-11T10:00:00.000Z',
    readMinutes: 5,
    content: `Lead with specificity: mention their post, project, or shared background. Ask one focused question instead of a vague "Can you refer me?"

Follow up with gratitude and updates. Relationships compound over months, not days.`,
  },
  {
    id: 'post-10',
    slug: 'track-job-applications',
    title: 'How to Track Job Applications Like a Pro',
    excerpt: 'Use a lightweight tracker so no follow-up slips through the cracks.',
    category: 'job-search',
    tags: ['applications', 'tracking', 'organization'],
    author: 'Rahul Verma',
    publishedAt: '2026-05-10T09:00:00.000Z',
    readMinutes: 4,
    content: `Columns: company, role, date applied, resume version, contact, status, next step, notes. Review weekly and send polite follow-ups after 7–10 days.

Tag roles by priority and skill fit to focus energy on high-match opportunities.`,
  },
  {
    id: 'post-11',
    slug: 'learn-react-2026-roadmap',
    title: 'React Learning Roadmap for 2026',
    excerpt: 'Core concepts, hooks, routing, data fetching, and testing—in order.',
    category: 'tech-skills',
    tags: ['react', 'roadmap', 'frontend'],
    author: 'Sana Iqbal',
    publishedAt: '2026-05-09T11:00:00.000Z',
    readMinutes: 7,
    content: `Master JSX, components, state, and effects before advanced patterns. Add React Router, forms, and server state with TanStack Query or similar.

Build two portfolio projects: a CRUD dashboard and a content site with search and filters.`,
  },
  {
    id: 'post-12',
    slug: 'feedback-culture-remote-teams',
    title: 'Building a Feedback Culture on Remote Teams',
    excerpt: 'Give and receive feedback that improves code quality and trust.',
    category: 'workplace',
    tags: ['feedback', 'remote', 'teams'],
    author: 'Karan Joshi',
    publishedAt: '2026-05-08T08:00:00.000Z',
    readMinutes: 6,
    content: `Separate observations from judgments. In code reviews, explain why and suggest alternatives. In 1:1s, ask for specific examples.

Psychological safety grows when leaders model receiving feedback publicly.`,
  },
]
