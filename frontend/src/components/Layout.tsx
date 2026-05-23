import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  LogOut,
} from 'lucide-react'

export function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">MyApp</h1>
          <p className="text-sm text-gray-500 mt-1">{user?.nome}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Users size={18} />
            Clientes
          </NavLink>

          <NavLink
            to="/produtos"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Package size={18} />
            Produtos
          </NavLink>

          <NavLink
            to="/pedidos"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <ShoppingCart size={18} />
            Pedidos
          </NavLink>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}

