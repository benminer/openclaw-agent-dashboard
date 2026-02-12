import { params } from '@ampt/sdk'
import type { NextFunction, Request, RequestHandler, Response } from 'express'

export function authMiddleware(_mode: 'read' | 'write'): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const apiKey = params('BACKUP_API_KEY')
      const header = req.headers.authorization

      if (!header || !header.startsWith('Bearer ') || header.slice(7) !== apiKey) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      next()
    } catch (error) {
      console.error('Auth middleware error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export const sameOriginOrAuth: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const origin = req.headers.origin || req.headers.referer || ''
    const host = req.headers.host || ''

    // Allow same-origin requests (frontend on same domain)
    if (origin.includes(host) || !origin) {
      next()
      return
    }

    // Otherwise require API key
    const apiKey = params('BACKUP_API_KEY')
    const header = req.headers.authorization

    if (header?.startsWith('Bearer ') && header.slice(7) === apiKey) {
      next()
      return
    }

    res.status(403).json({ error: 'Forbidden' })
  } catch (error) {
    console.error('sameOriginOrAuth error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
