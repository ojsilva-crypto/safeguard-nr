import { useEffect, useState } from 'react'
import api from '../services/api'

interface Compliance {
  id: string
  titulo: string
  tipo: string
  status: string
  responsavel: string
  prazo: string | null
}

const statusBadge: Record<string, string> = {
  pendente: 'badge-yellow',
  em_andamento: 'badge-blue',
  concluido: 'badge-green',
  vencido: 'badge-red',
}

const tipoBadge: Record<string, string> = {
  norma: 'badge-blue',
  auditoria: 'badge-yellow',
  treinamento: 'badge-green',
  incidente: 'badge-red',
}

export default function Compliance() {
  const [items, setItems] = useState<Compliance[]>([])

  useEffect(() => {
    api.get('/compliance').then((r) => setItems(r.data))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Compliance</h1>
        <p className="text-gray-400">Conformidade e auditoria</p>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-6 py-4 text-gray-400 font-medium">Título</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">Tipo</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">Status</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">Responsável</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">Prazo</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="px-6 py-4 text-gray-100">{item.titulo}</td>
                <td className="px-6 py-4">
                  <span className={tipoBadge[item.tipo] ?? 'badge-blue'}>{item.tipo}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={statusBadge[item.status] ?? 'badge-blue'}>{item.status.replace('_', ' ')}</span>
                </td>
                <td className="px-6 py-4 text-gray-400">{item.responsavel}</td>
                <td className="px-6 py-4 text-gray-400">
                  {item.prazo ? new Date(item.prazo).toLocaleDateString('pt-BR') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
