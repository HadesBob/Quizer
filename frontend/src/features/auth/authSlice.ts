import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from './authService';
import { type Session } from '@supabase/supabase-js';
import {type UserProfile } from './types';


interface AuthState {
  user: any | null;
  session: Session | null;
  isLoading: boolean;
  profile: UserProfile | null;
  error: string | null;
  successMessage: string |null,
}


const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  profile: null,
  error: null,
  successMessage: null,
};

const mapSupabaseError = (msg: string): string => {
  if (msg.includes('Invalid login credentials')) return 'Błędny e-mail lub hasło.';
  if (msg.includes('User already registered')) return 'Ten adres e-mail jest już zajęty.';
  if (msg.includes('Rate limit exceeded')) return 'Zbyt wiele prób. Spróbuj ponownie za chwilę.';
  if (msg.includes('Email not confirmed')) return 'Musisz najpierw potwierdzić swój adres e-mail.';
  return 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
};

export const loginUser = createAsyncThunk('auth/login', async ({ email, pass }: any, thunkAPI) => {
  try { return await authService.login(email, pass); }
  catch (err: any) { return thunkAPI.rejectWithValue(mapSupabaseError(err.message)); }
});

// Akcja asynchroniczna rejestracji
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, pass, username }: { email: string; pass: string; username: string }, { rejectWithValue }) => {
    try {
      return await authService.register(email, pass, username);
    } catch (err: any) {
      return rejectWithValue(mapSupabaseError(err.message));
    }
  }
);
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (userId: string, thunkAPI) => {
    try {
      return await authService.getProfile(userId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(mapSupabaseError(err.message));
    }
  }
);
export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try { await authService.logout(); }
  catch (err: any) { return thunkAPI.rejectWithValue(mapSupabaseError(err.message)); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
      state.user = action.payload?.user || null;
      state.isLoading = false;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.isLoading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.successMessage = "Zostałeś pomyślnie zalogowany";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.successMessage = "Zostałeś pomyślnie wylogowany";
      })
      .addCase(registerUser.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Supabase po rejestracji często wymaga potwierdzenia email, 
        // więc sesja może być jeszcze pusta.
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.successMessage = "Zostałeś pomyślnie zarejestrowany";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
      
      
  }
});

export const { setSession, clearMessages } = authSlice.actions;
export default authSlice.reducer;