import { useEffect, useState } from 'react'
import api from '../services/api'

interface Pgr {
  id: string
  titulo: string
  descricao: string
  status: string
  responsavel: string
  dataPrevista: string | null
}

const statusBadge: Record<string, string> = {
  pendente: 'badge-yellow',
  em_andamento: 'badge-blue',
  concluido: 'badge-green',
}

export default function Pgr() {
  const [items, setItems] = useState<Pgr[]>([])

  useEffect(() => {
    api.get('/pgr').then((r) => setItems(r.data))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">PGR</h1>
        <p className="text-gray-400">Programa de Gerenciamento de Riscos</p>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="card flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">{item.titulo}</p>
              <p className="text-sm text-gray-400 mt-1">{item.descricao}</p>
              <p className="text-xs text-gray-500 mt-2">Responsável: {item.responsavel}</p>
            </div>
            <div className="text-right ml-4 shrink-0">
              <span className={statusBadge[item.status] ?? 'badge-blue'}>
                {item.status.replace('_', ' ')}
              </span>
              {item.dataPrevista && (
                <p className="text-xs text-gray-500 mt-2">
                  Prazo: {new Date(item.dataPrevista).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
