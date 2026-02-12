import { data } from '@ampt/data'
import express from 'express'

export const healthRouter = express.Router()

// POST /api/health/system - Store system health metrics
healthRouter.post('/system', async (req, res) => {
  try {
    const { hostname, platform, arch, nodeVersion, openclawVersion, uptime, memory, cpu, disk, services } = req.body

    if (!hostname) {
      return res.status(400).json({ error: 'hostname required' })
    }

    const healthMetrics = {
      hostname,
      platform,
      arch,
      nodeVersion,
      openclawVersion,
      uptime: uptime || 0,
      memory: memory || {},
      cpu: cpu || {},
      disk: disk || [],
      services: services || {},
      updatedAt: new Date().toISOString()
    }

    await data.set(`health:system:${hostname}`, healthMetrics)

    res.json({ success: true, health: healthMetrics })
  } catch (error) {
    console.error('Error storing health metrics:', error)
    res.status(500).json({ error: 'Failed to store health metrics' })
  }
})

// GET /api/health/system/:hostname - Get system health
healthRouter.get('/system/:hostname', async (req, res) => {
  try {
    const { hostname } = req.params
    const metrics = await data.get(`health:system:${hostname}`)

    if (!metrics) {
      return res.status(404).json({ error: 'System health not found' })
    }

    res.json(metrics)
  } catch (error) {
    console.error('Error fetching health metrics:', error)
    res.status(500).json({ error: 'Failed to fetch health metrics' })
  }
})

// GET /api/health/systems - List all system health metrics
healthRouter.get('/systems', async (_req, res) => {
  try {
    const result = await data.get('health:system:*')
    const systems = result?.items || []

    // Sort by last update (most recent first)
    systems.sort(
      (a, b) => new Date((b.value as any).updatedAt).getTime() - new Date((a.value as any).updatedAt).getTime()
    )

    res.json(systems.map((item) => item.value))
  } catch (error) {
    console.error('Error listing health metrics:', error)
    res.status(500).json({ error: 'Failed to list health metrics' })
  }
})
