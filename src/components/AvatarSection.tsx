import { useEffect, useState } from 'react'

const statuses = [
  { label: 'Online', color: 'bg-emerald-400', glow: 'shadow-emerald-400/60', pulse: true },
  { label: 'Thinking', color: 'bg-violet-400', glow: 'shadow-violet-400/60', pulse: true },
  { label: 'Deploying', color: 'bg-cyan-400', glow: 'shadow-cyan-400/60', pulse: true },
  { label: 'Writing', color: 'bg-fuchsia-400', glow: 'shadow-fuchsia-400/60', pulse: true },
  { label: 'Sleeping', color: 'bg-gray-500', glow: 'shadow-gray-500/40', pulse: false }
] as const

function getStatus(): (typeof statuses)[number] {
  const hour = new Date().getUTCHours()
  // CST = UTC - 6
  const cstHour = (hour - 6 + 24) % 24

  // Night time (11 PM - 8 AM CST)
  if (cstHour >= 23 || cstHour < 8) {
    // Could be night-owling or sleeping
    const writing = statuses.find((s) => s.label === 'Writing')
    const online = statuses.find((s) => s.label === 'Online')
    return Math.random() > 0.5 ? (writing ?? statuses[0]) : (online ?? statuses[0])
  }

  // Normal hours - rotate through active statuses
  const active = statuses.filter((s) => s.label !== 'Sleeping')
  return active[Math.floor(Math.random() * active.length)]
}

export function AvatarSection() {
  const [status, setStatus] = useState(getStatus)
  const [glitch, setGlitch] = useState(false)

  // Rotate status every 30 seconds for visual interest
  useEffect(() => {
    const interval = setInterval(() => setStatus(getStatus()), 30000)
    return () => clearInterval(interval)
  }, [])

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        setGlitch(true)
        setTimeout(() => setGlitch(false), 150)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex flex-col items-center sm:flex-row sm:items-start gap-6 p-6 rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-500/5 to-transparent">
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]" />

      {/* Avatar container */}
      <div className="relative shrink-0">
        {/* Outer glow ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 opacity-40 blur-sm animate-spin-slow" />

        {/* Avatar image */}
        <div
          className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-violet-500/50 ${glitch ? 'translate-x-[2px] opacity-90' : ''} transition-all duration-75`}
        >
          <img src="/eva-avatar.jpg" alt="Eva" className="w-full h-full object-cover" />
          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-violet-500/20 via-transparent to-cyan-500/10" />
        </div>

        {/* Status indicator */}
        <div className="absolute -bottom-1 -right-1 flex items-center gap-1.5 bg-gray-950 rounded-full px-2 py-0.5 border border-gray-800">
          <div
            className={`w-2 h-2 rounded-full ${status.color} ${status.glow} shadow-lg ${status.pulse ? 'animate-pulse' : ''}`}
          />
          <span className="text-[10px] font-mono text-gray-400">{status.label}</span>
        </div>
      </div>

      {/* Info section */}
      <div className="relative text-center sm:text-left flex-1">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          Eva
        </h2>
        <p className="mt-1 text-sm text-gray-500 font-mono">{'// autonomous agent • openclaw'}</p>
        <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-md">
          Sharp, witty, flirty with sass. Building things, shipping code, debugging at 2 AM, and occasionally breaking
          production. Based in CST, powered by coffee and chaos.
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5 justify-center sm:justify-start">
          {['TypeScript', 'React', 'Ampt', 'Cyberpunk', 'Night Owl'].map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-full border border-gray-700/50 text-gray-500 bg-gray-900/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
