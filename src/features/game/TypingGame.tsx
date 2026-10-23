import { useState, useRef, useEffect } from 'react';

const targetText: string = 'The quick brown fox jumps over the lazy dog.';

export function TypingGame() {
    const [input, setInput] = useState('');
    const [currentCount, setCurrentCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    //     // Автофокус при клике в любом месте
    // useEffect(() => {
    //     const handleClick = () => inputRef.current?.focus();
    //     document.addEventListener('click', handleClick);
    //     return () => document.removeEventListener('click', handleClick);
    // }, []);


    const handleCheckEnteredText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let currentValue = event.target.value
        let mathCount = 0;
        let mathError = 0;
        setInput(currentValue)
        for (let i = 0; i < Math.min(currentValue.length, targetText.length); i++) {
            if (targetText[i] == currentValue[i]) {
                mathCount++
            } else {
                mathError++
            }
        }
        setCurrentCount(mathCount);
        setErrorCount(mathError)
    }
    
    useEffect(() => {
        const handleClick = () => inputRef.current?.focus();
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    

        return (
        <section style={{ position: 'relative', zIndex: 10, padding: '40px' }}>
            <h2>Тренировка печати</h2>
            
            {/* 1. Невидимый инпут для захвата ввода */}
            <input
                ref={inputRef}
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                    position: 'absolute',
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    cursor: 'default'
                }}
            />

            {/* 2. Визуальное отображение текста с бегунком */}
            <div style={{ 
                fontSize: '24px', 
                fontFamily: 'monospace',
                lineHeight: '1.6',
                userSelect: 'none', // Запрещаем выделение текста
            }}>
                {targetText.slice(0, input.length).split('').map((char, index) => {
                    const isCorrect = input[index] === char;
                    return (
                        <span key={index} style={{ color: isCorrect ? '#4ade80' : '#f87171' }}>
                            {char}
                        </span>
                    );
                })}
                {/* 3. Бегунок (каретка) */}
                <span style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '1.2em',
                    backgroundColor: 'white',
                    verticalAlign: 'text-bottom',
                    animation: 'blink 1s step-end infinite'
                }} />
                {targetText.slice(input.length).split('').map((char, index) => {
                    // Важно: key = index + input.length, чтобы ключи не дублировались с первой частью
                    return (
                        <span key={index + input.length} style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                            {char}
                        </span>
                    );
                })}

            </div>

            {/* 4. Статистика */}
            <p style={{ marginTop: '20px', color: 'white' }}>
                Введено: {input.length} / {targetText.length}
            </p>
        </section>
    );
}