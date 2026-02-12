import { useCallback, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MemoryFile {
  path: string
  size: number
  lastModified: string
  metadata?: Record<string, any>
}

interface MemoryContent {
  path: string
  content: string
  size: number
  lastModified: string
  metadata?: Record<string, any>
}

export const Memory = () => {
  const [files, setFiles] = useState<MemoryFile[]>([])
  const [selectedFile, setSelectedFile] = useState<MemoryContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch('/api/memory')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setFiles(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch memory files')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const fetchFileContent = async (path: string) => {
    try {
      const res = await fetch(`/api/memory/${encodeURIComponent(path)}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setSelectedFile(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch file content')
    }
  }

  const filteredFiles = files.filter((file) => file.path.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Memory Browser</h1>
        <div className="text-gray-400">Loading memory files...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Memory Browser</h1>
        <p className="text-gray-400 text-sm">Browse MEMORY.md and daily memory files</p>
      </div>

      {error && <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">{error}</div>}

      <div className="grid md:grid-cols-3 gap-6">
        {/* File List */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
          />

          {filteredFiles.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-4 text-center text-gray-500 text-sm">No files found</div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <button
                  type="button"
                  key={file.path}
                  onClick={() => fetchFileContent(file.path)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedFile?.path === file.path
                      ? 'bg-blue-900/30 border border-blue-700'
                      : 'bg-gray-900 border border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="font-medium text-sm mb-1 truncate">{file.path}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatSize(file.size)}</span>
                    <span>•</span>
                    <span>{new Date(file.lastModified).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* File Content */}
        <div className="md:col-span-2">
          {selectedFile ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedFile.path}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{formatSize(selectedFile.size)}</span>
                    <span>•</span>
                    <span>Modified: {formatDate(selectedFile.lastModified)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-gray-200 text-sm"
                >
                  Close
                </button>
              </div>
              <div className="p-6 prose prose-invert prose-sm max-w-none overflow-auto" style={{ maxHeight: '70vh' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedFile.content}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center text-gray-500">
              Select a file to view its content
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
