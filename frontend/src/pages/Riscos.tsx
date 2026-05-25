
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Plus, Pencil, Trash2, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'

interface Risco {
  id: number
  descricao: string
  nivel: 'CRITICO' | 'MODERADO' | 'BAIXO'
  status: 'IDENTIFICADO' | 'EM_TRATAMENTO' | 'CONTROLADO' | 'RESIDUAL'
  setor: string
  responsavel: string
  prazo: string
}

const nivelLabel: Record<string, string> = {
  CRITICO:  'Crítico',
  MODERADO: 'Moderado',
  BAIXO:    'Baixo',
}

const nivelClass: Record<string, string> = {
  CRITICO:  'badge-critico',
  MODERADO: 'badge-moderado',
  BAIXO:    'badge-baixo',
}

const statusLabel: Record<string, string> = {
  IDENTIFICADO:   'Identificado',
  EM_TRATAMENTO:  'Em Tratamento',
  CONTROLADO:     'Controlado',
  RESIDUAL:       'Residual',
}

const statusClass: Record<string, string> = {
  IDENTIFICADO:  'tag-identificado',
  EM_TRATAMENTO: 'tag-tratamento',
  CONTROLADO:    'tag-controlado',
  RESIDUAL:      'tag-residual',
}

const formVazio = {
  descricao: '',
  nivel: 'MODERADO',
  status: 'IDENTIFICADO',
  setor: '',
  responsavel: '',
  prazo: '',
}

export function Riscos() {
  const [riscos, setRiscos] = useState<Risco[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<Risco | null>(null)
  const [form, setForm] = useState(formVazio)

  async function loadRiscos() {
    try {
      const response = await api.get('/riscos')
      setRiscos(response.data)
    } catch {
      toast.error('Erro ao carregar riscos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadRiscos() }, [])

  function openNovo() {
    setEditando(null)
    setForm(formVazio)
    setShowModal(true)
  }

  function openEditar(risco: Risco) {
    setEditando(risco)
    setForm({
      descricao:   risco.descricao,
      nivel:       risco.nivel,
      status:      risco.status,
      setor:       risco.setor,
      responsavel: risco.responsavel,
      prazo:       risco.prazo?.split('T')[0] ?? '',
    })
    setShowModal(true)
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editando) {
        await api.put(`/riscos/${editando.id}`, form)
        toast.success('Risco atualizado!')
      } else {
        await api.post('/riscos', form)
        toast.success('Risco cadastrado!')
      }
      setShowModal(false)
      loadRiscos()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao salvar risco')
    }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Deseja excluir este risco?')) return
    try {
      await api.delete(`/riscos/${id}`)
      toast.success('Risco excluído!')
      loadRiscos()
    } catch {
      toast.error('Erro ao excluir risco')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Riscos</h2>
          <p className="page-subtitle">Identificação e controle de riscos ocupacionais</p>
        </div>
        <button onClick={openNovo} className="btn-primary">
          <Plus size={16} />
          Novo Risco
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
                <th>Descrição</th>
                <th>Setor</th>
                <th>Nível</th>
                <th>Status</th>
                <th>Responsável</th>
                <th>Prazo</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {riscos.map((risco) => (
                <tr key={risco.id}>
                  <td className="font-medium text-gray-800 max-w-xs truncate">
                    {risco.descricao}
                  </td>
                  <td>{risco.setor}</td>
                  <td>
                    <span className={nivelClass[risco.nivel]}>
                      {nivelLabel[risco.nivel]}
                    </span>
                  </td>
                  <td>
                    <span className={statusClass[risco.status]}>
                      {statusLabel[risco.status]}
                    </span>
                  </td>
                  <td>{risco.responsavel}</td>
                  <td>
                    {risco.prazo
                      ? new Date(risco.prazo).toLocaleDateString('pt-BR')
                      : '—'}
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditar(risco)}
                        className="p-2 rounded-lg hover:bg-brand-50 text-brand-600 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleExcluir(risco.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {riscos.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <ShieldAlert size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400">Nenhum risco cadastrado.</p>
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
              {editando ? 'Editar Risco' : 'Novo Risco'}
            </h3>

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="label">Descrição do Risco</label>
                <textarea
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  required
                  rows={3}
                  className="input resize-none"
                  placeholder="Descreva o risco identificado..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Nível de Risco</label>
                  <select
                    value={form.nivel}
                    onChange={(e) => setForm({ ...form, nivel: e.target.value })}
                    className="input"
                  >
                    <option value="CRITICO">Crítico</option>
                    <option value="MODERADO">Moderado</option>
                    <option value="BAIXO">Baixo</option>
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="input"
                  >
                    <option value="IDENTIFICADO">Identificado</option>
                    <option value="EM_TRATAMENTO">Em Tratamento</option>
                    <option value="CONTROLADO">Controlado</option>
                    <option value="RESIDUAL">Residual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="label">Responsável</label>
                  <input
                    type="text"
                    value={form.responsavel}
                    onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
                    required
                    className="input"
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>

              <div>
                <label className="label">Prazo para Tratamento</label>
                <input
                  type="date"
                  value={form.prazo}
                  onChange={(e) => setForm({ ...form, prazo: e.target.value })}
                  className="input"
                />
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
