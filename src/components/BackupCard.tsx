interface BackupCardProps {
  label: string
  date: string
  size: number
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(1)} ${units[i]}`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export function BackupCard({ label, date, size }: BackupCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-gray-100">{label}</h3>
          <p className="text-sm font-mono text-gray-400">{formatDate(date)}</p>
        </div>
        <span className="text-sm font-mono text-jarvis-400 bg-jarvis-500/10 px-2.5 py-1 rounded">
          {formatBytes(size)}
        </span>
      </div>
    </div>
  )
}
