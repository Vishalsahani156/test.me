import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginCredentials,
  ResetPasswordPayload,
  SignupCredentials,
} from '../types/auth'
import { formatApiError } from '../utils/apiError'

function resolveApiBase(): string {
  const raw = import.meta.env.VITE_API_URL ?? '/api'
  const base = raw.replace(/\/$/, '')
  if (/^https?:\/\/[^/]+$/.test(base)) {
    return `${base}/api`
  }
  return base || '/api'
}

const API_BASE = resolveApiBase()

export class AuthApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new AuthApiError(formatApiError(data), response.status)
  }

  return data as T
}

function authHeaders(token?: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const authApi = {
  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  signup(credentials: SignupCredentials): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    return request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    return request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  getMe(token: string): Promise<AuthResponse['user']> {
    return request<{ user: AuthResponse['user'] }>('/auth/me', {
      headers: authHeaders(token),
    }).then((data) => data.user)
  },
}
