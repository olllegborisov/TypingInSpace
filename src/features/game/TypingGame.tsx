import { useState } from 'react';

const TEXT = 'The quick brown fox jumps over the lazy dog.';

export function TypingGame() {
    const [input, setInput] = useState('');

    return (
        <section>
        <h2>Тренировка печати</h2>
        <p>{TEXT}</p>

        <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Начни печатать этот текст..."
        />
        </section>
    );
}