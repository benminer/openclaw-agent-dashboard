import { useCallback, useEffect, useState } from 'react'
import { BackupCard } from '../components/BackupCard'

interface Backup {
  label: string
  date: string
  size: number
}

export function Dashboard() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [backing, setBacking] = useState(false)

  const fetchBackups = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch('/api/backups')
      if (!res.ok) throw new Error(`Failed to fetch backups: ${res.status}`)
      const data = await res.json()
      setBackups(data.backups ?? data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBackups()
  }, [fetchBackups])

  const triggerBackup = async () => {
    setBacking(true)
    try {
      const res = await fetch('/api/backup', { method: 'POST' })
      if (!res.ok) throw new Error(`Backup failed: ${res.status}`)
      await fetchBackups()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Backup failed')
    } finally {
      setBacking(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-100">Backups</h2>
          <p className="text-sm text-gray-500 mt-1">Workspace snapshots stored in Ampt Storage</p>
        </div>
        <button
          type="button"
          onClick={triggerBackup}
          disabled={backing}
          className="px-4 py-2 bg-jarvis-600 hover:bg-jarvis-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {backing ? 'Backing up...' : 'Backup Now'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-sm text-red-400 font-mono">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-jarvis-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : backups.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500">No backups found</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {backups.map((b) => (
            <BackupCard key={`${b.label}-${b.date}`} label={b.label} date={b.date} size={b.size} />
          ))}
        </div>
      )}
    </div>
  )
}
