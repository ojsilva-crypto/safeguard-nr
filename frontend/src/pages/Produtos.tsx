
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface Produto {
  id: number
  nome: string
  preco: number
  estoque: number
}

export function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<Produto | null>(null)
  const [form, setForm] = useState({ nome: '', preco: '', estoque: '' })
  const [error, setError] = useState('')

  async function loadProdutos() {
    try {
      const response = await api.get('/produtos')
      setProdutos(response.data)
    } catch (err) {
      console.error('Erro ao carregar produtos', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProdutos()
  }, [])

  function openNovo() {
    setEditando(null)
    setForm({ nome: '', preco: '', estoque: '' })
    setError('')
    setShowModal(true)
  }

  function openEditar(produto: Produto) {
    setEditando(produto)
    setForm({
      nome: produto.nome,
      preco: String(produto.preco),
      estoque: String(produto.estoque),
    })
    setError('')
    setShowModal(true)
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        nome: form.nome,
        preco: parseFloat(form.preco),
        estoque: parseInt(form.estoque),
      }
      if (editando) {
        await api.put(`/produtos/${editando.id}`, payload)
      } else {
        await api.post('/produtos', payload)
      }
      setShowModal(false)
      loadProdutos()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar produto')
    }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Deseja excluir este produto?')) return
    try {
      await api.delete(`/produtos/${id}`)
      loadProdutos()
    } catch (err) {
      console.error('Erro ao excluir produto', err)
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Produtos</h2>
        <button
          onClick={openNovo}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Novo Produto
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
                <th className="px-6 py-3 text-left">Preço</th>
                <th className="px-6 py-3 text-left">Estoque</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {produtos.map((produto) => (
                <tr key={produto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{produto.nome}</td>
                  <td className="px-6 py-4 text-gray-500">{formatCurrency(produto.preco)}</td>
                  <td className="px-6 py-4 text-gray-500">{produto.estoque}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => openEditar(produto)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleExcluir(produto.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {produtos.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                    Nenhum produto cadastrado.
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
              {editando ? 'Editar Produto' : 'Novo Produto'}
            </h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block
