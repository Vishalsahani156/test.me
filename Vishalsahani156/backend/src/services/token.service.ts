import crypto from 'node:crypto'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../config/env.js'
import { prisma } from '../lib/prisma.js'
import type { AuthTokens } from '../types/auth.js'

interface AccessPayload {
  sub: string
  email: string
}

export function signAccessToken(userId: string, email: string): string {
  const payload: AccessPayload = { sub: userId, email }
  const options: SignOptions = {
    expiresIn: env.jwt.accessExpiresIn as SignOptions['expiresIn'],
  }
  return jwt.sign(payload, env.jwt.accessSecret, options)
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.jwt.accessSecret) as AccessPayload
}

function refreshExpiryDate(): Date {
  const match = env.jwt.refreshExpiresIn.match(/^(\d+)([smhd])$/)
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const amount = Number(match[1])
  const unit = match[2]
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }

  return new Date(Date.now() + amount * multipliers[unit])
}

export async function createRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(48).toString('hex')
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: refreshExpiryDate(),
    },
  })
  return token
}

export async function rotateRefreshToken(oldToken: string): Promise<{ userId: string; refreshToken: string }> {
  const existing = await prisma.refreshToken.findUnique({ where: { token: oldToken } })
  if (!existing || existing.expiresAt < new Date()) {
    if (existing) {
      await prisma.refreshToken.delete({ where: { id: existing.id } })
    }
    throw new Error('Invalid refresh token')
  }

  await prisma.refreshToken.delete({ where: { id: existing.id } })
  const refreshToken = await createRefreshToken(existing.userId)
  return { userId: existing.userId, refreshToken }
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { token } })
}

export async function issueAuthTokens(userId: string, email: string): Promise<AuthTokens> {
  const accessToken = signAccessToken(userId, email)
  const refreshToken = await createRefreshToken(userId)
  return { accessToken, refreshToken }
}

export async function createPasswordResetToken(userId: string): Promise<string> {
  await prisma.passwordResetToken.deleteMany({ where: { userId } })
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.passwordResetToken.create({
    data: { token, userId, expiresAt },
  })

  return token
}

export async function consumePasswordResetToken(token: string): Promise<string> {
  const record = await prisma.passwordResetToken.findUnique({ where: { token } })
  if (!record || record.expiresAt < new Date()) {
    throw new Error('Invalid or expired reset token')
  }

  await prisma.passwordResetToken.delete({ where: { id: record.id } })
  return record.userId
}
