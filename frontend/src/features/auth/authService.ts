import { supabase } from "../../lib/supabase";
import { type UserProfile } from "./types";

export const authService = {

async register(email: string, pass: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: {
        username: username // Zmieniamy klucz przesyłany do bazy
      }
    }
    })
  
  if (error) throw error;
  return data;
},

  // Logowanie
  login: async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    return data;
  },

  // Wylogowanie
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Pobranie aktualnej sesji
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  getProfile: async (userId: string): Promise<UserProfile> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as UserProfile;
  },

  // Dodajmy od razu funkcję do aktualizacji monet (przyda się później)
  updateCoins: async (userId: string, amount: number): Promise<void> => {
    const { error } = await supabase.rpc('increment_coins', { 
      user_id: userId, 
      amount: amount 
    });
    if (error) throw error;
  }

};