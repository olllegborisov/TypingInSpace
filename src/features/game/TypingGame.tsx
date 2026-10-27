import { useState, useRef, useEffect } from 'react';
import { HiddenInput } from './HiddenInput';
import styles from './TypingGamse.module.css'

interface MagentaCanvasProps {
    onIncrease?: () => void;  // ? означает опционально
    onDecrease?: () => void;
}

const targetText: string = 'The quick brown fox jumps over the lazy dog. The quick brown fox jumps ';

export function TypingGame({onIncrease, onDecrease}: MagentaCanvasProps) {
    const [input, setInput] = useState('');
    const [targetArray, setTargetArray] = useState<string[]>([])
    const [startWord, setStartWord] = useState(0)
    
    const [currentCount, setCurrentCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [ wordCounter , setWordCOunter] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        const splittedInput = input.split(' ');
        const splittedTarget = targetText.split(' ');

        // splittedTarget.forEach((word, i) => {
        //     setTargetArray((prev) => [...prev, input.slice(startWord, splittedTarget[i].length)]);
        //     setStartWord((prev) => prev += i)
        // })
        for (let i = 0; i < splittedTarget.length; i++) {
            
            if(input.length === i) {
                if(splittedTarget[startWord].length === i) {
                    console.log(`Индекс цикла, целевого массива ${i} Длинная целевого массива: ${splittedTarget.length}`);
                    setTargetArray((prev) => [...prev, input.slice(startWord, splittedTarget[startWord].length)]);
                    setStartWord((prev) => prev += splittedTarget[startWord].length)
                }
            } else {
                // console.log('Дальше не считать');
                
            }
            console.log(`Индекс слова текущего: ${startWord}`);
            

        }
        
        

  

        

        // for (let i = 0; i < splittedTarget.length; i++) {
        //     setTargetArray((prev) => {
        //         prev.push(input.slice(i, splittedTarget[i].length))
        //     })
        // }
        

        if (splittedInput.length > (wordCounter + 2)) {
            setWordCOunter((prev) => prev += 2);
            console.log(splittedInput[wordCounter] !== splittedTarget[wordCounter]);
            if(splittedInput[wordCounter] === splittedTarget[wordCounter]) {
                console.log('increase');
                onIncrease?.()
            } else {
                console.log('onDecrease');
                onDecrease?.()

            }
            
        }
        
        
    },[input])
    //     // Автофокус при клике в любом месте
    // useEffect(() => {
    //     const handleClick = () => inputRef.current?.focus();
    //     document.addEventListener('click', handleClick);
    //     return () => document.removeEventListener('click', handleClick);
    // }, []);


    // const handleCheckEnteredText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     let currentValue = event.target.value
    //     let mathCount = 0;
    //     let mathError = 0;
        
    //     setInput(currentValue)
    //     console.log(currentValue);
    //     for (let i = 0; i < Math.min(currentValue.length, targetText.length); i++) {
    //         if (targetText[i] == currentValue[i]) {
    //             mathCount++
    //         } else {
    //             mathError++
    //         }
    //     }
    //     setCurrentCount(mathCount);
    //     setErrorCount(mathError)
    // }

    
    useEffect(() => {
        const handleClick = () => inputRef.current?.focus();
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    

        return (
            <div className={styles.wrapper}>
                <h2>Тренировка печати</h2>
                <HiddenInput 
                    inputRef={inputRef}
                    input={input}
                    setInput={setInput}/>

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
                <p className={styles.stat}>
                    Введено: {input.length} / {targetText.length}
                </p>
            </ div>
    );
}