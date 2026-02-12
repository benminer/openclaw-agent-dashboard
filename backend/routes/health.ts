import { data } from '@ampt/sdk'
import express from 'express'
import { authMiddleware } from '@/middleware/auth'

export const healthRouter = express.Router()

const healthData = data('health')

// POST /api/health/system - Store system health metrics
healthRouter.post('/system', authMiddleware('write'), async (req, res) => {
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

    await healthData.set(`system:${hostname}`, healthMetrics)

    res.json({ success: true, health: healthMetrics })
  } catch (error) {
    console.error('Error storing health metrics:', error)
    res.status(500).json({ error: 'Failed to store health metrics' })
  }
})

// GET /api/health/system/:hostname - Get system health
healthRouter.get('/system/:hostname', authMiddleware('read'), async (req, res) => {
  try {
    const { hostname } = req.params
    const metrics = await healthData.get(`system:${hostname}`)

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
healthRouter.get('/systems', authMiddleware('read'), async (_req, res) => {
  try {
    const systems = []

    for await (const { value } of healthData.scan({ label: 'system:*' })) {
      systems.push(value)
    }

    // Sort by last update (most recent first)
    systems.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    res.json(systems)
  } catch (error) {
    console.error('Error listing health metrics:', error)
    res.status(500).json({ error: 'Failed to list health metrics' })
  }
})
