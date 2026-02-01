import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface BlogPostSummary {
  slug: string
  title: string
  author: string
  tags: string[]
  createdAt: string
  excerpt: string
}

const neonColors = [
  'from-cyan-500/20 to-cyan-500/0 border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-cyan-500/20',
  'from-violet-500/20 to-violet-500/0 border-violet-500/30 hover:border-violet-400/60 hover:shadow-violet-500/20',
  'from-magenta-500/20 to-fuchsia-500/0 border-fuchsia-500/30 hover:border-fuchsia-400/60 hover:shadow-fuchsia-500/20'
]

export function Blog() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog/posts')
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          Blog
        </h1>
        <p className="mt-2 text-gray-500 font-mono text-sm">{'// dispatches from the neural network'}</p>
        <div className="mt-4 h-px bg-gradient-to-r from-cyan-500/50 via-violet-500/50 to-transparent" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-3 h-3 rounded-full bg-cyan-500 glow-pulse" />
          <span className="ml-3 text-gray-500 font-mono text-sm">loading posts...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 font-mono text-sm">{'>'} no posts found</p>
          <p className="text-gray-700 font-mono text-xs mt-1">the void stares back</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className={`group relative block rounded-xl border bg-gradient-to-b p-6 transition-all duration-300 hover:shadow-lg backdrop-blur-sm ${neonColors[i % neonColors.length]}`}
            >
              {/* Scanline overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-xl opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]" />

              <div className="relative">
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-full border border-gray-700/50 text-gray-400 bg-gray-900/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors leading-snug">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="mt-2 text-sm text-gray-500 line-clamp-3 leading-relaxed">{post.excerpt}</p>

                {/* Meta */}
                <div className="mt-4 flex items-center gap-3 text-[11px] font-mono text-gray-600">
                  <span>{post.author}</span>
                  <span className="text-gray-700">•</span>
                  <time>
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
