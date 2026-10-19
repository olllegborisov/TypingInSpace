
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export function AuthForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [message, setMessage] = useState('');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage('');

        const result =
        mode === 'signup'
            ? await supabase.auth.signUp({ email, password })
            : await supabase.auth.signInWithPassword({ email, password });

        if (result.error) {
        setMessage(result.error.message);
        return;
        }

        setMessage(
        mode === 'signup'
            ? 'Регистрация отправлена. Проверь почту, если требуется подтверждение.'
            : 'Вход выполнен.'
        );
    }

    return (
        <section>
        <h1>{mode === 'login' ? 'Вход' : 'Регистрация'}</h1>

        <form onSubmit={handleSubmit}>
            <label>
            Email
            <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
            />
            </label>

            <label>
            Пароль
            <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
            />
            </label>

            <button type="submit">
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
        </form>

        <button
            type="button"
            onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setMessage('');
            }}
        >
            {mode === 'login' ? 'Создать аккаунт' : 'Уже есть аккаунт? Войти'}
        </button>

        {message && <p role="status">{message}</p>}
        </section>
    );
}
