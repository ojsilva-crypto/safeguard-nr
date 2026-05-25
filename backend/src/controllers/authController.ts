
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

export const authController = {
  async login(req: Request, res: Response) {
    const { email, senha } = req.body

    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' })
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha)

    if (!senhaValida) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' })
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET ?? 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as object
    )

    return res.json({
      token,
      usuario: {
        id:    usuario.id,
        nome:  usuario.nome,
        email: usuario.email,
        role:  usuario.role,
      },
    })
  },

  async me(req: Request, res: Response) {
    const usuario = await prisma.usuario.findUnique({
      where:  { id: req.user!.id },
      select: { id: true, nome: true, email: true, role: true, ativo: true },
    })

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    return res.json(usuario)
  },
}
