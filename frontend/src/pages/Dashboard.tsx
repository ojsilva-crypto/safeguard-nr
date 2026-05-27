import { useEffect, useState } from 'react'
import api from '../services/api'
import {
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline'

interface Stats {
  riscos: { total: number; criticos: number; altos: number }
  pgr: { total: number; emAndamento: number }
  colaboradores: { total: number; ativos: number }
  compliance: { total: number; pendentes: number }
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get('/dashboard').then((r) => setStats(r.data))
  }, [])

  const cards = stats
    ? [
        { label: 'Riscos Identificados', value: stats.riscos.total, sub: `${stats.riscos.criticos} críticos`, icon: ExclamationTriangleIcon, color: 'text-red-400' },
        { label: 'Ações PGR', value: stats.pgr.total, sub: `${stats.pgr.emAndamento} em andamento`, icon: ClipboardDocumentListIcon, color: 'text-blue-400' },
        { label: 'Colaboradores', value: stats.colaboradores.total, sub: `${stats.colaboradores.ativos} ativos`, icon: UsersIcon, color: 'text-green-400' },
        { label: 'Compliance', value: stats.compliance.total, sub: `${stats.compliance.pendentes} pendentes`, icon: CheckBadgeIcon, color: 'text-yellow-400' },
      ]
    : []

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8">Visão geral do sistema</p>

      {!stats ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div key={card.label} className="card flex items-center gap-4">
              <card.icon className={`w-10 h-10 ${card.color}`} />
              <div>
                <p className="text-2xl font-bold text-white">{card.value}</p>
                <p className="text-sm text-gray-400">{card.label}</p>
                <p className="text-xs text-gray-500">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
