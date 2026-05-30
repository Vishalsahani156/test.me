import type { BlogListResult, BlogPost } from '../types/blog'
import { BLOG_CATEGORIES } from '../types/blog'
import { apiRequest, ApiError } from './httpClient'

export const blogApi = {
  async getCategories() {
    const { categories } = await apiRequest<{ categories: typeof BLOG_CATEGORIES }>(
      '/blog/categories',
    )
    return categories
  },

  async getFeaturedPost(): Promise<BlogPost | null> {
    const { post } = await apiRequest<{ post: BlogPost | null }>('/blog/featured')
    return post
  },

  async getPosts(options: {
    page?: number
    category?: string
    query?: string
  } = {}): Promise<BlogListResult> {
    const params = new URLSearchParams()
    if (options.page) params.set('page', String(options.page))
    if (options.category) params.set('category', options.category)
    if (options.query) params.set('q', options.query)

    const query = params.toString()
    return apiRequest<BlogListResult>(`/blog/posts${query ? `?${query}` : ''}`)
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const { post } = await apiRequest<{ post: BlogPost }>(`/blog/posts/${slug}`)
      return post
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null
      throw err
    }
  },

  async getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
    const { posts } = await apiRequest<{ posts: BlogPost[] }>(
      `/blog/posts/${slug}/related?limit=${limit}`,
    )
    return posts
  },

  getCategoryName(slug: string): string {
    return BLOG_CATEGORIES.find((category) => category.slug === slug)?.name ?? slug
  },
}
