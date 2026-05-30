import type { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/errors.js'

export async function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.user?.id) {
    next(new AppError('Unauthorized', 401))
    return
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    })

    if (!user || user.role !== 'ADMIN') {
      next(new AppError('Admin access required', 403))
      return
    }

    next()
  } catch (err) {
    next(err)
  }
}
