
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Plus, Eye } from 'lucide-react'

interface Pedido {
  id: number
  cliente: { nome: string }
  status: string
  total: number
  createdAt: string
}

interface Cliente {
  id: number
  nome: string
}

interface Produto {
  id: number
  nome: string
  preco: number
}

interface ItemForm {
  produtoId: string
  quantidade: string
}

export function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ clienteId: '', status: 'PENDENTE' })
  const [itens, setItens] = useState<ItemForm[]>([{ produtoId: '', quantidade: '1' }])
  const [error, setError] = useState('')

  async function loadPedidos() {
    try {
      const response = await api.get('/pedidos')
      setPedidos(response.data)
    } catch (err) {
      console.error('Erro ao carregar pedidos', err)
    } finally {
      setLoading(false)
    }
  }

  async function loadSelects() {
    try {
      const [cRes, pRes] = await Promise.all([
        api.get('/clientes'),
        api.get('/produtos'),
      ])
      setClientes(cRes.data)
      setProdutos(pRes.data)
    } catch (err) {
      console.error('Erro ao carregar selects', err)
    }
  }

  useEffect(() => {
    loadPedidos()
    loadSelects()
  }, [])

  function openNovo() {
    setForm({ clienteId: '', status: 'PENDENTE' })
    setItens([{ produtoId: '', quantidade: '1' }])
    setError('')
    setShowModal(true)
  }

  function addItem() {
    setItens([...itens, { produtoId: '', quantidade: '1' }])
  }

  function removeItem(index: number) {
    setItens(itens.filter((_, i) => i !== index))
  }

  function updateItem(index: number, field: keyof ItemForm, value: string) {
    const updated = [...itens]
    updated[index][field] = value
    setItens(updated)
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        clienteId: parseInt(form.clienteId),
        status: form.status,
        itens: itens.map((item) => ({
          produtoId: parseInt(item.produtoId),
          quantidade: parseInt(item.quantidade),
        })),
      }
      await api.post('/pedidos', payload)
      setShowModal(false)
      loadPedidos()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar pedido')
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR')

  const statusColor: Record<string, string> = {
    PENDENTE: 'bg-yellow-100 text-yellow-700',
    APROVADO: 'bg-green-100 text-green-700',
    CANCELADO: 'bg-red-100 text-red-700',
    ENTREGUE: 'bg-blue-100 text-blue-700',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pedidos</h2>
        <button
          onClick={openNovo}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Novo Pedido
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
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-400">#{pedido.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {pedido.cliente.nome}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColor[pedido.status] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {pedido.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatCurrency(pedido.total)}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(pedido.createdAt)}</td>
                </tr>
              ))}
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Novo Pedido */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Novo Pedido</h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select
                  value={form.clienteId}
                  onChange={(e) => setForm({ ...form, clienteId: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="APROVADO">Aprovado</option>
                  <option value="ENTREGUE">Entregue</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Itens</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    + Adicionar item
                  </button>
                </div>
                <div className="space-y-2">
                  {itens.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <select
                        value={item.produtoId}
                        onChange={(e) => updateItem(index, 'produtoId', e.target.value)}
                        required
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Produto</option>
                        {produtos.map((p) => (
                          <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => updateItem(index, 'quantidade', e.target.value)}
                        required
                        className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Qtd"
                      />
                      {itens.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-400 hover:text-red-600 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
