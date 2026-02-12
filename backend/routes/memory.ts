import { storage } from '@ampt/sdk'
import express from 'express'
import { authMiddleware } from '@/middleware/auth'

export const memoryRouter = express.Router()

const memoryStorage = storage('memory')

// POST /api/memory - Upload memory file
memoryRouter.post('/', authMiddleware('write'), async (req, res) => {
  try {
    const { path, content, metadata } = req.body

    if (!path || !content) {
      return res.status(400).json({ error: 'path and content required' })
    }

    await memoryStorage.write(path, content, {
      metadata: {
        ...metadata,
        updatedAt: new Date().toISOString()
      }
    })

    res.json({ success: true, path })
  } catch (error) {
    console.error('Error storing memory:', error)
    res.status(500).json({ error: 'Failed to store memory file' })
  }
})

// GET /api/memory - List memory files
memoryRouter.get('/', authMiddleware('read'), async (_req, res) => {
  try {
    const files = []

    for await (const item of memoryStorage.list('/', { recursive: true })) {
      if (item.key.endsWith('.md')) {
        const stat = await memoryStorage.stat(item.key)
        files.push({
          path: item.key,
          size: stat.size,
          lastModified: stat.lastModified,
          metadata: stat.metadata
        })
      }
    }

    // Sort by last modified (newest first)
    files.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())

    res.json(files)
  } catch (error) {
    console.error('Error listing memory files:', error)
    res.status(500).json({ error: 'Failed to list memory files' })
  }
})

// GET /api/memory/:path(*) - Get memory file content
memoryRouter.get('/:path(*)', authMiddleware('read'), async (req, res) => {
  try {
    const path = req.params.path

    const content = await memoryStorage.read(path)
    const stat = await memoryStorage.stat(path)

    res.json({
      path,
      content,
      size: stat.size,
      lastModified: stat.lastModified,
      metadata: stat.metadata
    })
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Memory file not found' })
    }
    console.error('Error reading memory file:', error)
    res.status(500).json({ error: 'Failed to read memory file' })
  }
})

// DELETE /api/memory/:path(*) - Delete memory file
memoryRouter.delete('/:path(*)', authMiddleware('write'), async (req, res) => {
  try {
    const path = req.params.path
    await memoryStorage.remove(path)
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting memory file:', error)
    res.status(500).json({ error: 'Failed to delete memory file' })
  }
})
