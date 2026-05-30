import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { dashboardService } from '../services/dashboard.service.js'
import { jobsService } from '../services/jobs.service.js'

const router = Router()

router.use(authenticate)

/**
 * @openapi
 * /api/dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Dashboard overview calculated from database
 *     security:
 *       - bearerAuth: []
 */
router.get('/', async (req, res, next) => {
  try {
    const dashboard = await dashboardService.getDashboardData(req.user!.id)
    res.json({ dashboard })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/dashboard/jobs/{jobId}/save:
 *   post:
 *     tags: [Dashboard]
 *     summary: Toggle save job from dashboard widget
 */
router.post('/jobs/:jobId/save', async (req, res, next) => {
  try {
    const saved = await jobsService.toggleSaveJob(req.user!.id, req.params.jobId)
    res.json({ saved })
  } catch (err) {
    next(err)
  }
})

export default router
