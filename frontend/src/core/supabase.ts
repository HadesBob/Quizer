import { createClient } from '@supabase/supabase-js';

// Pobieranie zmiennych z pliku .env (Vite używa prefiksu VITE_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Sprawdzenie, czy zmienne środowiskowe istnieją (zapobiega błędom w runtime)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Brakuje zmiennych środowiskowych dla Supabase. Sprawdź plik .env');
}

// Inicjalizacja klienta
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Automatyczne zapisywanie sesji w LocalStorage
    autoRefreshToken: true, // Automatyczne odświeżanie tokena (standard w profesjonalnych apkach)
    detectSessionInUrl: true, // Potrzebne do potwierdzania e-maili i logowania social
  }
});