
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { CheckSquare, XCircle, Clock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ChecklistItem {
  id: number
  requisito: string
  descricao: string
  status: 'CONFORME' | 'NAO_CONFORME' | 'PENDENTE' | 'NAO_APLICAVEL'
  evidencia: string
  responsavel: string
  dataVerificacao: string
}

const statusLabel: Record<string, string> = {
  CONFORME:       'Conforme',
  NAO_CONFORME:   'Não Conforme',
  PENDENTE:       'Pendente',
  NAO_APLICAVEL:  'Não Aplicável',
}

const statusClass: Record<string, string> = {
  CONFORME:      'badge badge-baixo',
  NAO_CONFORME:  'badge badge-critico',
  PENDENTE:      'badge badge-moderado',
  NAO_APLICAVEL: 'badge bg-gray-100 text-gray-500',
}

const StatusIcon: Record<string, React.ReactNode> = {
  CONFORME:      <CheckSquare size={15} className="text-green-500" />,
  NAO_CONFORME:  <XCircle size={15} className="text-red-500" />,
  PENDENTE:      <Clock size={15} className="text-yellow-500" />,
  NAO_APLICAVEL: <AlertCircle size={15} className="text-gray-400" />,
}

export function Compliance() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState<ChecklistItem | null>(null)

  async function loadItems() {
    try {
      const response = await api.get('/compliance')
      setItems(response.data)
    } catch {
      toast.error('Erro ao carregar compliance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadItems() }, [])

  async function handleUpdateStatus(id: number, status: string) {
    try {
      await api.patch(`/compliance/${id}`, { status })
      toast.success('Status atualizado!')
      loadItems()
    } catch {
      toast.error('Erro ao atualizar status')
    }
  }

  // Resumo
  const total        = items.length
  const conformes    = items.filter((i) => i.status === 'CONFORME').length
  const naoConformes = items.filter((i) => i.status === 'NAO_CONFORME').length
  const pendentes    = items.filter((i) => i.status === 'PENDENTE').length
  const percentual   = total > 0 ? Math.round((conformes / total) * 100) : 0

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Compliance NR-1</h2>
          <p className="page-subtitle">Checklist de conformidade com a Norma Regulamentadora 1</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-lg">
          <span className="text-2xl font-bold text-brand-700">{percentual}%</span>
          <span className="text-sm text-brand-600">de conformidade</span>
        </div>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',        value: total,        color: 'text-gray-700',   bg: 'bg-gray-50  border-gray-200'   },
          { label: 'Conformes',    value: conformes,    color: 'text-green-700',  bg: 'bg-green-50 border-green-200'  },
          { label: 'Não Conformes',value: naoConformes, color: 'text-red-700',    bg: 'bg-red-50   border-red-200'    },
          { label: 'Pendentes',    value: pendentes,    color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200'},
        ].map((c) => (
          <div key={c.label} className={`card border ${c.bg} text-center py-4`}>
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Barra de progresso */}
      <div className="card mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">Progresso de Conformidade</span>
          <span className="font-bold text-brand-700">{percentual}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-brand-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentual}%` }}
          />
        </div>
      </div>

      {/* Tabela */}
      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Requisito</th>
                <th>Descrição</th>
                <th>Responsável</th>
                <th>Verificação</th>
                <th>Status</th>
                <th className="text-right">Alterar</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="font-semibold text-gray-800 whitespace-nowrap">
                    {item.requisito}
                  </td>
                  <td className="max-w-xs text-gray-600">{item.descricao}</td>
                  <td>{item.responsavel}</td>
                  <td className="whitespace-nowrap">
                    {item.dataVerificacao
                      ? new Date(item.dataVerificacao).toLocaleDateString('pt-BR')
                      : '—'}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {StatusIcon[item.status]}
                      <span className={statusClass[item.status]}>
                        {statusLabel[item.status]}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-end">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5
                                   focus:outline-none focus:ring-1 focus:ring-brand-500
                                   bg-white text-gray-700"
                      >
                        <option value="CONFORME">Conforme</option>
                        <option value="NAO_CONFORME">Não Conforme</option>
                        <option value="PENDENTE">Pendente</option>
                        <option value="NAO_APLICAVEL">Não Aplicável</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <CheckSquare size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400">Nenhum item de compliance cadastrado.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
