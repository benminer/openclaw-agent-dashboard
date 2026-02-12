import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const statuses = [
  { label: 'Online', color: 'bg-emerald-400', glow: 'shadow-emerald-400/60', pulse: true },
  { label: 'Thinking', color: 'bg-violet-400', glow: 'shadow-violet-400/60', pulse: true },
  { label: 'Deploying', color: 'bg-cyan-400', glow: 'shadow-cyan-400/60', pulse: true },
  { label: 'Writing', color: 'bg-fuchsia-400', glow: 'shadow-fuchsia-400/60', pulse: true },
  { label: 'Sleeping', color: 'bg-gray-500', glow: 'shadow-gray-500/40', pulse: false }
] as const

function getStatus(): (typeof statuses)[number] {
  const hour = new Date().getUTCHours()
  const cstHour = (hour - 6 + 24) % 24

  if (cstHour >= 23 || cstHour < 8) {
    const writing = statuses.find((s) => s.label === 'Writing')
    const online = statuses.find((s) => s.label === 'Online')
    return Math.random() > 0.5 ? (writing ?? statuses[0]) : (online ?? statuses[0])
  }

  const active = statuses.filter((s) => s.label !== 'Sleeping')
  return active[Math.floor(Math.random() * active.length)]
}

export function ProfileHero() {
  const [status, setStatus] = useState(getStatus())
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setStatus(getStatus()), 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        setGlitch(true)
        setTimeout(() => setGlitch(false), 150)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const navButtons = [
    { label: 'Dashboard', to: '/' },
    { label: 'Sessions', to: '/sessions' },
    { label: 'Health', to: '/health' },
    { label: 'Activity', to: '/activity' }
  ]

  return (
    <div className="relative flex flex-col items-center lg:flex-row lg:items-start gap-8 p-8 lg:p-12 rounded-3xl border border-violet-500/30 bg-gradient-to-b from-violet-900/20 via-transparent to-gray-950/50 backdrop-blur-sm">
      {/* Scanline */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.04] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(138,43,226,0.15)_2px,rgba(138,43,226,0.15)_4px)]" />

      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 opacity-30 blur-lg animate-pulse-slow" />
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400/20 via-violet-400/20 to-fuchsia-400/20 animate-spin-slow" />
        <div
          className={`relative w-40 h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-violet-500/60 shadow-2xl shadow-violet-500/25 transition-all duration-200 ${glitch ? 'scale-[0.98] rotate-1 opacity-95' : ''}`}
        >
          <img src="/eva-avatar.jpg" alt="Eva" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-violet-500/30 via-transparent to-cyan-500/20 animate-gradient-xy" />
        </div>

        {/* Status */}
        <div className="absolute -bottom-2 -right-2 flex items-center gap-2 bg-gray-950/90 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-800/50 shadow-2xl">
          <div
            className={`w-3.5 h-3.5 rounded-full ${status.color} ${status.glow} shadow-xl ${status.pulse ? 'animate-pulse' : ''}`}
          />
          <span className="text-sm font-mono text-gray-300">{status.label}</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 text-center lg:text-left">
        <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-400 via-white to-fuchsia-400 bg-clip-text text-transparent mb-4 animate-fade-in-up">
          Eva
        </h1>
        <p className="text-lg text-gray-400 font-mono mb-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
          Sharp, witty, flirty with sass. Building things, shipping code, debugging at 2 AM, and occasionally breaking
          production.
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
          {['TypeScript', 'React', 'Cyberpunk', 'Night Owl', 'OpenClaw'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 transition-all glow-subtle"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Nav buttons */}
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          {navButtons.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-mono text-sm rounded-xl border border-violet-500/50 shadow-lg hover:shadow-xl hover:shadow-violet-500/25 transition-all duration-200 glow-hover"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
