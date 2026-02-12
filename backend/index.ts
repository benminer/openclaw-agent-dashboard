import { http } from '@ampt/sdk'
import express from 'express'
import morgan from 'morgan'
import { authMiddleware, sameOriginOrAuth } from '@/middleware/auth'
import { activityReadRoutes, activityWriteRoutes } from '@/routes/activity'
import { readRoutes, writeRoutes } from '@/routes/backup'
import { blogReadRoutes, blogWriteRoutes } from '@/routes/blog'
import { cronReadRoutes, cronWriteRoutes } from '@/routes/cron'
import { healthRouter } from '@/routes/health'
import { memoryRouter } from '@/routes/memory'
import { sessionRouter } from '@/routes/session'

const app = express()

app.use(morgan('short'))

// Health check (no auth)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// New feature routes FIRST (most specific)
app.use('/api/session', sameOriginOrAuth, sessionRouter)
app.use('/api/memory', sameOriginOrAuth, memoryRouter)
app.use('/api/health', sameOriginOrAuth, healthRouter)

// Read routes -- same-origin (frontend) or API key
app.use('/api', sameOriginOrAuth, readRoutes)
app.use('/api', sameOriginOrAuth, blogReadRoutes)
app.use('/api', sameOriginOrAuth, activityReadRoutes)
app.use('/api', sameOriginOrAuth, cronReadRoutes)

// Write routes -- always require API key
app.use('/api', authMiddleware('write'), writeRoutes)
app.use('/api', authMiddleware('write'), blogWriteRoutes)
app.use('/api', authMiddleware('write'), activityWriteRoutes)
app.use('/api', authMiddleware('write'), cronWriteRoutes)

// SPA fallback -- serve index.html for non-API routes so React Router works
// Uses Ampt's readStaticFile since static assets aren't on disk in the usual way
app.use(async (_req, res) => {
  res.status(200).set('Content-Type', 'text/html')
  const stream = await http.node.readStaticFile('index.html')
  if (!stream) {
    return res.status(500).send('Failed to load index.html')
  }
  return stream.pipe(res)
})

http.node.use(app)
