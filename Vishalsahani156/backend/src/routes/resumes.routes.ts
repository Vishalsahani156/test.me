import { Router } from 'express'
import { z } from 'zod'
import { authenticate } from '../middleware/authenticate.js'
import { uploadResumeFile } from '../middleware/upload.js'
import { resumeService } from '../services/resume.service.js'
import { AppError } from '../utils/errors.js'

const router = Router()

const createResumeSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  description: z.string().trim().max(500).optional(),
})

router.use(authenticate)

/**
 * @openapi
 * /api/resumes:
 *   get:
 *     tags: [Resumes]
 *     summary: List managed resumes
 */
router.get('/', async (req, res, next) => {
  try {
    const resumes = await resumeService.listResumes(req.user!.id)
    res.json({ resumes })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/resumes:
 *   post:
 *     tags: [Resumes]
 *     summary: Create a new resume collection
 */
router.post('/', async (req, res, next) => {
  try {
    const body = createResumeSchema.parse(req.body)
    const resume = await resumeService.createResume(req.user!.id, body.title, body.description)
    res.status(201).json({ resume })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/resumes/history:
 *   get:
 *     tags: [Resumes]
 *     summary: Resume activity history
 */
router.get('/history', async (req, res, next) => {
  try {
    const resumeId = typeof req.query.resumeId === 'string' ? req.query.resumeId : undefined
    const filter = typeof req.query.filter === 'string' ? req.query.filter : 'all'
    const history = await resumeService.getHistory(req.user!.id, resumeId, filter)
    res.json({ history })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/resumes/{resumeId}:
 *   get:
 *     tags: [Resumes]
 *     summary: Get resume by ID
 */
router.get('/:resumeId', async (req, res, next) => {
  try {
    const resume = await resumeService.getResumeById(req.user!.id, req.params.resumeId)
    if (!resume) {
      next(new AppError('Resume not found', 404))
      return
    }
    res.json({ resume })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/resumes/{resumeId}/stats:
 *   get:
 *     tags: [Resumes]
 *     summary: ATS score stats for a resume
 */
router.get('/:resumeId/stats', async (req, res, next) => {
  try {
    const stats = await resumeService.getScoreStats(req.user!.id, req.params.resumeId)
    res.json({ stats })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/resumes/{resumeId}/history:
 *   get:
 *     tags: [Resumes]
 *     summary: History for a specific resume
 */
router.get('/:resumeId/history', async (req, res, next) => {
  try {
    const filter = typeof req.query.filter === 'string' ? req.query.filter : 'all'
    const history = await resumeService.getHistory(req.user!.id, req.params.resumeId, filter)
    res.json({ history })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/resumes/{resumeId}/versions:
 *   post:
 *     tags: [Resumes]
 *     summary: Upload a new resume version
 */
router.post('/:resumeId/versions', (req, res, next) => {
  uploadResumeFile(req, res, async (err) => {
    if (err) {
      next(new AppError(err.message, 400))
      return
    }

    try {
      if (!req.file) {
        next(new AppError('Resume file is required', 400))
        return
      }

      const label = typeof req.body.label === 'string' ? req.body.label : undefined
      const notes = typeof req.body.notes === 'string' ? req.body.notes : undefined
      const version = await resumeService.uploadVersion(
        req.user!.id,
        req.params.resumeId,
        req.file,
        label,
        notes,
      )
      res.status(201).json({ version })
    } catch (uploadErr) {
      next(uploadErr)
    }
  })
})

/**
 * @openapi
 * /api/resumes/{resumeId}/versions/{versionId}:
 *   get:
 *     tags: [Resumes]
 *     summary: Get a resume version
 */
router.get('/:resumeId/versions/:versionId', async (req, res, next) => {
  try {
    const version = await resumeService.getVersion(
      req.user!.id,
      req.params.resumeId,
      req.params.versionId,
    )
    if (!version) {
      next(new AppError('Version not found', 404))
      return
    }
    res.json({ version })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/resumes/{resumeId}/versions/{versionId}/active:
 *   patch:
 *     tags: [Resumes]
 *     summary: Set active version
 */
router.patch('/:resumeId/versions/:versionId/active', async (req, res, next) => {
  try {
    const resume = await resumeService.setActiveVersion(
      req.user!.id,
      req.params.resumeId,
      req.params.versionId,
    )
    res.json({ resume })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/resumes/{resumeId}/versions/{versionId}/score:
 *   patch:
 *     tags: [Resumes]
 *     summary: Update ATS score for a version
 */
router.patch('/:resumeId/versions/:versionId/score', async (req, res, next) => {
  try {
    const scoreSchema = z.object({
      score: z.number().int().min(0).max(100),
    })
    const { score } = scoreSchema.parse(req.body)
    const version = await resumeService.updateVersionScore(
      req.user!.id,
      req.params.resumeId,
      req.params.versionId,
      score,
    )
    res.json({ version })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/resumes/{resumeId}/versions/{versionId}:
 *   delete:
 *     tags: [Resumes]
 *     summary: Delete a resume version
 */
router.delete('/:resumeId/versions/:versionId', async (req, res, next) => {
  try {
    const resume = await resumeService.deleteVersion(
      req.user!.id,
      req.params.resumeId,
      req.params.versionId,
    )
    res.json({ resume })
  } catch (err) {
    next(err)
  }
})

export default router
