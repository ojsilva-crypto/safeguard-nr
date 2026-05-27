import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, AlertTriangle, GraduationCap,
  FileText, ClipboardCheck, Brain, Building2, ShieldCheck
} from 'lucide-react'

const links = [
  { to: '/',              icon: LayoutDashboard, label: 'Dashboard'     },
  { to: '/riscos',        icon: AlertTriangle,   label: 'Riscos'        },
  { to: '/treinamentos',  icon: GraduationCap,   label: 'Treinamentos'  },
  { to: '/documentos',    icon: FileText,        label: 'Documentos'    },
  { to: '/compliance',    icon: ClipboardCheck,  label: 'Compliance'    },
  { to: '/psicossocial',  icon: Brain,           label: 'Psicossocial'  },
  { to: '/empresa',       icon: Building2,       label: 'Empresa'       },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-blue-800">
        <ShieldCheck className="w-7 h-7 text-blue-300" />
        <span className="text-xl font-bold">SafeGuard NR</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
