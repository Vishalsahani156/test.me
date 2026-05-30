import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authApi } from '../services/authApi'
import type {
  ForgotPasswordPayload,
  LoginCredentials,
  ResetPasswordPayload,
  SignupCredentials,
  User,
} from '../types/auth'

const TOKEN_KEY = 'auth_token'

interface AuthContextValue {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignupCredentials) => Promise<void>
  logout: () => void
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<string>
  resetPassword: (payload: ResetPasswordPayload) => Promise<string>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => readStoredToken())
  const [isLoading, setIsLoading] = useState(true)

  const persistSession = useCallback((nextToken: string, nextUser: User) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    const storedToken = readStoredToken()
    if (!storedToken) {
      setIsLoading(false)
      return
    }

    authApi
      .getMe(storedToken)
      .then((profile) => {
        setToken(storedToken)
        setUser(profile)
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const { token: nextToken, user: nextUser } = await authApi.login(credentials)
      persistSession(nextToken, nextUser)
    },
    [persistSession],
  )

  const signup = useCallback(
    async (credentials: SignupCredentials) => {
      const { token: nextToken, user: nextUser } = await authApi.signup(credentials)
      persistSession(nextToken, nextUser)
    },
    [persistSession],
  )

  const forgotPassword = useCallback(async (payload: ForgotPasswordPayload) => {
    const { message } = await authApi.forgotPassword(payload)
    return message
  }, [])

  const resetPassword = useCallback(async (payload: ResetPasswordPayload) => {
    const { message } = await authApi.resetPassword(payload)
    return message
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      signup,
      logout,
      forgotPassword,
      resetPassword,
    }),
    [user, token, isLoading, login, signup, logout, forgotPassword, resetPassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
