export type IncidentStatus = 'triggered' | 'acknowledged' | 'resolved'

export interface Incident {
  id: string
  created_at: string
  location: string
  status: IncidentStatus
  is_drill: boolean
  incident_type: string
  severity: string
  ai_raw_log: Record<string, unknown> | null
  responder_id: string | null
  resolved_at: string | null
}

export interface CreateIncidentPayload {
  location: string
  incident_type: string
  is_drill: boolean
  severity?: string
}

export const INCIDENT_TYPES = [
  { id: 'medical', label: 'Medical', emoji: '🚑', color: 'text-red-400', bg: 'bg-red-950 border-red-700' },
  { id: 'fire', label: 'Fire', emoji: '🔥', color: 'text-orange-400', bg: 'bg-orange-950 border-orange-700' },
  { id: 'security', label: 'Security', emoji: '🚨', color: 'text-purple-400', bg: 'bg-purple-950 border-purple-700' },
  { id: 'maintenance', label: 'Maintenance', emoji: '⚙️', color: 'text-blue-400', bg: 'bg-blue-950 border-blue-700' },
  { id: 'evacuation', label: 'Evacuation', emoji: '🚪', color: 'text-yellow-400', bg: 'bg-yellow-950 border-yellow-700' },
  { id: 'other', label: 'Other', emoji: '⚠️', color: 'text-slate-400', bg: 'bg-slate-800 border-slate-600' },
]

export const HOTEL_LOCATIONS = [
  'Lobby',
  'Front Desk',
  'Restaurant / Dining',
  'Pool Area',
  'Gym / Fitness Center',
  'Spa',
  'Parking Garage',
  'Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105',
  'Room 201', 'Room 202', 'Room 203', 'Room 204', 'Room 205',
  'Room 301', 'Room 302', 'Room 303', 'Room 304', 'Room 305',
  'Room 401', 'Room 402', 'Room 403', 'Room 404', 'Room 405',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Elevator / Lift',
  'Stairwell',
  'Housekeeping Area',
  'Kitchen / Back-of-House',
  'Loading Bay',
  'Outdoor Grounds',
  'Other',
]

export const STATUS_CONFIG: Record<IncidentStatus, { label: string; color: string; bg: string; dot: string }> = {
  triggered: {
    label: 'TRIGGERED',
    color: 'text-red-300',
    bg: 'bg-red-900/50 border border-red-600',
    dot: 'bg-red-500',
  },
  acknowledged: {
    label: 'ACKNOWLEDGED',
    color: 'text-amber-300',
    bg: 'bg-amber-900/50 border border-amber-600',
    dot: 'bg-amber-500',
  },
  resolved: {
    label: 'RESOLVED',
    color: 'text-green-300',
    bg: 'bg-green-900/50 border border-green-600',
    dot: 'bg-green-500',
  },
}
