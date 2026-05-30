import crypto from 'node:crypto'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/errors.js'
import type { BlogPostDto } from '../types/blog.js'

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toPostDto(post: {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  categorySlug: string
  tags: string[]
  author: string
  publishedAt: Date
  readMinutes: number
  featured: boolean
}): BlogPostDto {
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

async function countAdmins(): Promise<number> {
  return prisma.user.count({ where: { role: 'ADMIN' } })
}

export const adminService = {
  async getStats() {
    const [users, jobs, posts, messages] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.blogPost.count(),
      prisma.contactSubmission.count(),
    ])

    return { users, jobs, posts, messages }
  },

  async listUsers() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { resumes: true, savedJobs: true, contactSubmissions: true } },
      },
    })

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      resumeCount: user._count.resumes,
      savedJobsCount: user._count.savedJobs,
      messageCount: user._count.contactSubmissions,
    }))
  },

  async updateUserRole(actorId: string, userId: string, role: 'USER' | 'ADMIN') {
    if (actorId === userId && role !== 'ADMIN') {
      throw new AppError('You cannot remove your own admin access', 400)
    }

    const target = await prisma.user.findUnique({ where: { id: userId } })
    if (!target) throw new AppError('User not found', 404)

    if (target.role === 'ADMIN' && role === 'USER') {
      const admins = await countAdmins()
      if (admins <= 1) throw new AppError('Cannot demote the last admin account', 400)
    }

    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
  },

  async deleteUser(actorId: string, userId: string) {
    if (actorId === userId) throw new AppError('You cannot delete your own account here', 400)

    const target = await prisma.user.findUnique({ where: { id: userId } })
    if (!target) throw new AppError('User not found', 404)

    if (target.role === 'ADMIN') {
      const admins = await countAdmins()
      if (admins <= 1) throw new AppError('Cannot delete the last admin account', 400)
    }

    await prisma.user.delete({ where: { id: userId } })
  },

  async listJobs() {
    const jobs = await prisma.job.findMany({ orderBy: { postedAt: 'desc' } })
    return jobs.map((job) => ({
      ...job,
      postedAt: job.postedAt.toISOString(),
    }))
  },

  async createJob(input: {
    title: string
    company: string
    location: string
    remote: boolean
    salaryMin: number
    salaryMax: number
    experience: string
    skills: string[]
    description: string
  }) {
    const id = `job-${crypto.randomBytes(4).toString('hex')}`
    const job = await prisma.job.create({
      data: {
        id,
        ...input,
        postedAt: new Date(),
      },
    })
    return { ...job, postedAt: job.postedAt.toISOString() }
  },

  async updateJob(
    jobId: string,
    input: Partial<{
      title: string
      company: string
      location: string
      remote: boolean
      salaryMin: number
      salaryMax: number
      experience: string
      skills: string[]
      description: string
    }>,
  ) {
    const job = await prisma.job.update({ where: { id: jobId }, data: input })
    return { ...job, postedAt: job.postedAt.toISOString() }
  },

  async deleteJob(jobId: string) {
    await prisma.job.delete({ where: { id: jobId } })
  },

  async listPosts() {
    const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: 'desc' } })
    return posts.map(toPostDto)
  },

  async createPost(input: {
    title: string
    excerpt: string
    content: string
    categorySlug: string
    tags: string[]
    author: string
    readMinutes: number
    featured?: boolean
    slug?: string
  }) {
    const slug = input.slug?.trim() || slugify(input.title)
    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) throw new AppError('A post with this slug already exists', 409)

    const post = await prisma.blogPost.create({
      data: {
        id: `post-${crypto.randomBytes(4).toString('hex')}`,
        slug,
        title: input.title.trim(),
        excerpt: input.excerpt.trim(),
        content: input.content.trim(),
        categorySlug: input.categorySlug,
        tags: input.tags,
        author: input.author.trim(),
        readMinutes: input.readMinutes,
        featured: input.featured ?? false,
        publishedAt: new Date(),
      },
    })

    return toPostDto(post)
  },

  async updatePost(
    postId: string,
    input: Partial<{
      title: string
      excerpt: string
      content: string
      categorySlug: string
      tags: string[]
      author: string
      readMinutes: number
      featured: boolean
      slug: string
    }>,
  ) {
    const post = await prisma.blogPost.update({ where: { id: postId }, data: input })
    return toPostDto(post)
  },

  async deletePost(postId: string) {
    await prisma.blogPost.delete({ where: { id: postId } })
  },

  async listMessages() {
    const messages = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    })

    return messages.map((message) => ({
      id: message.id,
      ticketId: message.ticketId,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      topic: message.topic,
      priority: message.priority,
      createdAt: message.createdAt.toISOString(),
      user: message.user,
    }))
  },

  async deleteMessage(messageId: string) {
    await prisma.contactSubmission.delete({ where: { id: messageId } })
  },
}
