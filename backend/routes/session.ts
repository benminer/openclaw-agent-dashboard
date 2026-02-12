import { data } from '@ampt/data'
import express from 'express'

export const sessionRouter = express.Router()

// POST /api/session - Store session status
sessionRouter.post('/', async (req, res) => {
  try {
    const { sessionKey, agent, model, thinking, tokenUsage, costUsd, uptime, runtime, channel, lastActivity } = req.body

    if (!sessionKey) {
      return res.status(400).json({ error: 'sessionKey required' })
    }

    const sessionData = {
      sessionKey,
      agent,
      model,
      thinking,
      tokenUsage: tokenUsage || {},
      costUsd: costUsd || 0,
      uptime: uptime || 0,
      runtime: runtime || {},
      channel: channel || 'unknown',
      lastActivity: lastActivity || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await data.set(`sessions:${sessionKey}`, sessionData)

    res.json({ success: true, session: sessionData })
  } catch (error) {
    console.error('Error storing session:', error)
    res.status(500).json({ error: 'Failed to store session data' })
  }
})

// GET /api/session/:sessionKey - Get session status
sessionRouter.get('/:sessionKey', async (req, res) => {
  try {
    const { sessionKey } = req.params
    const sessionData = await data.get(`sessions:${sessionKey}`)

    if (!sessionData) {
      return res.status(404).json({ error: 'Session not found' })
    }

    res.json(sessionData)
  } catch (error) {
    console.error('Error fetching session:', error)
    res.status(500).json({ error: 'Failed to fetch session data' })
  }
})

// GET /api/sessions - List all sessions
sessionRouter.get('/', async (_req, res) => {
  try {
    const result = await data.get('sessions:*')
    const allSessions = result?.items || []

    // Sort by last activity (most recent first)
    allSessions.sort(
      (a, b) =>
        new Date((b.value as any).lastActivity || (b.value as any).updatedAt).getTime() -
        new Date((a.value as any).lastActivity || (a.value as any).updatedAt).getTime()
    )

    res.json(allSessions.map((item) => item.value))
  } catch (error) {
    console.error('Error listing sessions:', error)
    res.status(500).json({ error: 'Failed to list sessions' })
  }
})

// DELETE /api/session/:sessionKey - Delete session
sessionRouter.delete('/:sessionKey', async (req, res) => {
  try {
    const { sessionKey } = req.params
    await data.remove(`sessions:${sessionKey}`)
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting session:', error)
    res.status(500).json({ error: 'Failed to delete session' })
  }
})
