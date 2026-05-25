import { useEffect, useState } from 'react'
import { api } from '../services/api'
import {
  ShieldAlert,
  FileText,
  Users,
  CheckSquare,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

interface DashboardData {
  totalRiscos: number
  riscosCriticos: number
  totalColaboradores: number
  conformidadeNR1: number
  pgrAtivo: boolean
  riscosPerNivel: { nivel: string; total: number }[]
  riscosPerStatus: { status: string; total: number }[]
}

const COLORS_NIVEL = ['#ef4444', '#eab308', '#22c55e', '#3b82f6']
const COLORS_STATUS = ['#ef4444', '#f97316', '#22c55e', '#3b82f6']

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get('/dashboard')
        setData(response.data)
      } catch (err) {
        console.error('Erro ao carregar dashboard', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
      </div>
    )
  }

  const cards = [
    {
      title: 'Total de Riscos',
      value: data?.totalRiscos ?? 0,
      icon: ShieldAlert,
      color: 'bg-blue-50 text-blue-600',
      border: 'border-blue-200',
    },
    {
      title: 'Riscos Críticos',
      value: data?.riscosCriticos ?? 0,
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600',
      border: 'border-red-200',
    },
    {
      title: 'Colaboradores',
      value: data?.totalColaboradores ?? 0,
      icon: Users,
      color: 'bg-brand-50 text-brand-600',
      border: 'border-brand-200',
    },
    {
      title: 'Conformidade NR-1',
      value: `${data?.conformidadeNR1 ?? 0}%`,
      icon: CheckSquare,
      color: 'bg-purple-50 text-purple-600',
      border: 'border-purple-200',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">Visão geral da gestão de SST</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium
          bg-brand-50 text-brand-700 border-brand-200">
          <TrendingUp size={15} />
          PGR {data?.pgrAtivo ? 'Ativo' : 'Inativo'}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card) => (
          <div key={card.title} className={`card border ${card.border} flex items-center gap-4`}>
            <div className={`p-3 rounded-xl ${card.color}`}>
              <card.icon size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Riscos por Nível */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Riscos por Nível
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data?.riscosPerNivel ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="nivel"
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  background: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f9fafb',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {(data?.riscosPerNivel ?? []).map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS_NIVEL[index % COLORS_NIVEL.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Riscos por Status */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Riscos por Status
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data?.riscosPerStatus ?? []}
                dataKey="total"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ status, percent }) =>
                  `${status} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {(data?.riscosPerStatus ?? []).map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS_STATUS[index % COLORS_STATUS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f9fafb',
                  fontSize: '13px',
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
