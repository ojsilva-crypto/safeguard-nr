
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string
}

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' })
  const [error, setError] = useState('')

  async function loadClientes() {
    try {
      const response = await api.get('/clientes')
      setClientes(response.data)
    } catch (err) {
      console.error('Erro ao carregar clientes', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClientes()
  }, [])

  function openNovo() {
    setEditando(null)
    setForm({ nome: '', email: '', telefone: '' })
    setError('')
    setShowModal(true)
  }

  function openEditar(cliente: Cliente) {
    setEditando(cliente)
    setForm({ nome: cliente.nome, email: cliente.email, telefone: cliente.telefone })
    setError('')
    setShowModal(true)
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      if (editando) {
        await api.put(`/clientes/${editando.id}`, form)
      } else {
        await api.post('/clientes', form)
      }
      setShowModal(false)
      loadClientes()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar cliente')
    }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Deseja excluir este cliente?')) return
    try {
      await api.delete(`/clientes/${id}`)
      loadClientes()
    } catch (err) {
      console.error('Erro ao excluir cliente', err)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
        <button
          onClick={openNovo}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Novo Cliente
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Nome</th>
                <th className="px-6 py-3 text-left">E-mail</th>
                <th className="px-6 py-3 text-left">Telefone</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{cliente.nome}</td>
                  <td className="px-6 py-4 text-gray-500">{cliente.email}</td>
                  <td className="px-6 py-4 text-gray-500">{cliente.telefone}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => openEditar(cliente)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleExcluir(cliente.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {clientes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                    Nenhum cliente cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editando ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="text"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
