
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const colaboradoresController = {
  async index(_req: Request, res: Response) {
    const colaboradores = await prisma.colaborador.findMany({
      orderBy: { nome: 'asc' },
    })
    return res.json(colaboradores)
  },

  async show(req: Request, res: Response) {
    const { id } = req.params
    const colaborador = await prisma.colaborador.findUnique({
      where: { id: Number(id) },
    })
    if (!colaborador)
      return res.status(404).json({ message: 'Colaborador não encontrado' })
    return res.json(colaborador)
  },

  async create(req: Request, res: Response) {
    const { nome, cargo, setor, email, dataAdmissao, ativo } = req.body
    const colaborador = await prisma.colaborador.create({
      data: {
        nome,
        cargo,
        setor,
        email,
        dataAdmissao: new Date(dataAdmissao),
        ativo,
      },
    })
    return res.status(201).json(colaborador)
  },

  async update(req: Request, res: Response) {
    const { id } = req.params
    const { nome, cargo, setor, email, dataAdmissao, ativo } = req.body
    const colaborador = await prisma.colaborador.update({
      where: { id: Number(id) },
      data: {
        nome,
        cargo,
        setor,
        email,
        dataAdmissao: new Date(dataAdmissao),
        ativo,
      },
    })
    return res.json(colaborador)
  },

  async destroy(req: Request, res: Response) {
    const { id } = req.params
    await prisma.colaborador.delete({ where: { id: Number(id) } })
    return res.status(204).send()
  },
}
