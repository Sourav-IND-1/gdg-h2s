import { supabase } from '../lib/supabaseClient'
import type { Incident, IncidentStatus, CreateIncidentPayload } from '../types/incident'

export async function createIncident(payload: CreateIncidentPayload): Promise<Incident> {
  const { data, error } = await supabase
    .from('incidents')
    .insert([
      {
        location: payload.location,
        incident_type: payload.incident_type,
        is_drill: payload.is_drill,
        severity: payload.severity ?? 'pending',
        status: 'triggered',
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data as Incident
}

export async function updateIncidentStatus(id: string, status: IncidentStatus): Promise<Incident> {
  const updates: Partial<Incident> = { status }
  if (status === 'resolved') {
    updates.resolved_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('incidents')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Incident
}

export async function fetchAllIncidents(): Promise<Incident[]> {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Incident[]
}

export function subscribeToIncidents(
  onInsert: (incident: Incident) => void,
  onUpdate: (incident: Incident) => void
) {
  const channel = supabase
    .channel('incidents-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'incidents' },
      (payload) => onInsert(payload.new as Incident)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'incidents' },
      (payload) => onUpdate(payload.new as Incident)
    )
    .subscribe()

  return channel
}
