
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface TokenPayload {
  id: number
  email: string
  role: string
  iat: number
  exp: number
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ?? 'secret'
    ) as TokenPayload

    req.user = {
      id:    decoded.id,
      email: decoded.email,
      role:  decoded.role,
    }

    return next()
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' })
  }
}
