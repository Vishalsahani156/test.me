import type { BlogPost } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import type { BlogListResultDto, BlogPostDto } from '../types/blog.js'

const PAGE_SIZE = 6

function toPostDto(post: BlogPost): BlogPostDto {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.categorySlug,
    tags: post.tags,
    author: post.author,
    publishedAt: post.publishedAt.toISOString(),
    readMinutes: post.readMinutes,
    featured: post.featured || undefined,
  }
}

export const blogService = {
  async getCategories() {
    return prisma.blogCategory.findMany({ orderBy: { name: 'asc' } })
  },

  async getFeaturedPost(): Promise<BlogPostDto | null> {
    const featured = await prisma.blogPost.findFirst({
      where: { featured: true },
      orderBy: { publishedAt: 'desc' },
    })

    if (featured) return toPostDto(featured)

    const fallback = await prisma.blogPost.findFirst({ orderBy: { publishedAt: 'desc' } })
    return fallback ? toPostDto(fallback) : null
  },

  async getPosts(options: {
    page?: number
    category?: string
    query?: string
  } = {}): Promise<BlogListResultDto> {
    const page = Math.max(1, options.page ?? 1)

    let posts = await prisma.blogPost.findMany({
      where: options.category ? { categorySlug: options.category } : undefined,
      orderBy: { publishedAt: 'desc' },
    })

    if (options.query?.trim()) {
      const q = options.query.trim().toLowerCase()
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q)),
      )
    }

    const total = posts.length
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const start = (page - 1) * PAGE_SIZE

    return {
      posts: posts.slice(start, start + PAGE_SIZE).map(toPostDto),
      total,
      page,
      totalPages,
    }
  },

  async getPostBySlug(slug: string): Promise<BlogPostDto | null> {
    const post = await prisma.blogPost.findUnique({ where: { slug } })
    return post ? toPostDto(post) : null
  },

  async getRelatedPosts(slug: string, limit = 3): Promise<BlogPostDto[]> {
    const current = await prisma.blogPost.findUnique({ where: { slug } })
    if (!current) return []

    const related = await prisma.blogPost.findMany({
      where: {
        categorySlug: current.categorySlug,
        slug: { not: slug },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    })

    return related.map(toPostDto)
  },

  async getCategoryName(slug: string): Promise<string> {
    const category = await prisma.blogCategory.findUnique({ where: { slug } })
    return category?.name ?? slug
  },
}
