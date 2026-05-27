export interface Risco {
  id: string
  descricao: string
  nr: string
  probabilidade: 'baixa' | 'media' | 'alta'
  severidade: 'baixa' | 'media' | 'alta'
  status: 'identificado' | 'em_tratamento' | 'mitigado'
  responsavel: string
  prazo: string
}

export interface Treinamento {
  id: string
  titulo: string
  nr: string
  funcionarios: number
  concluidos: number
  dataLimite: string
  status: 'pendente' | 'em_andamento' | 'concluido' | 'vencido'
}

export interface Documento {
  id: string
  nome: string
  tipo: string
  nr: string
  dataUpload: string
  validade: string
  status: 'valido' | 'vencendo' | 'vencido'
}

export interface Compliance {
  id: string
  nr: string
  titulo: string
  totalRequisitos: number
  atendidos: number
  percentual: number
  status: 'conforme' | 'parcial' | 'nao_conforme'
}
