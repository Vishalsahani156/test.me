import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env.js'
import { swaggerSpec } from './config/swagger.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import adminRoutes from './routes/admin.routes.js'
import authRoutes from './routes/auth.routes.js'
import blogRoutes from './routes/blog.routes.js'
import contentRoutes from './routes/content.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import healthRoutes from './routes/health.routes.js'
import jobsRoutes from './routes/jobs.routes.js'
import atsRoutes from './routes/ats.routes.js'
import resumesRoutes from './routes/resumes.routes.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '1mb' }))

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
  })
  app.use(limiter)

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { message: 'Too many auth attempts, please try again later.' },
  })

  const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    message: { message: 'Too many admin requests, please try again later.' },
  })

  const atsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Too many ATS analysis requests, please try again later.' },
  })

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/api/docs.json', (_req, res) => {
    res.json(swaggerSpec)
  })

  app.get('/', (_req, res) => {
    res.json({
      name: 'Career Toolkit API',
      docs: '/api/docs',
      health: '/api/health',
    })
  })

  app.get('/api', (_req, res) => {
    res.json({
      health: '/api/health',
      auth: '/api/auth',
      jobs: '/api/jobs',
      dashboard: '/api/dashboard',
      resumes: '/api/resumes',
      ats: '/api/ats',
      blog: '/api/blog',
      content: '/api/content',
      admin: '/api/admin',
      docs: '/api/docs',
    })
  })

  app.use('/api/v1', healthRoutes)
  app.use('/api', healthRoutes)
  app.use('/api/auth', authLimiter, authRoutes)
  app.use('/api/jobs', jobsRoutes)
  app.use('/api/dashboard', dashboardRoutes)
  app.use('/api/resumes', resumesRoutes)
  app.use('/api/ats', atsLimiter, atsRoutes)
  app.use('/api/blog', blogRoutes)
  app.use('/api/content', contentRoutes)
  app.use('/api/admin', adminLimiter, adminRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
