import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../services/token.service.js'

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    next()
    return
  }

  try {
    const payload = verifyAccessToken(header.slice('Bearer '.length))
    req.user = { id: payload.sub, email: payload.email }
  } catch {
    // Public routes ignore invalid tokens
  }

  next()
}
