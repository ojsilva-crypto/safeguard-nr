import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Usuário admin
  const senhaHash = await bcrypt.hash('admin123', 10)
  await prisma.usuario.upsert({
    where:  { email: 'admin@safeguard.com' },
    update: {},
    create: {
      nome:  'Administrador',
      email: 'admin@safeguard.com',
      senha: senhaHash,
      role:  'ADMIN',
    },
  })

  // Riscos exemplo
  await prisma.risco.createMany({
    skipDuplicates: true,
    data: [
      { descricao: 'Exposição a ruído acima de 85 dB(A)',        nivel: 'CRITICO',  status: 'EM_TRATAMENTO', setor: 'Produção',     responsavel: 'Carlos Silva',   prazo: new Date('2024-12-31') },
      { descricao: 'Ergonomia inadequada em postos de trabalho', nivel: 'MODERADO', status: 'IDENTIFICADO',  setor: 'Administrativo', responsavel: 'Ana Souza',    prazo: new Date('2024-11-30') },
      { descricao: 'Risco químico — manuseio de solventes',      nivel: 'CRITICO',  status: 'IDENTIFICADO',  setor: 'Manutenção',   responsavel: 'Pedro Lima',     prazo: new Date('2024-10-15') },
      { descricao: 'Iluminação insuficiente no almoxarifado',    nivel: 'BAIXO',    status: 'CONTROLADO',    setor: 'Almoxarifado', responsavel: 'Marcia Rocha',   prazo: new Date('2024-09-30') },
      { descricao: 'Risco de queda em área elevada',             nivel: 'CRITICO',  status: 'EM_TRATAMENTO', setor: 'Manutenção',   responsavel: 'João Ferreira',  prazo: new Date('2024-10-31') },
    ],
  })

  // PGR exemplo
  await prisma.pgr.create({
    data: {
      versao:         '1.0.0',
      dataElaboracao: new Date('2024-01-10'),
      dataRevisao:    new Date('2025-01-10'),
      elaborador:     'Eng. Carlos Mendes',
      status:         'ATIVO',
      descricao:      'PGR elaborado conforme NR-1 — abrange todos os setores da empresa',
    },
  })

  // Colaboradores exemplo
  await prisma.colaborador.createMany({
    skipDuplicates: true,
    data: [
      { nome: 'Carlos Silva',   cargo: 'Operador de Máquinas',   setor: 'Produção',       email: 'carlos@empresa.com',  dataAdmissao: new Date('2019-03-15'), ativo: true  },
      { nome: 'Ana Souza',      cargo: 'Analista Administrativo', setor: 'Administrativo', email: 'ana@empresa.com',     dataAdmissao: new Date('2021-06-01'), ativo: true  },
      { nome: 'Pedro Lima',     cargo: 'Técnico de Manutenção',  setor: 'Manutenção',     email: 'pedro@empresa.com',   dataAdmissao: new Date('2020-09-20'), ativo: true  },
      { nome: 'Marcia Rocha',   cargo: 'Almoxarife',             setor: 'Almoxarifado',   email: 'marcia@empresa.com',  dataAdmissao: new Date('2018-11-05'), ativo: true  },
      { nome: 'João Ferreira',  cargo: 'Eletricista Industrial', setor: 'Manutenção',     email: 'joao@empresa.com',    dataAdmissao: new Date('2022-02-14'), ativo: false },
    ],
  })

  // Compliance NR-1 exemplo
  await prisma.compliance.createMany({
    skipDuplicates: true,
    data: [
      { requisito: 'NR-1 §1.1',  descricao: 'Política de SST estabelecida e comunicada',               status: 'CONFORME',      responsavel: 'SESMT' },
      { requisito: 'NR-1 §1.2',  descricao: 'PGR elaborado e vigente',                                 status: 'CONFORME',      responsavel: 'SESMT' },
      { requisito: 'NR-1 §1.3',  descricao: 'Inventário de riscos atualizado',                         status: 'EM_TRATAMENTO' as any, responsavel: 'Eng. Segurança' },
      { requisito: 'NR-1 §1.4',  descricao: 'Plano de ação documentado para riscos críticos',          status: 'PENDENTE',      responsavel: 'Gestão' },
      { requisito: 'NR-1 §1.5',  descricao: 'Treinamentos de SST realizados',                          status: 'CONFORME',      responsavel: 'RH' },
      { requisito: 'NR-1 §1.6',  descricao: 'Registro de acidentes e incidentes mantido',              status: 'CONFORME',      responsavel: 'SESMT' },
      { requisito: 'NR-1 §1.7',  descricao: 'Participação dos trabalhadores garantida',                status: 'PENDENTE',      responsavel: 'RH' },
      { requisito: 'NR-1 §1.8',  descricao: 'Monitoramento e revisão do PGR realizado',                status: 'NAO_CONFORME',  responsavel: 'SESMT' },
    ],
  })

  console.log('✅ Seed concluído com sucesso!')
  console.log('📧 Login: admin@safeguard.com | 🔑 Senha: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

