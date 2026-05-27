import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Riscos from './pages/riscos/Riscos'
import Treinamentos from './pages/treinamentos/Treinamentos'
import Documentos from './pages/documentos/Documentos'
import Compliance from './pages/compliance/Compliance'
import Psicossocial from './pages/psicossocial/Psicossocial'
import Empresa from './pages/empresa/Empresa'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="riscos" element={<Riscos />} />
          <Route path="treinamentos" element={<Treinamentos />} />
          <Route path="documentos" element={<Documentos />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="psicossocial" element={<Psicossocial />} />
          <Route path="empresa" element={<Empresa />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
