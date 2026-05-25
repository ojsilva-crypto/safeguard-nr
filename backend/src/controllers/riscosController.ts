
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const riscosController = {
  async index(_req: Request, res: Response) {
    const riscos = await prisma.risco.findMany({
      orderBy: [{ nivel: 'asc' }, { createdAt: 'desc' }],
    })
    return res.json(riscos)
  },

  async show(req: Request, res: Response) {
    const { id } = req.params
    const risco = await prisma.risco.findUnique({ where: { id: Number(id) } })
    if (!risco) return res.status(404).json({ message: 'Risco não encontrado' })
    return res.json(risco)
  },

  async create(req: Request, res: Response) {
    const { descricao, nivel, status, setor, responsavel, prazo } = req.body
    const risco = await prisma.risco.create({
      data: {
        descricao,
        nivel,
        status,
        setor,
        responsavel,
        prazo: prazo ? new Date(prazo) : null,
      },
    })
    return res.status(201).json(risco)
  },

  async update(req: Request, res: Response) {
    const { id } = req.params
    const { descricao, nivel, status, setor, responsavel, prazo } = req.body
    const risco = await prisma.risco.update({
      where: { id: Number(id) },
      data: {
        descricao,
        nivel,
        status,
        setor,
        responsavel,
        prazo: prazo ? new Date(prazo) : null,
      },
    })
    return res.json(risco)
  },

  async destroy(req: Request, res: Response) {
    const { id } = req.params
    await prisma.risco.delete({ where: { id: Number(id) } })
    return res.status(204).send()
  },
}
