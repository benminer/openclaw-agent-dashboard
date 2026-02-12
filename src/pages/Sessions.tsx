import { useCallback, useEffect, useState } from 'react'

interface Session {
  sessionKey: string
  agent: string
  model: string
  thinking: string
  tokenUsage: {
    total?: number
    input?: number
    output?: number
  }
  costUsd: number
  uptime: number
  runtime: {
    host?: string
    os?: string
    node?: string
  }
  channel: string
  lastActivity: string
  updatedAt: string
}

export const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/sessions')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setSessions(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSessions()
    const interval = setInterval(fetchSessions, 10000) // Refresh every 10s
    return () => clearInterval(interval)
  }, [fetchSessions])

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatCost = (usd: number) => {
    return usd < 0.01 ? '<$0.01' : `$${usd.toFixed(2)}`
  }

  const getActivityStatus = (lastActivity: string) => {
    const minutes = Math.floor((Date.now() - new Date(lastActivity).getTime()) / 60000)
    if (minutes < 5) return { label: 'Active', color: 'text-green-400' }
    if (minutes < 30) return { label: 'Idle', color: 'text-yellow-400' }
    return { label: 'Stale', color: 'text-gray-500' }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Sessions</h1>
        <div className="text-gray-400">Loading sessions...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">OpenClaw Sessions</h1>
        <button
          type="button"
          onClick={fetchSessions}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
        >
          Refresh
        </button>
      </div>

      {error && <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">{error}</div>}

      {sessions.length === 0 ? (
        <div className="bg-gray-900 rounded-lg p-8 text-center text-gray-400">No active sessions found</div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => {
            const status = getActivityStatus(session.lastActivity || session.updatedAt)
            return (
              <div
                key={session.sessionKey}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{session.agent || 'Unknown Agent'}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className={status.color}>{status.label}</span>
                      <span>•</span>
                      <span>{session.channel}</span>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-gray-400">Uptime</div>
                    <div className="font-mono">{formatUptime(session.uptime)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Model</div>
                    <div className="font-mono text-sm">{session.model}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Thinking</div>
                    <div className="font-mono text-sm">{session.thinking}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tokens</div>
                    <div className="font-mono text-sm">{session.tokenUsage.total?.toLocaleString() || '0'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cost</div>
                    <div className="font-mono text-sm">{formatCost(session.costUsd)}</div>
                  </div>
                </div>

                {session.runtime && (
                  <div className="text-xs text-gray-500 font-mono">
                    {session.runtime.host} • {session.runtime.os} • {session.runtime.node}
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-600">
                  Last activity: {new Date(session.lastActivity || session.updatedAt).toLocaleString()}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
