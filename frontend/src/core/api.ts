// core/api.ts
import { supabase } from './supabase'
import { RealtimeChannel, type RealtimePostgresChangesPayload } from '@supabase/supabase-js'



export const api = {
  get: async (table: string, filter?: Record<string, any>) => {
    let query = supabase.from(table).select('*')
    if (filter) {
      Object.entries(filter).forEach(([k, v]) => {
        query = query.eq(k, v)
      })
    }
    const { data, error } = await query
    if (error) throw error
    return data
  },

  insert: async (table: string, values: Record<string, any>) => {
    const { data, error } = await supabase.from(table).insert(values).select('*')
    if (error) throw error
    return data
  },

  rpc: async (fn: string, params?: Record<string, any>) => {
    const { data, error } = await supabase.rpc(fn, params)
    if (error) throw error
    return data
  },

  subscribe: (
    tableName: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ): RealtimeChannel => {
    return supabase
      .channel(`${tableName}-channel`)
      .on('postgres_changes', { schema: 'public', table: tableName, event: '*' }, callback)
      .subscribe()
  }
}
