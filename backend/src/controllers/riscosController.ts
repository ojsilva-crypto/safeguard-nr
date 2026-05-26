import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export async function list(_req: Request, res: Response) {
  const data = await prisma.risco.findMany({ orderBy: { createdAt: 'desc' } })
  return res.json(data)
}

export async function create(req: Request, res: Response) {
  const data = await prisma.risco.create({ data: req.body })
  return res.status(201).json(data)
}

export async function remove(req: Request, res: Response) {
  await prisma.risco.delete({ where: { id: req.params.id } })
  return res.status(204).send()
}
