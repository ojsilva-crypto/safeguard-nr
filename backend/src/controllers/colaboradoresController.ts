import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export async function list(_req: Request, res: Response) {
  const data = await prisma.colaborador.findMany({ orderBy: { nome: 'asc' } })
  return res.json(data)
}

export async function create(req: Request, res: Response) {
  const data = await prisma.colaborador.create({ data: req.body })
  return res.status(201).json(data)
}
