import { useAuthStore } from '../../store/authStore'
import { LogOut, Bell, User } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuthStore()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          Sistema de Gestao de Seguranca do Trabalho
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User className="w-5 h-5" />
          <span>{user?.name || 'Usuario'}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </header>
  )
}
