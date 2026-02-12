import { useCallback, useEffect, useState } from 'react'

interface DiskUsage {
  filesystem: string
  mount: string
  size: string
  used: string
  avail: string
  usePercent: string
}

interface SystemHealth {
  hostname: string
  platform: string
  arch: string
  nodeVersion: string
  openclawVersion: string
  uptime: number
  memory: {
    total?: number
    free?: number
    used?: number
    usedPercent?: number
  }
  cpu: {
    model?: string
    cores?: number
    loadAvg?: number[]
  }
  disk: DiskUsage[]
  services: Record<string, boolean | string>
  updatedAt: string
}

export const SystemHealth = () => {
  const [systems, setSystems] = useState<SystemHealth[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSystems = useCallback(async () => {
    try {
      const res = await fetch('/api/health/systems')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setSystems(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch system health')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSystems()
    const interval = setInterval(fetchSystems, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [fetchSystems])

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  const getHealthColor = (percent: number) => {
    if (percent < 60) return 'text-green-400'
    if (percent < 80) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getHealthBg = (percent: number) => {
    if (percent < 60) return 'bg-green-500'
    if (percent < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">System Health</h1>
        <div className="text-gray-400">Loading system metrics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">System Health</h1>
          <p className="text-gray-400 text-sm">Real-time system metrics and service status</p>
        </div>
        <button
          type="button"
          onClick={fetchSystems}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
        >
          Refresh
        </button>
      </div>

      {error && <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">{error}</div>}

      {systems.length === 0 ? (
        <div className="bg-gray-900 rounded-lg p-8 text-center text-gray-400">No system health data available</div>
      ) : (
        <div className="space-y-6">
          {systems.map((system) => (
            <div key={system.hostname} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{system.hostname}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>
                      {system.platform} ({system.arch})
                    </span>
                    <span>•</span>
                    <span>Node {system.nodeVersion}</span>
                    <span>•</span>
                    <span>Uptime: {formatUptime(system.uptime)}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Updated: {new Date(system.updatedAt).toLocaleString()}</div>
              </div>

              {/* Memory & CPU */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {system.memory.total && (
                  <div className="bg-gray-950 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Memory</span>
                      <span className={`text-sm font-mono ${getHealthColor(system.memory.usedPercent || 0)}`}>
                        {system.memory.usedPercent?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full ${getHealthBg(system.memory.usedPercent || 0)} transition-all`}
                        style={{ width: `${system.memory.usedPercent || 0}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatBytes(system.memory.used || 0)} / {formatBytes(system.memory.total)}
                    </div>
                  </div>
                )}

                {system.cpu.cores && (
                  <div className="bg-gray-950 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">CPU</span>
                      <span className="text-sm font-mono text-gray-400">{system.cpu.cores} cores</span>
                    </div>
                    {system.cpu.loadAvg && (
                      <div className="text-xs text-gray-500 mt-2">
                        Load: {system.cpu.loadAvg.map((l) => l.toFixed(2)).join(', ')}
                      </div>
                    )}
                    {system.cpu.model && <div className="text-xs text-gray-600 mt-1 truncate">{system.cpu.model}</div>}
                  </div>
                )}
              </div>

              {/* Disk Usage */}
              {system.disk.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Disk Usage</h4>
                  <div className="space-y-2">
                    {system.disk.map((disk) => {
                      const percent = parseInt(disk.usePercent, 10)
                      return (
                        <div key={disk.mount} className="bg-gray-950 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-mono">{disk.mount}</span>
                            <span className={`text-sm font-mono ${getHealthColor(percent)}`}>{disk.usePercent}</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-1">
                            <div
                              className={`h-full ${getHealthBg(percent)} transition-all`}
                              style={{ width: disk.usePercent }}
                            />
                          </div>
                          <div className="text-xs text-gray-500">
                            {disk.used} / {disk.size} ({disk.avail} available)
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Services */}
              {Object.keys(system.services).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Services</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(system.services).map(([service, status]) => (
                      <div key={service} className="bg-gray-950 rounded-lg p-3 flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${status === true || status === 'running' ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
