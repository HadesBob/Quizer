import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import { setSession, fetchProfile } from './features/auth/authSlice';
import { supabase } from './lib/supabase';
import { router } from './app/router';


function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 1. Sprawdź bieżącą sesję przy starcie aplikacji
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
      if (session?.user) {
        dispatch(fetchProfile(session.user.id));
      }
    });

    // 2. Subskrybuj zmiany stanu (Login, Logout, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
      if (session?.user) {
        dispatch(fetchProfile(session.user.id));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  // Renderujemy RouterProvider, który zarządza całą nawigacją
  return <RouterProvider router={router} />;
}

export default App;