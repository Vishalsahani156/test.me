import { Router } from 'express'
import { z } from 'zod'
import { authenticate } from '../middleware/authenticate.js'
import { atsService } from '../services/ats.service.js'

const router = Router()

const analyzeSchema = z.object({
  resumeText: z.string().trim().min(1).max(50000),
  fileName: z.string().trim().min(1).max(255),
  jobDescription: z.string().trim().min(30).max(20000),
})

router.use(authenticate)

router.post('/analyze', async (req, res, next) => {
  try {
    const body = analyzeSchema.parse(req.body)
    const result = await atsService.analyze(body)
    res.json({ result })
  } catch (err) {
    next(err)
  }
})

export default router
