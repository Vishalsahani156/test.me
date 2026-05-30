import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env.js'
import { swaggerSpec } from './config/swagger.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import healthRoutes from './routes/health.routes.js'
import jobsRoutes from './routes/jobs.routes.js'
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

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/api/docs.json', (_req, res) => {
    res.json(swaggerSpec)
  })

  app.use('/api/v1', healthRoutes)
  app.use('/api/auth', authLimiter, authRoutes)
  app.use('/api/jobs', jobsRoutes)
  app.use('/api/dashboard', dashboardRoutes)
  app.use('/api/resumes', resumesRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
