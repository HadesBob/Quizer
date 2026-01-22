import { supabase } from './supabase'
import { RealtimeChannel, type RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export const initSocketChannel = (
  channelName: string,
  tableName: string,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
): RealtimeChannel => {

  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tableName
      },
      (payload) => {
        callback(payload)
      }
    )
    .subscribe()

  return channel
}