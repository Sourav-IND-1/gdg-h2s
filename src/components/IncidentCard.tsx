import { useState } from 'react'
import toast from 'react-hot-toast'
import type { Incident } from '../types/incident'
import { STATUS_CONFIG, INCIDENT_TYPES } from '../types/incident'
import { updateIncidentStatus } from '../services/incidentService'

interface Props {
  incident: Incident
  onUpdated: (incident: Incident) => void
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function IncidentCard({ incident, onUpdated }: Props) {
  const [loading, setLoading] = useState(false)
  const statusCfg = STATUS_CONFIG[incident.status]
  const typeCfg = INCIDENT_TYPES.find((t) => t.id === incident.incident_type)

  const handleAction = async (newStatus: 'acknowledged' | 'resolved') => {
    setLoading(true)
    try {
      const updated = await updateIncidentStatus(incident.id, newStatus)
      onUpdated(updated)
      toast.success(
        newStatus === 'acknowledged'
          ? '✅ Incident acknowledged'
          : '🟢 Incident resolved'
      )
    } catch {
      toast.error('Failed to update status.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-300 ${
        incident.is_drill
          ? 'bg-amber-950/30 border-amber-700/50'
          : incident.status === 'triggered'
          ? 'bg-red-950/30 border-red-800/60 shadow-lg shadow-red-950/20'
          : incident.status === 'acknowledged'
          ? 'bg-slate-800/80 border-slate-700'
          : 'bg-slate-900/50 border-slate-800 opacity-75'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          {/* Animated dot for triggered */}
          <div className="relative flex-shrink-0">
            <div className={`w-3 h-3 rounded-full ${statusCfg.dot}`} />
            {incident.status === 'triggered' && (
              <div className={`absolute inset-0 w-3 h-3 rounded-full ${statusCfg.dot} animate-ping`} />
            )}
          </div>
          <span className={`text-xs font-bold tracking-widest px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
            {statusCfg.label}
          </span>
          {incident.is_drill && (
            <span className="text-xs font-bold text-amber-400 bg-amber-900/50 border border-amber-700 px-2 py-0.5 rounded-full">
              DRILL
            </span>
          )}
        </div>
        <span className="text-slate-500 text-xs flex-shrink-0">{timeAgo(incident.created_at)}</span>
      </div>

      {/* Main info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl flex-shrink-0">
          {typeCfg?.emoji ?? '⚠️'}
        </div>
        <div>
          <h3 className="text-white font-bold text-base leading-tight">
            {typeCfg?.label ?? incident.incident_type}
          </h3>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            <span>📍</span> {incident.location}
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
        <span>ID: {incident.id.slice(0, 8).toUpperCase()}</span>
        {incident.resolved_at && (
          <span>• Resolved: {timeAgo(incident.resolved_at)}</span>
        )}
      </div>

      {/* Actions */}
      {incident.status === 'triggered' && (
        <button
          onClick={() => handleAction('acknowledged')}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-sm transition-all"
        >
          {loading ? '⏳ Updating...' : '👋 Acknowledge'}
        </button>
      )}
      {incident.status === 'acknowledged' && (
        <button
          onClick={() => handleAction('resolved')}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-semibold text-sm transition-all"
        >
          {loading ? '⏳ Updating...' : '✅ Mark as Resolved'}
        </button>
      )}
      {incident.status === 'resolved' && (
        <div className="text-center text-green-500 text-sm font-medium">
          ✅ Incident closed
        </div>
      )}
    </div>
  )
}
