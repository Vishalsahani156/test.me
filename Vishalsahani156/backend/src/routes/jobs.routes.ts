import { Router } from 'express'
import { z } from 'zod'
import { authenticate } from '../middleware/authenticate.js'
import { jobsService } from '../services/jobs.service.js'

const router = Router()

const preferencesSchema = z.object({
  role: z.string(),
  locations: z.array(z.string()),
  skills: z.array(z.string()),
  experience: z.string(),
  remote: z.boolean(),
  salaryMin: z.number().nullable(),
  salaryMax: z.number().nullable(),
})

router.use(authenticate)

/**
 * @openapi
 * /api/jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: List all job listings
 *     security:
 *       - bearerAuth: []
 */
router.get('/', async (req, res, next) => {
  try {
    const jobs = await jobsService.getAllJobs()
    res.json({ jobs })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/jobs/preferences:
 *   get:
 *     tags: [Jobs]
 *     summary: Get job preferences for current user
 */
router.get('/preferences', async (req, res, next) => {
  try {
    const preferences = await jobsService.getPreferences(req.user!.id)
    res.json({ preferences })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/jobs/preferences:
 *   put:
 *     tags: [Jobs]
 *     summary: Save job preferences
 */
router.put('/preferences', async (req, res, next) => {
  try {
    const body = preferencesSchema.parse(req.body)
    const preferences = await jobsService.savePreferences(req.user!.id, body)
    res.json({ preferences })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/jobs/recommendations:
 *   get:
 *     tags: [Jobs]
 *     summary: Get personalized job recommendations
 */
router.get('/recommendations', async (req, res, next) => {
  try {
    const recommendations = await jobsService.getRecommendations(req.user!.id)
    res.json({ recommendations })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/jobs/saved:
 *   get:
 *     tags: [Jobs]
 *     summary: Get saved jobs for current user
 */
router.get('/saved', async (req, res, next) => {
  try {
    const jobs = await jobsService.getSavedJobs(req.user!.id)
    res.json({ jobs })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/jobs/saved/ids:
 *   get:
 *     tags: [Jobs]
 *     summary: Get saved job IDs
 */
router.get('/saved/ids', async (req, res, next) => {
  try {
    const ids = await jobsService.getSavedJobIds(req.user!.id)
    res.json({ ids })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/jobs/{jobId}/saved:
 *   get:
 *     tags: [Jobs]
 *     summary: Check if a job is saved
 */
router.get('/:jobId/saved', async (req, res, next) => {
  try {
    const saved = await jobsService.isJobSaved(req.user!.id, req.params.jobId)
    res.json({ saved })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/jobs/{jobId}/save:
 *   post:
 *     tags: [Jobs]
 *     summary: Toggle save status for a job
 */
router.post('/:jobId/save', async (req, res, next) => {
  try {
    const saved = await jobsService.toggleSaveJob(req.user!.id, req.params.jobId)
    res.json({ saved })
  } catch (err) {
    next(err)
  }
})

export default router
