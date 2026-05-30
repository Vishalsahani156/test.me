import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../services/token.service.js'
import { AppError } from '../utils/errors.js'

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    next(new AppError('Unauthorized', 401))
    return
  }

  const token = header.slice('Bearer '.length)
  try {
    const payload = verifyAccessToken(token)
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch {
    next(new AppError('Invalid or expired token', 401))
  }
}
