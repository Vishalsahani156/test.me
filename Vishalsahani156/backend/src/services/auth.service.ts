import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/errors.js'
import {
  consumePasswordResetToken,
  createPasswordResetToken,
  issueAuthTokens,
  revokeRefreshToken,
  rotateRefreshToken,
  signAccessToken,
} from './token.service.js'
import { toSafeUser, type AuthResponseBody } from '../types/auth.js'

const SALT_ROUNDS = 12

interface RegisterInput {
  name: string
  email: string
  password: string
}

interface LoginInput {
  email: string
  password: string
}

function buildAuthResponse(
  user: { id: string; email: string; name: string; role: string },
  accessToken: string,
  refreshToken: string,
  includeRefresh = false,
): AuthResponseBody {
  return {
    user: toSafeUser(user as never),
    token: accessToken,
    ...(includeRefresh ? { refreshToken } : {}),
  }
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResponseBody> {
    const email = input.email.trim().toLowerCase()
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new AppError('Email already registered', 409)

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
    const user = await prisma.user.create({
      data: {
        name: input.name.trim(),
        email,
        passwordHash,
        role: 'USER',
      },
    })

    const tokens = await issueAuthTokens(user.id, user.email)
    return buildAuthResponse(user, tokens.accessToken, tokens.refreshToken, true)
  },

  async login(input: LoginInput): Promise<AuthResponseBody> {
    const email = input.email.trim().toLowerCase()
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new AppError('Invalid email or password', 401)

    const valid = await bcrypt.compare(input.password, user.passwordHash)
    if (!valid) throw new AppError('Invalid email or password', 401)

    const tokens = await issueAuthTokens(user.id, user.email)
    return buildAuthResponse(user, tokens.accessToken, tokens.refreshToken, true)
  },

  async refresh(refreshToken: string): Promise<AuthResponseBody> {
    try {
      const { userId, refreshToken: nextRefreshToken } = await rotateRefreshToken(refreshToken)
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) throw new AppError('User not found', 404)

      const accessToken = signAccessToken(user.id, user.email)
      return buildAuthResponse(user, accessToken, nextRefreshToken, true)
    } catch {
      throw new AppError('Invalid refresh token', 401)
    }
  },

  async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await revokeRefreshToken(refreshToken)
    }
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new AppError('User not found', 404)
    return toSafeUser(user)
  },

  async forgotPassword(emailInput: string): Promise<{ message: string; resetToken?: string }> {
    const email = emailInput.trim().toLowerCase()
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return {
        message: 'If that email exists, a reset link has been sent.',
      }
    }

    const resetToken = await createPasswordResetToken(user.id)

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[dev] Password reset token for ${email}: ${resetToken}`)
    }

    return {
      message: 'If that email exists, a reset link has been sent.',
      ...(process.env.NODE_ENV !== 'production' ? { resetToken } : {}),
    }
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    try {
      const userId = await consumePasswordResetToken(token)
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      })
      await prisma.refreshToken.deleteMany({ where: { userId } })
      return { message: 'Password reset successfully' }
    } catch {
      throw new AppError('Invalid or expired reset token', 400)
    }
  },
}
