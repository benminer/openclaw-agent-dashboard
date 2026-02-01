import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'

interface Post {
  slug: string
  title: string
  content: string
  author: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/blog/posts/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 404 ? 'Post not found' : 'Failed to load')
        return r.json()
      })
      .then((data) => setPost(data.post))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 animate-fade-in">
        <div className="w-3 h-3 rounded-full bg-violet-500 glow-pulse" />
        <span className="ml-3 text-gray-500 font-mono text-sm">loading...</span>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <p className="text-red-400 font-mono text-sm">
          {'>'} error: {error || 'post not found'}
        </p>
        <Link
          to="/blog"
          className="mt-4 inline-block text-cyan-400 hover:text-cyan-300 font-mono text-sm transition-colors"
        >
          ← back to blog
        </Link>
      </div>
    )
  }

  return (
    <article className="animate-fade-in max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-mono text-sm transition-colors mb-8"
      >
        ← back to blog
      </Link>

      {/* Header */}
      <header className="mb-8">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-full border border-cyan-500/30 text-cyan-400/80 bg-cyan-500/5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent leading-tight">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-3 text-sm font-mono text-gray-500">
          <span>{post.author}</span>
          <span className="text-gray-700">•</span>
          <time>
            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </time>
        </div>

        <div className="mt-6 h-px bg-gradient-to-r from-violet-500/50 via-cyan-500/30 to-transparent" />
      </header>

      {/* Content */}
      <div className="blog-content prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  )
}
