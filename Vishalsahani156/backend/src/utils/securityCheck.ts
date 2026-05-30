import { env } from '../config/env.js'

export function runSecurityChecks(): void {
  const weakAccessSecret = env.jwt.accessSecret.toLowerCase().includes('change-me')
  const weakRefreshSecret = env.jwt.refreshSecret.toLowerCase().includes('change-me')
  const defaultAdminPassword = env.admin.password === 'Admin@12345'

  if (env.nodeEnv === 'production') {
    if (weakAccessSecret || weakRefreshSecret) {
      throw new Error('JWT secrets must be changed before running in production')
    }
    if (defaultAdminPassword) {
      throw new Error('ADMIN_PASSWORD must be changed before running in production')
    }
  }

  if (defaultAdminPassword) {
    console.warn('[security] Default ADMIN_PASSWORD is active. Change it before deployment.')
  }

  if (weakAccessSecret || weakRefreshSecret) {
    console.warn('[security] Default JWT secrets detected. Change them before deployment.')
  }
}
