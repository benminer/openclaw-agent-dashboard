import { Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-jarvis-500 animate-pulse" />
          <h1 className="text-lg font-semibold tracking-tight text-gray-100">Jarvis Control Center</h1>
          <span className="text-xs font-mono text-gray-500 ml-2">BACKUP SERVICE</span>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs text-gray-600 font-mono">openclaw-backup-service v1.0.0</p>
        </div>
      </footer>
    </div>
  )
}
