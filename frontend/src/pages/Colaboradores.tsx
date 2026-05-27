import { useEffect, useState } from 'react'
import api from '../services/api'

interface Colaborador {
  id: string
  nome: string
  cargo: string
  setor: string
  email: string
  status: string
}

const statusBadge: Record<string, string> = {
  ativo: 'badge-green',
  inativo: 'badge-red',
  ferias: 'badge-blue',
  afastado: 'badge-yellow',
}

export default function Colaboradores() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])

  useEffect(() => {
    api.get('/colaboradores').then((r) => setColaboradores(r.data))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Colaboradores</h1>
        <p className="text-gray-400">Gestão de pessoas</p>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-6 py-4 text-gray-400 font-medium">Nome</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">Cargo</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">Setor</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">E-mail</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {colaboradores.map((c) => (
              <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="px-6 py-4 text-gray-100">{c.nome}</td>
                <td className="px-6 py-4 text-gray-400">{c.cargo}</td>
                <td className="px-6 py-4 text-gray-400">{c.setor}</td>
                <td className="px-6 py-4 text-gray-400">{c.email}</td>
                <td className="px-6 py-4">
                  <span className={statusBadge[c.status] ?? 'badge-blue'}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
