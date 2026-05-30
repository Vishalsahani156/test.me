import type { ActivityType } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

interface LogActivityInput {
  userId: string
  type: ActivityType
  title: string
  description: string
  link?: string
}

export const activityService = {
  async log(input: LogActivityInput) {
    return prisma.userActivity.create({ data: input })
  },

  async listRecent(userId: string, limit = 12) {
    return prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },
}
