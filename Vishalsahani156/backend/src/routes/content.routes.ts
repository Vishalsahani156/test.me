import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { optionalAuthenticate } from '../middleware/optionalAuthenticate.js'
import { contentService } from '../services/content.service.js'

const router = Router()

const contactSchema = z.object({
  name: z.string(),
  email: z.string(),
  subject: z.string(),
  message: z.string(),
  topic: z.string().optional(),
  priority: z.string().optional(),
})

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many contact submissions. Please try again later.' },
})

router.get('/about', async (_req, res, next) => {
  try {
    const about = await contentService.getAbout()
    res.json({ about })
  } catch (err) {
    next(err)
  }
})

router.get('/faq', async (req, res, next) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined
    const query = typeof req.query.q === 'string' ? req.query.q : undefined
    const faq = await contentService.getFaq({ category, query })
    res.json({ faq })
  } catch (err) {
    next(err)
  }
})

router.post('/contact', contactLimiter, optionalAuthenticate, async (req, res, next) => {
  try {
    const body = contactSchema.parse(req.body)
    const full = Boolean(body.topic && body.priority)
    const result = await contentService.submitContact(body, full, req.user?.id)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
})

export default router
