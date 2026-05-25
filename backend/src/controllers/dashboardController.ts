import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const dashboardController = {
  async index(_req: Request, res: Response) {
    const [
      totalRiscos,
      riscosCriticos,
      totalColaboradores,
      pgrAtivo,
      riscosPerNivel,
      riscosPerStatus,
      conformes,
      totalCompliance,
    ] = await Promise.all([
      prisma.risco.count(),
      prisma.risco.count({ where: { nivel: 'CRITICO' } }),
      prisma.colaborador.count({ where: { ativo: true } }),
      prisma.pgr.findFirst({ where: { status: 'ATIVO' } }),
      prisma.risco.groupBy({ by: ['nivel'], _count: { _all: true } }),
      prisma.risco.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.compliance.count({ where: { status: 'CONFORME' } }),
      prisma.compliance.count(),
    ])

    const conformidadeNR1 =
      totalCompliance > 0
        ? Math.round((conformes / totalCompliance) * 100)
        : 0

    return res.json({
      totalRiscos,
      riscosCriticos,
      totalColaboradores,
      pgrAtivo: !!pgrAtivo,
      conformidadeNR1,
      riscosPerNivel: riscosPerNivel.map((r) => ({
        nivel: r.nivel,
        total: r._count._all,
      })),
      riscosPerStatus: riscosPerStatus.map((r) => ({
        status: r.status,
        total:  r._count._all,
      })),
    })
  },
}

