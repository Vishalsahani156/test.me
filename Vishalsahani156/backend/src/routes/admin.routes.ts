import { Router } from 'express'
import { z } from 'zod'
import { authenticate } from '../middleware/authenticate.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { adminService } from '../services/admin.service.js'

const router = Router()

router.use(authenticate, requireAdmin)

const roleSchema = z.object({
  role: z.enum(['USER', 'ADMIN']),
})

const jobSchema = z.object({
  title: z.string().trim().min(1),
  company: z.string().trim().min(1),
  location: z.string().trim().min(1),
  remote: z.boolean(),
  salaryMin: z.number().int().positive(),
  salaryMax: z.number().int().positive(),
  experience: z.string().trim().min(1),
  skills: z.array(z.string()),
  description: z.string().trim().min(1),
})

const postSchema = z.object({
  title: z.string().trim().min(1),
  excerpt: z.string().trim().min(1),
  content: z.string().trim().min(1),
  categorySlug: z.string().trim().min(1),
  tags: z.array(z.string()),
  author: z.string().trim().min(1),
  readMinutes: z.number().int().positive(),
  featured: z.boolean().optional(),
  slug: z.string().trim().optional(),
})

router.get('/stats', async (_req, res, next) => {
  try {
    const stats = await adminService.getStats()
    res.json({ stats })
  } catch (err) {
    next(err)
  }
})

router.get('/users', async (_req, res, next) => {
  try {
    const users = await adminService.listUsers()
    res.json({ users })
  } catch (err) {
    next(err)
  }
})

router.patch('/users/:userId/role', async (req, res, next) => {
  try {
    const { role } = roleSchema.parse(req.body)
    const user = await adminService.updateUserRole(req.user!.id, req.params.userId, role)
    res.json({ user })
  } catch (err) {
    next(err)
  }
})

router.delete('/users/:userId', async (req, res, next) => {
  try {
    await adminService.deleteUser(req.user!.id, req.params.userId)
    res.json({ message: 'User deleted' })
  } catch (err) {
    next(err)
  }
})

router.get('/jobs', async (_req, res, next) => {
  try {
    const jobs = await adminService.listJobs()
    res.json({ jobs })
  } catch (err) {
    next(err)
  }
})

router.post('/jobs', async (req, res, next) => {
  try {
    const body = jobSchema.parse(req.body)
    const job = await adminService.createJob(body)
    res.status(201).json({ job })
  } catch (err) {
    next(err)
  }
})

router.put('/jobs/:jobId', async (req, res, next) => {
  try {
    const body = jobSchema.partial().parse(req.body)
    const job = await adminService.updateJob(req.params.jobId, body)
    res.json({ job })
  } catch (err) {
    next(err)
  }
})

router.delete('/jobs/:jobId', async (req, res, next) => {
  try {
    await adminService.deleteJob(req.params.jobId)
    res.json({ message: 'Job deleted' })
  } catch (err) {
    next(err)
  }
})

router.get('/blogs', async (_req, res, next) => {
  try {
    const posts = await adminService.listPosts()
    res.json({ posts })
  } catch (err) {
    next(err)
  }
})

router.post('/blogs', async (req, res, next) => {
  try {
    const body = postSchema.parse(req.body)
    const post = await adminService.createPost(body)
    res.status(201).json({ post })
  } catch (err) {
    next(err)
  }
})

router.put('/blogs/:postId', async (req, res, next) => {
  try {
    const body = postSchema.partial().parse(req.body)
    const post = await adminService.updatePost(req.params.postId, body)
    res.json({ post })
  } catch (err) {
    next(err)
  }
})

router.delete('/blogs/:postId', async (req, res, next) => {
  try {
    await adminService.deletePost(req.params.postId)
    res.json({ message: 'Post deleted' })
  } catch (err) {
    next(err)
  }
})

router.get('/messages', async (_req, res, next) => {
  try {
    const messages = await adminService.listMessages()
    res.json({ messages })
  } catch (err) {
    next(err)
  }
})

router.delete('/messages/:messageId', async (req, res, next) => {
  try {
    await adminService.deleteMessage(req.params.messageId)
    res.json({ message: 'Contact message deleted' })
  } catch (err) {
    next(err)
  }
})

export default router
