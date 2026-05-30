import type { User } from '@prisma/client'

export type SafeUser = Pick<User, 'id' | 'email' | 'name'>

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponseBody {
  user: SafeUser
  token: string
  refreshToken?: string
}
