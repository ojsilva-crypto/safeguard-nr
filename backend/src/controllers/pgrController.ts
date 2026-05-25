
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const pgrController = {
  async index(_req: Request, res: Response) {
    const pgrs = await prisma.pgr.findMany({ orderBy: { createdAt: 'desc' } })
    return res.json(pgrs)
  },

  async show(req: Request, res: Response) {
    const { id } = req.params
    const pgr = await prisma.pgr.findUnique({ where: { id: Number(id) } })
    if (!pgr) return res.status(404).json({ message: 'PGR não encontrado' })
    return res.json(pgr)
  },

  async create(req: Request, res: Response) {
    const { versao, dataElaboracao, dataRevisao, elaborador, status, descricao } = req.body
    const pgr = await prisma.pgr.create({
      data: {
        versao,
        dataElaboracao: new Date(dataElaboracao),
        dataRevisao:    dataRevisao ? new Date(dataRevisao) : null,
        elaborador,
        status,
        descricao,
      },
    })
    return res.status(201).json(pgr)
  },

  async update(req: Request, res: Response) {
    const { id } = req.params
    const { versao, dataElaboracao, dataRevisao, elaborador, status, descricao } = req.body
    const pgr = await prisma.pgr.update({
      where: { id: Number(id) },
      data: {
        versao,
        dataElaboracao: new Date(dataElaboracao),
        dataRevisao:    dataRevisao ? new Date(dataRevisao) : null,
        elaborador,
        status,
        descricao,
      },
    })
    return res.json(pgr)
  },

  async destroy(req: Request, res: Response) {
    const { id } = req.params
    await prisma.pgr.delete({ where: { id: Number(id) } })
    return res.status(204).send()
  },
}
