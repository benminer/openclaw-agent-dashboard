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

export async function sameOriginOrAuth(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin || req.headers.referer || ''
  const host = req.headers.host || ''

  // Allow same-origin requests (frontend on same domain)
  if (origin.includes(host) || !origin) {
    next()
    return
  }

  // Otherwise require API key
  const apiKey = await params('API_KEY')
  const header = req.headers.authorization

  if (header?.startsWith('Bearer ') && header.slice(7) === apiKey) {
    next()
    return
  }

  res.status(403).json({ error: 'Forbidden' })
}
