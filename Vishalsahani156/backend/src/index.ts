import { createApp } from './app.js'
import { env } from './config/env.js'
import { prisma } from './lib/prisma.js'
import { runSecurityChecks } from './utils/securityCheck.js'

const app = createApp()

async function start() {
  runSecurityChecks()
  await prisma.$connect()

  app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`)
    console.log(`Swagger docs: http://localhost:${env.port}/api/docs`)
    console.log(`Health check: http://localhost:${env.port}/api/v1/health`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
