
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { AuthForm } from './features/auth/AuthForm';
import { saveAttempt, getAttempts } from './features/statistics/attempts';
import { TypingGame } from './features/game/TypingGame';
import MagentaCanvas from './features/canvas/canvas';


function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [attempts, setAttempts] = useState<
    Awaited<ReturnType<typeof getAttempts>>
  >([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  useEffect(() => {The
    if (!session) {
      setAttempts([]);
      return;
    }

    async function loadAttempts() {
      try {
        const data = await getAttempts();
        setAttempts(data);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : 'Ошибка загрузки истории'
        );
      }
    }

    loadAttempts();
  }, [session]);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Ошибка выхода:', error.message);
    }
  }

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (!session) {
    return <AuthForm />;
  }

  return (
    <main>
      <div className='wrapper'>
        <h1>Typing in space</h1>
        <p>Вы вошли как: {session.user.email}</p>
        <button onClick={handleSignOut}>Выйти</button>
        <TypingGame />
        <MagentaCanvas />
        <button
          onClick={async () => {
            try {
              await saveAttempt({
                duration_seconds: 60,
                correct_count: 120,
                error_count: 8,
              });

              const data = await getAttempts();
              setAttempts(data);
              setMessage('Результат сохранён');
            } catch (error) {
              setMessage(
                error instanceof Error ? error.message : 'Произошла ошибка'
              );
            }
          }}
        >
          Добавить тестовый результат
        </button>

        <p>{message}</p>

        <ul>
          {attempts.map((attempt) => (
            <li key={attempt.id}>
              {new Date(attempt.played_at).toLocaleString()} — верно:
              {' '}{attempt.correct_count}, ошибок: {attempt.error_count}
            </li>
          ))}
        </ul>
      </ div>
    </main>
  );
}

export default App;
