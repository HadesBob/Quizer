import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Brak kluczy Supabase w pliku .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Zapewnia zapisywanie sesji w localStorage
    autoRefreshToken: true, // Automatycznie odświeża tokeny
    detectSessionInUrl: true // Kluczowe dla linków potwierdzających e-mail
  }
});