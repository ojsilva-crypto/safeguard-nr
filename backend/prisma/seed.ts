import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Usuário admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@safeguard.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@safeguard.com',
      password: hashedPassword,
      role: 'admin',
    },
  })

  // Riscos
  await prisma.risco.createMany({
    skipDuplicates: true,
    data: [
      { titulo: 'Exposição a agentes químicos', descricao: 'Contato com solventes na linha de produção', nivel: 'alto', categoria: 'Químico', status: 'em_tratamento', responsavel: 'João Silva', prazo: new Date('2026-06-30') },
      { titulo: 'Ruído excessivo', descricao: 'Níveis acima de 85dB na área de usinagem', nivel: 'medio', categoria: 'Físico', status: 'aberto', responsavel: 'Maria Santos', prazo: new Date('2026-07-15') },
      { titulo: 'Ergonomia inadequada', descricao: 'Postura incorreta em postos de trabalho', nivel: 'baixo', categoria: 'Ergonômico', status: 'aberto', responsavel: 'Carlos Lima', prazo: new Date('2026-08-01') },
      { titulo: 'Risco de incêndio', descricao: 'Armazenamento inadequado de materiais inflamáveis', nivel: 'critico', categoria: 'Segurança', status: 'em_tratamento', responsavel: 'Ana Costa', prazo: new Date('2026-06-15') },
    ],
  })

  // PGR
  await prisma.pgr.createMany({
    skipDuplicates: true,
    data: [
      { titulo: 'Revisão do inventário de riscos', descricao: 'Atualização completa do inventário de riscos ocupacionais', status: 'em_andamento', responsavel: 'João Silva', dataInicio: new Date('2026-05-01'), dataPrevista: new Date('2026-07-01') },
      { titulo: 'Implantação de EPC na usinagem', descricao: 'Instalação de equipamentos de proteção coletiva', status: 'pendente', responsavel: 'Maria Santos', dataInicio: new Date('2026-06-01'), dataPrevista: new Date('2026-08-01') },
      { titulo: 'Treinamento NR-35', descricao: 'Capacitação para trabalho em altura', status: 'concluido', responsavel: 'Carlos Lima', dataInicio: new Date('2026-04-01'), dataPrevista: new Date('2026-04-30'), dataConclusao: new Date('2026-04-28') },
    ],
  })

  // Colaboradores
  await prisma.colaborador.createMany({
    skipDuplicates: true,
    data: [
      { nome: 'João Silva', cargo: 'Técnico de Segurança', setor: 'SESMT', email: 'joao.silva@empresa.com', telefone: '(47) 99999-0001', status: 'ativo', admissao: new Date('2020-03-15') },
      { nome: 'Maria Santos', cargo: 'Engenheira de Segurança', setor: 'SESMT', email: 'maria.santos@empresa.com', telefone: '(47) 99999-0002', status: 'ativo', admissao: new Date('2019-07-01') },
      { nome: 'Carlos Lima', cargo: 'Operador de Produção', setor: 'Produção', email: 'carlos.lima@empresa.com', telefone: '(47) 99999-0003', status: 'ferias', admissao: new Date('2021-01-10') },
      { nome: 'Ana Costa', cargo: 'Supervisora de Qualidade', setor: 'Qualidade', email: 'ana.costa@empresa.com', telefone: '(47) 99999-0004', status: 'ativo', admissao: new Date('2018-11-20') },
      { nome: 'Pedro Oliveira', cargo: 'Auxiliar de Produção', setor: 'Produção', email: 'pedro.oliveira@empresa.com', telefone: '(47) 99999-0005', status: 'afastado', admissao: new Date('2022-05-05') },
    ],
  })

  // Compliance
  await prisma.compliance.createMany({
    skipDuplicates: true,
    data: [
      { titulo: 'Auditoria NR-12', descricao: 'Auditoria de conformidade de máquinas e equipamentos', tipo: 'auditoria', status: 'pendente', responsavel: 'Maria Santos', prazo: new Date('2026-07-30') },
      { titulo: 'Treinamento CIPA', descricao: 'Capacitação dos membros da CIPA', tipo: 'treinamento', status: 'em_andamento', responsavel: 'João Silva', prazo: new Date('2026-06-20') },
      { titulo: 'Renovação PCMSO', descricao: 'Atualização do Programa de Controle Médico de Saúde Ocupacional', tipo: 'norma', status: 'pendente', responsavel: 'Ana Costa', prazo: new Date('2026-08-15') },
      { titulo: 'Investigação de incidente', descricao: 'Análise de acidente com afastamento ocorrido em 05/05', tipo: 'incidente', status: 'em_andamento', responsavel: 'Maria Santos', prazo: new Date('2026-06-05') },
    ],
  })

  console.log('✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
