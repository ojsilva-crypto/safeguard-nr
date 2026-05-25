import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Plus, FileText, Download, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Pgr {
  id: number
  versao: string
  dataElaboracao: string
  dataRevisao: string
  elaborador: string
  status: 'RASCUNHO' | 'ATIVO' | 'REVISAO' | 'ARQUIVADO'
  descricao: string
}

const statusLabel: Record<string, string> = {
  RASCUNHO:  'Rascunho',
  ATIVO:     'Ativo',
  REVISAO:   'Em Revisão',
  ARQUIVADO: 'Arquivado',
}

const statusClass: Record<string, string> = {
  RASCUNHO:  'badge badge-info',
  ATIVO:     'badge badge-baixo',
  REVISAO:   'badge badge-moderado',
  ARQUIVADO: 'badge bg-gray-100 text-gray-600',
}

const formVazio = {
  versao: '',
  dataElaboracao: '',
  dataRevisao: '',
  elaborador: '',
  status: 'RASCUNHO',
  descricao: '',
}

export function Pgr() {
  const [pgrs, setPgrs] = useState<Pgr[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<Pgr | null>(null)
  const [form, setForm] = useState(formVazio)

  async function loadPgrs() {
    try {
      const response = await api.get('/pgr')
      setPgrs(response.data)
    } catch {
      toast.error('Erro ao carregar PGR')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPgrs() }, [])

  function openNovo() {
    setEditando(null)
    setForm(formVazio)
    setShowModal(true)
  }

  function openEditar(pgr: Pgr) {
    setEditando(pgr)
    setForm({
      versao:          pgr.versao,
      dataElaboracao:  pgr.dataElaboracao?.split('T')[0] ?? '',
      dataRevisao:     pgr.dataRevisao?.split('T')[0] ?? '',
      elaborador:      pgr.elaborador,
      status:          pgr.status,
      descricao:       pgr.descricao,
    })
    setShowModal(true)
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editando) {
        await api.put(`/pgr/${editando.id}`, form)
        toast.success('PGR atualizado!')
      } else {
        await api.post('/pgr', form)
        toast.success('PGR cadastrado!')
      }
      setShowModal(false)
      loadPgrs()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao salvar PGR')
    }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Deseja excluir este PGR?')) return
    try {
      await api.delete(`/pgr/${id}`)
      toast.success('PGR excluído!')
      loadPgrs()
    } catch {
      toast.error('Erro ao excluir PGR')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">PGR</h2>
          <p className="page-subtitle">Programa de Gerenciamento de Riscos</p>
        </div>
        <button onClick={openNovo} className="btn-primary">
          <Plus size={16} />
          Novo PGR
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
                <th>Versão</th>
                <th>Elaborador</th>
                <th>Data Elaboração</th>
                <th>Data Revisão</th>
                <th>Status</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pgrs.map((pgr) => (
                <tr key={pgr.id}>
                  <td className="font-semibold text-gray-800">{pgr.versao}</td>
                  <td>{pgr.elaborador}</td>
                  <td>
                    {pgr.dataElaboracao
                      ? new Date(pgr.dataElaboracao).toLocaleDateString('pt-BR')
                      : '—'}
                  </td>
                  <td>
                    {pgr.dataRevisao
                      ? new Date(pgr.dataRevisao).toLocaleDateString('pt-BR')
                      : '—'}
                  </td>
                  <td>
                    <span className={statusClass[pgr.status]}>
                      {statusLabel[pgr.status]}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditar(pgr)}
                        className="p-2 rounded-lg hover:bg-brand-50 text-brand-600 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleExcluir(pgr.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pgrs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400">Nenhum PGR cadastrado.</p>
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
              {editando ? 'Editar PGR' : 'Novo PGR'}
            </h3>

            <form onSubmit={handleSalvar} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Versão</label>
                  <input
                    type="text"
                    value={form.versao}
                    onChange={(e) => setForm({ ...form, versao: e.target.value })}
                    required
                    className="input"
                    placeholder="Ex: 1.0.0"
                  />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="input"
                  >
                    <option value="RASCUNHO">Rascunho</option>
                    <option value="ATIVO">Ativo</option>
                    <option value="REVISAO">Em Revisão</option>
                    <option value="ARQUIVADO">Arquivado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Elaborador</label>
                <input
                  type="text"
                  value={form.elaborador}
                  onChange={(e) => setForm({ ...form, elaborador: e.target.value })}
                  required
                  className="input"
                  placeholder="Nome do responsável pela elaboração"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Data de Elaboração</label>
                  <input
                    type="date"
                    value={form.dataElaboracao}
                    onChange={(e) => setForm({ ...form, dataElaboracao: e.target.value })}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Data de Revisão</label>
                  <input
                    type="date"
                    value={form.dataRevisao}
                    onChange={(e) => setForm({ ...form, dataRevisao: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Descrição / Escopo</label>
                <textarea
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  rows={3}
                  className="input resize-none"
                  placeholder="Descreva o escopo deste PGR..."
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

