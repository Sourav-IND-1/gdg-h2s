import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import type { Incident } from '../types/incident'
import { fetchAllIncidents, subscribeToIncidents } from '../services/incidentService'
import IncidentCard from '../components/IncidentCard'

type FilterTab = 'all' | 'active' | 'resolved'

export default function StaffDashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterTab>('all')
  const [error, setError] = useState<string | null>(null)

  const loadIncidents = useCallback(async () => {
    try {
      const data = await fetchAllIncidents()
      setIncidents(data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch incidents. Check your Supabase connection.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadIncidents()

    const channel = subscribeToIncidents(
      (newIncident) => {
        setIncidents((prev) => [newIncident, ...prev])
        if (!newIncident.is_drill) {
          toast.error(`🚨 NEW ALERT: ${newIncident.incident_type.toUpperCase()} at ${newIncident.location}`, {
            duration: 6000,
            style: {
              background: '#7f1d1d',
              border: '1px solid #dc2626',
              color: '#fef2f2',
              fontWeight: '600',
            },
          })
        } else {
          toast(`⚠️ DRILL: ${newIncident.incident_type} at ${newIncident.location}`, {
            duration: 5000,
            style: {
              background: '#78350f',
              border: '1px solid #d97706',
              color: '#fefce8',
            },
          })
        }
      },
      (updatedIncident) => {
        setIncidents((prev) =>
          prev.map((inc) => (inc.id === updatedIncident.id ? updatedIncident : inc))
        )
      }
    )

    return () => {
      channel.unsubscribe()
    }
  }, [loadIncidents])

  const handleUpdated = (updated: Incident) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === updated.id ? updated : inc))
    )
  }

  const triggered = incidents.filter((i) => i.status === 'triggered')
  const acknowledged = incidents.filter((i) => i.status === 'acknowledged')
  const resolved = incidents.filter((i) => i.status === 'resolved')
  const active = [...triggered, ...acknowledged]

  const filteredIncidents =
    filter === 'all'
      ? incidents
      : filter === 'active'
      ? active
      : resolved

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Incident Dashboard</h1>
              <p className="text-slate-400 text-sm mt-0.5">Real-time emergency response management</p>
            </div>
            {/* Live indicator */}
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-400">LIVE</span>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-red-950/50 border border-red-800/60 rounded-xl p-3 text-center">
              <p className="text-3xl font-black text-red-400">{triggered.length}</p>
              <p className="text-red-300/70 text-xs font-medium uppercase tracking-wider mt-0.5">Triggered</p>
            </div>
            <div className="bg-amber-950/50 border border-amber-800/60 rounded-xl p-3 text-center">
              <p className="text-3xl font-black text-amber-400">{acknowledged.length}</p>
              <p className="text-amber-300/70 text-xs font-medium uppercase tracking-wider mt-0.5">In Progress</p>
            </div>
            <div className="bg-green-950/50 border border-green-800/60 rounded-xl p-3 text-center">
              <p className="text-3xl font-black text-green-400">{resolved.length}</p>
              <p className="text-green-300/70 text-xs font-medium uppercase tracking-wider mt-0.5">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'active', 'resolved'] as FilterTab[]).map((tab) => {
            const count =
              tab === 'all' ? incidents.length : tab === 'active' ? active.length : resolved.length
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  filter === tab
                    ? 'bg-white text-slate-900'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    filter === tab ? 'bg-slate-200 text-slate-800' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-950 border border-red-700 rounded-2xl p-4 mb-6 text-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-2 border-slate-600 border-t-red-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Connecting to live feed...</p>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">
              {filter === 'resolved' ? '✅' : '🟢'}
            </span>
            <p className="text-slate-400 font-semibold">
              {filter === 'resolved' ? 'No resolved incidents yet' : 'No active incidents'}
            </p>
            <p className="text-slate-600 text-sm mt-1">
              {filter !== 'resolved' && 'All clear — new alerts will appear here instantly'}
            </p>
          </div>
        ) : (
          <>
            {/* Priority alert for triggered */}
            {filter !== 'resolved' && triggered.length > 0 && filter === 'all' && (
              <div className="bg-red-950/40 border border-red-700 rounded-2xl p-3 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping flex-shrink-0" />
                <p className="text-red-300 text-sm font-semibold">
                  {triggered.length} incident{triggered.length > 1 ? 's' : ''} awaiting acknowledgement
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredIncidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onUpdated={handleUpdated}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
