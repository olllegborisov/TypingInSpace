import { useState } from 'react';

const TEXT = 'The quick brown fox jumps over the lazy dog.';

export function TypingGame() {
    const [input, setInput] = useState('');
    const [currentCount, setCurrentCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const handleCheckEnteredText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let currentValue = event.target.value
        let mathCount = 0;
        let mathError = 0;
        setInput(currentValue)
        for (let i = 0; i < Math.min(currentValue.length, TEXT.length); i++) {
            if (TEXT[i] == currentValue[i]) {
                mathCount++
            } else {
                mathError++
            }
            console.log(Math.min(currentValue.length, TEXT.length));
            
        }
        setCurrentCount(mathCount);
        setErrorCount(mathError)
    }
    

    

    return (
        <section>
        <h2>Тренировка печати</h2>
        <p>{TEXT}</p>
        <p>Правильных символов: {currentCount}</p>
        <p>Количество ошибок: {errorCount}</p>
        <textarea
            value={input}
            onChange={(event) => handleCheckEnteredText(event)}
            placeholder="Начни печатать этот текст..."
        />
        </section>
    );
}