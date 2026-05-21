import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

import { apiRequest } from '../services/api'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextData {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean

  signIn: (
    email: string,
    password: string
  ) => Promise<void>

  signOut: () => void
}

const AuthContext = createContext(
  {} as AuthContextData
)

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] =
    useState<User | null>(null)

  const [token, setToken] =
    useState<string | null>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    const storedToken =
      localStorage.getItem('token')

    const storedUser =
      localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  async function signIn(
    email: string,
    password: string
  ) {
    const response = await apiRequest(
      '/auth/login',
      {
        method: 'POST',

        body: JSON.stringify({
          email,
          password,
        }),
      }
    )

    const { user, token } = response

    setUser(user)
    setToken(token)

    localStorage.setItem(
      'token',
      token
    )

    localStorage.setItem(
      'user',
      JSON.stringify(user)
    )
  }

  function signOut() {
    setUser(null)
    setToken(null)

    localStorage.removeItem('token')

    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,

        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}