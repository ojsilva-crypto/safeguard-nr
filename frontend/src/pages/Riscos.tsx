import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

interface Risco {
  id: string
  titulo: string
  nivel: string
  categoria: string
  status: string
  responsavel: string
}

const nivelBadge: Record<string, string> = {
  critico: 'badge-red',
  alto: 'badge-red',
  medio: 'badge-yellow',
  baixo: 'badge-green',
}

const statusBadge: Record<string, string> = {
  aberto: 'badge-yellow',
  em_tratamento: 'badge-blue',
  encerrado: 'badge-green',
}

export default function Riscos() {
  const [riscos, setRiscos] = useState<Risco[]>([])

  useEffect(() => {
    api.get('/riscos').then((r) => setRiscos(r.data))
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir este risco?')) return
    await api.delete(`/riscos/${id}`)
    setRiscos((prev) => prev.filter((r) => r.id !== id))
    toast.success('Risco excluído!')
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Riscos</h1>
          <p className="text-gray-400">Gestão de riscos ocupacionais</p>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-6 py-4 text-gray-400 font-medium">Título</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">Nível</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">Categoria</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">Status</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">Responsável</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {riscos.map((r) => (
              <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-gray-100">{r.titulo}</td>
                <td className="px-6 py-4">
                  <span className={nivelBadge[r.nivel] ?? 'badge-blue'}>{r.nivel}</span>
                </td>
                <td className="px-6 py-4 text-gray-400">{r.categoria}</td>
                <td className="px-6 py-4">
                  <span className={statusBadge[r.status] ?? 'badge-blue'}>{r.status.replace('_', ' ')}</span>
                </td>
                <td className="px-6 py-4 text-gray-400">{r.responsavel}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-300 text-xs">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
