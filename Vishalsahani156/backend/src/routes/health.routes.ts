import type { Request, Response } from 'express'
import { Router } from 'express'

const router = Router()

export function healthCheck(_req: Request, res: Response): void {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
}

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', healthCheck)

export default router
