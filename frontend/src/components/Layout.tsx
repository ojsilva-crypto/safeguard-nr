import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard,
  ShieldAlert,
  FileText,
  Users,
  CheckSquare,
  LogOut,
  ShieldCheck,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/riscos',        icon: ShieldAlert,     label: 'Riscos' },
  { to: '/pgr',           icon: FileText,        label: 'PGR' },
  { to: '/colaboradores', icon: Users,           label: 'Colaboradores' },
  { to: '/compliance',    icon: CheckSquare,     label: 'Compliance NR-1' },
]

export function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">

        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand-600 rounded-lg">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">SafeGuard NR</h1>
              <p className="text-xs text-gray-400">Gestão SST</p>
            </div>
          </div>
        </div>

        {/* Usuário */}
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
            Usuário
          </p>
          <p className="text-sm font-medium text-gray-700 mt-0.5 truncate">
            {user?.nome ?? 'Usuário'}
          </p>
          <p className="text-xs text-gray-400 truncate">{user?.email ?? ''}</p>
        </div>

        {/* Navegação */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide px-3 py-2">
            Menu
          </p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 border border-brand-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Sair */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={17} />
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
