import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export async function list(_req: Request, res: Response) {
  const data = await prisma.compliance.findMany({ orderBy: { createdAt: 'desc' } })
  return res.json(data)
}

export async function create(req: Request, res: Response) {
  const data = await prisma.compliance.create({ data: req.body })
  return res.status(201).json(data)
}
