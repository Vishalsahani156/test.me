import { SEED_BLOG_POSTS } from '../data/seedBlogPosts'
import type { BlogListResult, BlogPost } from '../types/blog'
import { BLOG_CATEGORIES } from '../types/blog'

const MOCK_DELAY_MS = 300
const PAGE_SIZE = 6

function delay(ms = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function filterPosts(posts: BlogPost[], category?: string, query?: string): BlogPost[] {
  let filtered = [...posts]

  if (category) {
    filtered = filtered.filter((p) => p.category === category)
  }

  if (query?.trim()) {
    const q = query.trim().toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }

  return filtered.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export const blogApi = {
  async getCategories() {
    await delay(100)
    return BLOG_CATEGORIES
  },

  async getFeaturedPost(): Promise<BlogPost | null> {
    await delay()
    return SEED_BLOG_POSTS.find((p) => p.featured) ?? SEED_BLOG_POSTS[0] ?? null
  },

  async getPosts(options: {
    page?: number
    category?: string
    query?: string
  } = {}): Promise<BlogListResult> {
    await delay()
    const page = options.page ?? 1
    const filtered = filterPosts(SEED_BLOG_POSTS, options.category, options.query)
    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const start = (page - 1) * PAGE_SIZE

    return {
      posts: filtered.slice(start, start + PAGE_SIZE),
      total,
      page,
      totalPages,
    }
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    await delay()
    return SEED_BLOG_POSTS.find((p) => p.slug === slug) ?? null
  },

  async getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
    await delay()
    const current = SEED_BLOG_POSTS.find((p) => p.slug === slug)
    if (!current) return []

    return SEED_BLOG_POSTS.filter((p) => p.category === current.category && p.slug !== slug)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit)
  },

  getCategoryName(slug: string): string {
    return BLOG_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug
  },
}
