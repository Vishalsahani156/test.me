import { formatApiError } from '../utils/apiError'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
const TOKEN_KEY = 'auth_token'

export class ApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = readToken()
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(formatApiError(data), response.status)
  }

  return data as T
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
  method = 'POST',
): Promise<T> {
  return apiRequest<T>(path, { method, body: formData })
}
