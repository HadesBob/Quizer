import { configureStore } from '@reduxjs/toolkit';
import {type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Importy reducerów
import authReducer from '../features/auth/authSlice'; // Zakładam taką ścieżkę dla Twojego istniejącego auth
import lobbyReducer from '../features/lobby/lobby.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lobby: lobbyReducer,
  },
  // Middleware dodawany automatycznie przez RTK (Thunk jest w standardzie)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorujemy sprawdzanie serializacji dla specyficznych obiektów Supabase, 
        // jeśli zajdzie taka potrzeba w przyszłości
        ignoredActions: [],
      },
    }),
});

// Typy dla całego stanu i dispatcha
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Customowe hooki - używaj ich zamiast zwykłego useDispatch/useSelector dla pełnego typowania
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;