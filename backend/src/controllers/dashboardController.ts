import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export async function getDashboard(_req: Request, res: Response) {
  const [riscos, pgr, colaboradores, compliance] = await Promise.all([
    prisma.risco.findMany(),
    prisma.pgr.findMany(),
    prisma.colaborador.findMany(),
    prisma.compliance.findMany(),
  ])

  return res.json({
    riscos: {
      total: riscos.length,
      criticos: riscos.filter((r) => r.nivel === 'critico').length,
      altos: riscos.filter((r) => r.nivel === 'alto').length,
    },
    pgr: {
      total: pgr.length,
      emAndamento: pgr.filter((p) => p.status === 'em_andamento').length,
    },
    colaboradores: {
      total: colaboradores.length,
      ativos: colaboradores.filter((c) => c.status === 'ativo').length,
    },
    compliance: {
      total: compliance.length,
      pendentes: compliance.filter((c) => c.status === 'pendente').length,
    },
  })
}
