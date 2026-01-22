// src/features/auth/types.ts

export interface UserProfile {
  id: string;               // UUID z Supabase
  username: string | null;  // Nick gracza lub email
  avatar_url: string | null;
  coins: number;            // Domyślnie 1000
  total_questions: number;  // Statystyki
  correct_answers: number;  // Statystyki
  updated_at?: string;
}

// Dodatkowo możemy zdefiniować typ stanu, który używamy w Slice
import {type Session, type User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}