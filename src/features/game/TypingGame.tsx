import { useState, useRef, useEffect } from 'react';
import styles from './TypingGamse.module.css'

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
            {/* Невидимый инпут для захвата ввода */}
            <input
                ref={inputRef}
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={styles.input}
            />

            {/* Визуальное отображение текста с бегунком */}
            <div className={styles.text}>
                {targetText.slice(0, input.length).split('').map((char, index) => {
                    const isCorrect = input[index] === char;
                    return (
                        <span key={index} className={isCorrect ? styles.correct :  styles.error}>
                            {char}
                        </span>
                    );
                })}
                {/* Бегунок (каретка) */}
                <span className={styles.caret}/>
                {targetText.slice(input.length).split('').map((char, index) => {
                    return (
                        <span key={index + input.length} style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                            {char}
                        </span>
                    );
                })}

            </div>

            {/* Статистика */}
            <p style={{ marginTop: '20px', color: 'white' }}>
                Введено: {input.length} / {targetText.length}
            </p>
        </section>
    );
}