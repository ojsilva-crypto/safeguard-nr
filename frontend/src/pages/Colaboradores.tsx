
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import toast from 'react-hot-toast'

interface Colaborador {
  id: number
  nome: string
  cargo: string
  setor: string
  email: string
  dataAdmissao: string
  ativo: boolean
}

const formVazio = {
  nome: '',
  cargo: '',
  setor: '',
  email: '',
  dataAdmissao: '',
  ativo: true,
}

export function Colaboradores() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<Colaborador | null>(null)
  const [form, setForm] = useState<typeof formVazio>(formVazio)

  async function loadColaboradores() {
    try {
      const response = await api.get('/colaboradores')
      setColaboradores(response.data)
    } catch {
      toast.error('Erro ao carregar colaboradores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadColaboradores() }, [])

  function openNovo() {
    setEditando(null)
    setForm(formVazio)
    setShowModal(true)
  }

  function openEditar(col: Colaborador) {
    setEditando(col)
    setForm({
      nome:         col.nome,
      cargo:        col.cargo,
      setor:        col.setor,
      email:        col.email,
      dataAdmissao: col.dataAdmissao?.split('T')[0] ?? '',
      ativo:        col.ativo,
    })
    setShowModal(true)
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editando) {
        await api.put(`/colaboradores/${editando.id}`, form)
        toast.success('Colaborador atualizado!')
      } else {
        await api.post('/colaboradores', form)
        toast.success('Colaborador cadastrado!')
      }
      setShowModal(false)
      loadColaboradores()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao salvar colaborador')
    }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Deseja excluir este colaborador?')) return
    try {
      await api.delete(`/colaboradores/${id}`)
      toast.success('Colaborador excluído!')
      loadColaboradores()
    } catch {
      toast.error('Erro ao excluir colaborador')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Colaboradores</h2>
          <p className="page-subtitle">Gestão de trabalhadores expostos a riscos</p>
        </div>
        <button onClick={openNovo} className="btn-primary">
          <Plus size={16} />
          Novo Colaborador
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Setor</th>
                <th>E-mail</th>
                <th>Admissão</th>
                <th>Status</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {colaboradores.map((col) => (
                <tr key={col.id}>
                  <td className="font-medium text-gray-800">{col.nome}</td>
                  <td>{col.cargo}</td>
                  <td>{col.setor}</td>
                  <td className="text-gray-500">{col.email}</td>
                  <td>
                    {col.dataAdmissao
                      ? new Date(col.dataAdmissao).toLocaleDateString('pt-BR')
                      : '—'}
                  </td>
                  <td>
                    <span className={col.ativo ? 'badge badge-baixo' : 'badge bg-gray-100 text-gray-500'}>
                      {col.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditar(col)}
                        className="p-2 rounded-lg hover:bg-brand-50 text-brand-600 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleExcluir(col.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {colaboradores.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Users size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400">Nenhum colaborador cadastrado.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-6">
              {editando ? 'Editar Colaborador' : 'Novo Colaborador'}
            </h3>

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="label">Nome Completo</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                  className="input"
                  placeholder="Nome do colaborador"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Cargo</label>
                  <input
                    type="text"
                    value={form.cargo}
                    onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                    required
                    className="input"
                    placeholder="Ex: Operador"
                  />
                </div>
                <div>
                  <label className="label">Setor</label>
                  <input
                    type="text"
                    value={form.setor}
                    onChange={(e) => setForm({ ...form, setor: e.target.value })}
                    required
                    className="input"
                    placeholder="Ex: Produção"
                  />
                </div>
              </div>

              <div>
                <label className="label">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input"
                  placeholder="email@empresa.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Data de Admissão</label>
                  <input
                    type="date"
                    value={form.dataAdmissao}
                    onChange={(e) => setForm({ ...form, dataAdmissao: e.target.value })}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    value={String(form.ativo)}
                    onChange={(e) => setForm({ ...form, ativo: e.target.value === 'true' })}
                    className="input"
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
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
