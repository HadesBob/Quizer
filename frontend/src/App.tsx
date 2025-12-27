import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import type { Session } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Pobierz aktualną sesję
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Słuchaj zmian w auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="container">
      {!session ? (
        <Auth />
      ) : (
        <div>
          <h1>Witaj, {session.user.email}</h1>
          <button onClick={() => supabase.auth.signOut()}>Wyloguj</button>
        </div>
      )}
    </div>
  );
}

export default App;