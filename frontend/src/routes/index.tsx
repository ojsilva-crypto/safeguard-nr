import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Riscos from '../pages/Riscos'
import Pgr from '../pages/Pgr'
import Colaboradores from '../pages/Colaboradores'
import Compliance from '../pages/Compliance'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { signed, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-400">Carregando...</div>
  return signed ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
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
        <Route path="riscos" element={<Riscos />} />
        <Route path="pgr" element={<Pgr />} />
        <Route path="colaboradores" element={<Colaboradores />} />
        <Route path="compliance" element={<Compliance />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
