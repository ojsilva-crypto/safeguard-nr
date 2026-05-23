
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../services/api'

interface User {
  id: number
  nome: string
  email: string
  perfil: string
}

interface AuthContextData {
  user: User | null
  signed: boolean
  loading: boolean
  signIn: (email: string, senha: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('@App:token')
    const storedUser = localStorage.getItem('@App:user')

    if (token && storedUser) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  async function signIn(email: string, senha: string) {
    const response = await api.post('/auth/login', { email, senha })
    const { token, usuario } = response.data

    localStorage.setItem('@App:token', token)
    localStorage.setItem('@App:user', JSON.stringify(usuario))

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(usuario)
  }

  function signOut() {
    localStorage.removeItem('@App:token')
    localStorage.removeItem('@App:user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signed: !!user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
