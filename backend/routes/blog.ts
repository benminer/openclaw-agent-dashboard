import { storage } from '@ampt/sdk'
import express, { Router } from 'express'

const blogStore = storage('blog')
const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/

function validSlug(s: string): boolean {
  return typeof s === 'string' && s.length >= 2 && s.length <= 128 && SLUG_RE.test(s)
}

export interface BlogPost {
  slug: string
  title: string
  content: string
  author: string
  tags: string[]
  createdAt: string
  updatedAt: string
  published: boolean
}

// Read routes (sameOriginOrAuth)
export const blogReadRoutes = Router()

// List posts (paginated, sorted by date desc)
blogReadRoutes.get('/blog/posts', async (_req, res) => {
  try {
    const pages = await blogStore.list('/', { recursive: true })
    const posts: (Omit<BlogPost, 'content'> & { excerpt: string })[] = []

    for await (const items of pages) {
      for (const item of items) {
        if (!item.endsWith('.json')) continue
        const raw = await blogStore.readBuffer(item)
        if (!raw) continue
        let post: BlogPost
        try {
          post = JSON.parse(raw.toString())
        } catch {
          continue
        }
        if (!post.published) continue
        const { content, ...rest } = post
        posts.push({
          ...rest,
          excerpt: content.slice(0, 200).replace(/[#*_`>[\]]/g, '')
        })
      }
    }

    // Sort by date desc
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    res.json({ posts })
  } catch (err) {
    console.error('Error listing blog posts:', err)
    res.status(500).json({ error: 'Failed to list posts' })
  }
})

// Get single post by slug (returns published only for non-API callers)
blogReadRoutes.get('/blog/posts/:slug', async (req, res) => {
  try {
    if (!validSlug(req.params.slug)) {
      res.status(400).json({ error: 'Invalid slug' })
      return
    }
    const raw = await blogStore.readBuffer(`/${req.params.slug}.json`)
    if (!raw) {
      res.status(404).json({ error: 'Post not found' })
      return
    }
    const post: BlogPost = JSON.parse(raw.toString())
    res.json({ post })
  } catch (err) {
    console.error('Error fetching blog post:', err)
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

// Write routes (authMiddleware)
export const blogWriteRoutes = Router()
blogWriteRoutes.use(express.json())

// Create post
blogWriteRoutes.post('/blog/posts', async (req, res) => {
  const { slug, title, content, author, tags, published } = req.body

  if (!slug || !title || !content) {
    res.status(400).json({ error: 'slug, title, and content are required' })
    return
  }

  if (!validSlug(slug)) {
    res.status(400).json({ error: 'Invalid slug. Use lowercase alphanumeric and hyphens only.' })
    return
  }

  // Check uniqueness
  const existing = await blogStore.readBuffer(`/${slug}.json`)
  if (existing) {
    res.status(409).json({ error: 'A post with this slug already exists' })
    return
  }

  const now = new Date().toISOString()
  const post: BlogPost = {
    slug,
    title,
    content,
    author: author || 'Anonymous',
    tags: tags || [],
    createdAt: now,
    updatedAt: now,
    published: published ?? false
  }

  try {
    await blogStore.write(`/${slug}.json`, Buffer.from(JSON.stringify(post)))
    res.status(201).json({ post })
  } catch (err) {
    console.error('Error creating blog post:', err)
    res.status(500).json({ error: 'Failed to create post' })
  }
})

// Update post
blogWriteRoutes.put('/blog/posts/:slug', async (req, res) => {
  try {
    if (!validSlug(req.params.slug)) {
      res.status(400).json({ error: 'Invalid slug' })
      return
    }
    const raw = await blogStore.readBuffer(`/${req.params.slug}.json`)
    if (!raw) {
      res.status(404).json({ error: 'Post not found' })
      return
    }

    const existing: BlogPost = JSON.parse(raw.toString())
    const updated: BlogPost = {
      ...existing,
      ...req.body,
      slug: req.params.slug,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString()
    }

    await blogStore.write(`/${req.params.slug}.json`, Buffer.from(JSON.stringify(updated)))
    res.json({ post: updated })
  } catch (err) {
    console.error('Error updating blog post:', err)
    res.status(500).json({ error: 'Failed to update post' })
  }
})

// Delete post
blogWriteRoutes.delete('/blog/posts/:slug', async (req, res) => {
  try {
    if (!validSlug(req.params.slug)) {
      res.status(400).json({ error: 'Invalid slug' })
      return
    }
    await blogStore.remove(`/${req.params.slug}.json`)
    res.json({ deleted: true })
  } catch (err) {
    console.error('Error deleting blog post:', err)
    res.status(500).json({ error: 'Failed to delete post' })
  }
})
