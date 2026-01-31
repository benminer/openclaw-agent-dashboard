import { params } from '@ampt/sdk'
import type { NextFunction, Request, Response } from 'express'

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = await params('API_KEY')
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ') || header.slice(7) !== apiKey) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}
