
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const complianceController = {
  async index(_req: Request, res: Response) {
    const items = await prisma.compliance.findMany({
      orderBy: { requisito: 'asc' },
    })
    return res.json(items)
  },

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params
    const { status } = req.body

    const item = await prisma.compliance.update({
      where: { id: Number(id) },
      data: {
        status,
        dataVerificacao: new Date(),
      },
    })
    return res.json(item)
  },
}
