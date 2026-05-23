
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Login } from '../pages/Login'
import { Layout } from '../components/Layout'
import { Dashboard } from '../pages/Dashboard'
import { Clientes } from '../pages/Clientes'
import { Produtos } from '../pages/Produtos'
import { Pedidos } from '../pages/Pedidos'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { signed, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return signed ? <>{children}</> : <Navigate to="/login" />
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="pedidos" element={<Pedidos />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
