import { useCallback, useEffect, useState } from 'react'
import { AboutSection } from '../components/AboutSection'
import { ActivityStats } from '../components/ActivityStats'
import { PersonalityTraits } from '../components/PersonalityTraits'
import { ProfileHero } from '../components/ProfileHero'
import { SkillsSection } from '../components/SkillsSection'
import type { Backup } from '../lib/api'

interface HealthSummary {
  uptime: string
  memoryUsedPercent: number
  cpuCores: number
}

interface StatsData {
  backups: Backup[]
  sessionCount: number
  recentActivityCount: number
  health?: HealthSummary
}

export function Profile() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [backupsRes, sessionsRes, activityRes, healthRes] = await Promise.all([
        fetch('/api/backups'),
        fetch('/api/sessions'),
        fetch('/api/activity/events?limit=50'),
        fetch('/api/health/systems')
      ])

      const backupsData = await backupsRes.json()
      const backups: Backup[] = backupsData.backups || backupsData || []

      const sessions = (await sessionsRes.json()) || []
      const activityData = (await activityRes.json()) || { events: [] }
      const systems = (await healthRes.json()) || []

      // Recent activity (last 24h)
      const now = Date.now()
      const dayAgo = now - 24 * 60 * 60 * 1000
      const recentEvents = activityData.events?.filter((e: any) => new Date(e.ts).getTime() >= dayAgo) || []
      const recentActivityCount = recentEvents.length

      // Health summary (first system)
      const sys = systems[0]
      const health: HealthSummary | undefined = sys
        ? {
            uptime: `${Math.floor(sys.uptime / 3600)}h ${Math.floor((sys.uptime % 3600) / 60)}m`,
            memoryUsedPercent: sys.memory?.usedPercent || 0,
            cpuCores: sys.cpu?.cores || 0
          }
        : undefined

      setData({
        backups,
        sessionCount: Array.isArray(sessions) ? sessions.length : 0,
        recentActivityCount,
        health
      })
    } catch (error) {
      console.error('Failed to load profile stats:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000) // Auto refresh
    return () => clearInterval(interval)
  }, [loadData])

  const refresh = () => {
    loadData()
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-12">
      <ProfileHero />

      <AboutSection />
      <PersonalityTraits />
      <SkillsSection />

      <div className="pt-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Live Stats</h1>
          <button
            type="button"
            onClick={refresh}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Refresh {refreshKey}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mr-4" />
            <span className="text-gray-400 font-mono">Loading stats...</span>
          </div>
        ) : data ? (
          <ActivityStats {...data} />
        ) : (
          <div className="text-center py-24 text-gray-500">Stats unavailable</div>
        )}
      </div>
    </div>
  )
}
