export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

export interface ApiError {
  message: string
}
