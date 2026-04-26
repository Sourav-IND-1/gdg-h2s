import { useState } from 'react'
import toast from 'react-hot-toast'
import { createIncident } from '../services/incidentService'
import { INCIDENT_TYPES, HOTEL_LOCATIONS } from '../types/incident'

type Step = 'select' | 'confirm' | 'success'

export default function GuestSOSPage() {
  const [step, setStep] = useState<Step>('select')
  const [location, setLocation] = useState('')
  const [incidentType, setIncidentType] = useState('')
  const [isDrill, setIsDrill] = useState(false)
  const [loading, setLoading] = useState(false)
  const [incidentId, setIncidentId] = useState<string | null>(null)

  const canTrigger = location !== '' && incidentType !== ''

  const handleSOSTrigger = () => {
    if (!canTrigger) {
      toast.error('Please select a location and incident type first.')
      return
    }
    setStep('confirm')
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const incident = await createIncident({
        location,
        incident_type: incidentType,
        is_drill: isDrill,
      })
      setIncidentId(incident.id)
      setStep('success')
      toast.success(isDrill ? 'Drill SOS sent!' : '🚨 Emergency alert dispatched!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to send SOS. Please try again or call the front desk.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep('select')
    setLocation('')
    setIncidentType('')
    setIsDrill(false)
    setIncidentId(null)
  }

  const selectedType = INCIDENT_TYPES.find((t) => t.id === incidentType)

  if (step === 'success') {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="w-28 h-28 rounded-full bg-green-900/40 border-2 border-green-500 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <span className="text-5xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold text-green-400 mb-2">Alert Dispatched</h1>
          <p className="text-slate-300 mb-2">
            {isDrill
              ? 'Drill alert sent. Staff have been notified.'
              : 'Emergency services have been notified. Help is on the way.'}
          </p>
          {incidentId && (
            <p className="text-xs text-slate-500 font-mono mb-8">
              Incident ID: {incidentId.slice(0, 8).toUpperCase()}
            </p>
          )}
          <div className="bg-slate-800 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedType?.emoji}</span>
              <div>
                <p className="text-slate-400 text-xs">Incident Type</p>
                <p className="text-white font-semibold">{selectedType?.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-slate-400 text-xs">Location</p>
                <p className="text-white font-semibold">{location}</p>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            <strong className="text-white">Stay calm</strong> and remain in your location if safe to do so.
            If in immediate danger, move to the nearest safe exit.
          </p>
          <button
            onClick={handleReset}
            className="text-slate-500 text-sm hover:text-slate-300 transition-colors underline underline-offset-2"
          >
            Send another alert
          </button>
        </div>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {isDrill && (
            <div className="mb-4 bg-amber-900/40 border border-amber-600 rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-amber-400 font-bold text-sm">⚠️ DRILL MODE — This is a test</span>
            </div>
          )}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-4">
            <h2 className="text-xl font-bold text-white mb-1">Confirm Emergency Alert</h2>
            <p className="text-slate-400 text-sm mb-6">
              This will immediately dispatch an alert to all available staff. Confirm only if this is a real emergency.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 bg-slate-900 rounded-xl p-3">
                <span className="text-3xl">{selectedType?.emoji}</span>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider">Type</p>
                  <p className="text-white font-semibold">{selectedType?.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-900 rounded-xl p-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider">Location</p>
                  <p className="text-white font-semibold">{location}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-xl text-white transition-all ${
                isDrill
                  ? 'bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800'
                  : 'bg-red-600 hover:bg-red-500 disabled:bg-red-900 sos-glow'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loading
                ? '⏳ Dispatching...'
                : isDrill
                ? '⚠️ Send Drill Alert'
                : '🚨 CONFIRM — Send SOS'}
            </button>
          </div>
          <button
            onClick={() => setStep('select')}
            className="w-full py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all font-medium"
          >
            ← Cancel
          </button>
        </div>
      </div>
    )
  }

  // Step: select
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col">
      {/* Hero Banner */}
      <div className={`${isDrill ? 'bg-amber-900' : 'bg-red-950'} border-b ${isDrill ? 'border-amber-700' : 'border-red-900'} transition-colors`}>
        <div className="max-w-lg mx-auto px-4 py-6 text-center">
          {isDrill ? (
            <p className="text-amber-300 font-bold text-sm tracking-widest uppercase animate-pulse">
              ⚠️ DRILL MODE ACTIVE — For Testing Only
            </p>
          ) : (
            <p className="text-red-200 text-sm font-medium">
              🏨 Hotel Emergency System — Available 24 hours a day
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-lg mx-auto w-full">
        {/* SOS Button */}
        <div className="relative flex items-center justify-center mb-10">
          {/* Ripple rings */}
          {!isDrill && (
            <>
              <div className="absolute w-48 h-48 rounded-full border-2 border-red-600/30 ripple-ring" />
              <div className="absolute w-48 h-48 rounded-full border-2 border-red-600/20 ripple-ring-2" />
              <div className="absolute w-48 h-48 rounded-full border-2 border-red-600/10 ripple-ring-3" />
            </>
          )}
          <button
            onClick={handleSOSTrigger}
            className={`relative w-44 h-44 rounded-full font-black text-4xl text-white transition-all duration-200 select-none active:scale-95 ${
              isDrill
                ? 'bg-amber-600 border-4 border-amber-400'
                : 'bg-red-600 border-4 border-red-400 sos-glow hover:bg-red-500 hover:scale-105'
            } ${!canTrigger ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-1">{isDrill ? '⚠️' : '🆘'}</span>
              <span className="text-2xl font-black tracking-widest">{isDrill ? 'DRILL' : 'SOS'}</span>
              <span className="text-xs font-medium opacity-80 mt-0.5">PRESS TO ALERT</span>
            </div>
          </button>
        </div>

        {/* Step 1: Location */}
        <div className="w-full mb-6">
          <label className="block text-slate-300 text-sm font-semibold mb-2 uppercase tracking-wider">
            📍 Step 1 — Your Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 text-base focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all appearance-none"
          >
            <option value="">Select your location...</option>
            {HOTEL_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Step 2: Incident Type */}
        <div className="w-full mb-8">
          <label className="block text-slate-300 text-sm font-semibold mb-2 uppercase tracking-wider">
            ⚡ Step 2 — Type of Emergency
          </label>
          <div className="grid grid-cols-3 gap-2">
            {INCIDENT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setIncidentType(type.id)}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                  incidentType === type.id
                    ? `${type.bg} scale-105`
                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                }`}
              >
                <span className="text-2xl">{type.emoji}</span>
                <span className={`text-xs font-semibold ${incidentType === type.id ? type.color : 'text-slate-400'}`}>
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Drill toggle */}
        <div className="w-full border-t border-slate-800 pt-5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={isDrill}
                onChange={(e) => setIsDrill(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full transition-colors ${isDrill ? 'bg-amber-600' : 'bg-slate-700'}`}
              />
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isDrill ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </div>
            <div>
              <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">
                Drill / Test Mode
              </span>
              <p className="text-slate-500 text-xs">Alert staff this is a practice run</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
