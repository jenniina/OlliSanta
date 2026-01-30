import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

type JwtPayload = jwt.JwtPayload & {
  userId?: string
  role?: number
  username?: string
  email?: string
}

export const requireAuth = (opts?: { minRole?: number }): RequestHandler => {
  const minRole = opts?.minRole

  return (req, res, next) => {
    const header = req.headers.authorization
    const token = header?.startsWith('Bearer ')
      ? header.slice('Bearer '.length)
      : null

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      return res
        .status(500)
        .json({ success: false, message: 'Server misconfigured' })
    }

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload
      ;(req as unknown as { user?: JwtPayload }).user = decoded

      if (typeof minRole === 'number') {
        const role = typeof decoded.role === 'number' ? decoded.role : -1
        if (role < minRole) {
          return res.status(403).json({ success: false, message: 'Forbidden' })
        }
      }

      next()
    } catch {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }
  }
}
