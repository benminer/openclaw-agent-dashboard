import type { Backup } from '../lib/api'
import { timeAgo } from '../lib/format'

interface Props {
  backups: Backup[]
  sessionCount: number
  recentActivityCount: number
  health?: {
    uptime: string
    memoryUsedPercent: number
    cpuCores: number
  }
}

export function ActivityStats({ backups, sessionCount, recentActivityCount, health }: Props) {
  const latestBackup = backups[0]
  const backupCount = backups.length

  return (
    <section className="space-y-6 p-8 lg:p-12 rounded-3xl border border-gray-800/50 bg-gradient-to-b from-cyan-900/20 to-transparent backdrop-blur-md animate-fade-in-up [animation-delay:600ms]">
      <div>
        <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-8 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center text-lg">
            04
          </span>
          Live Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Backups */}
          <div className="group p-8 rounded-2xl border border-gray-800/50 bg-gray-950/50 backdrop-blur-sm hover:border-violet-500/60 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-xl">
                <svg
                  role="img"
                  aria-label="Backups icon"
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-100 mb-2 text-center">{backupCount}</h3>
              <p className="text-sm text-gray-500 uppercase tracking-wider text-center mb-4">Backups</p>
              {latestBackup && (
                <p className="text-xs text-gray-400 font-mono text-center">
                  Latest: {timeAgo(latestBackup.lastModified)}
                </p>
              )}
            </div>
          </div>

          {/* Sessions */}
          <div className="group p-8 rounded-2xl border border-gray-800/50 bg-gray-950/50 backdrop-blur-sm hover:border-emerald-500/60 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-xl">
                <svg
                  role="img"
                  aria-label="Sessions icon"
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-100 mb-2 text-center">{sessionCount}</h3>
              <p className="text-sm text-gray-500 uppercase tracking-wider text-center mb-4">Active Sessions</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="group p-8 rounded-2xl border border-gray-800/50 bg-gray-950/50 backdrop-blur-sm hover:border-fuchsia-500/60 hover:shadow-2xl hover:shadow-fuchsia-500/20 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-xl">
                <svg
                  role="img"
                  aria-label="Activity icon"
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-100 mb-2 text-center">{recentActivityCount}</h3>
              <p className="text-sm text-gray-500 uppercase tracking-wider text-center mb-4">Recent Events</p>
            </div>
          </div>

          {/* Health */}
          {health && (
            <div className="group p-8 rounded-2xl border border-gray-800/50 bg-gray-950/50 backdrop-blur-sm hover:border-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-xl">
                  <svg
                    role="img"
                    aria-label="Health icon"
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-100 mb-2 text-center">
                  {health.memoryUsedPercent.toFixed(0)}%
                </h3>
                <p className="text-sm text-gray-500 uppercase tracking-wider text-center mb-1">Memory</p>
                <p className="text-xs text-gray-400 font-mono text-center">Uptime: {health.uptime}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
