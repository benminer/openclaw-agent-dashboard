import { http } from '@ampt/sdk'
import express from 'express'
import morgan from 'morgan'
import { authMiddleware, sameOriginOrAuth } from '@/middleware/auth'
import { readRoutes, writeRoutes } from '@/routes/backup'

const app = express()

app.use(morgan('short'))

// Health check (no auth)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Read routes -- same-origin (frontend) or API key
app.use('/api', sameOriginOrAuth, readRoutes)

// Write routes -- always require API key
app.use('/api', authMiddleware, writeRoutes)

http.node.use(app)
