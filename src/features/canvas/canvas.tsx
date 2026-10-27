import { useEffect, useRef, useState } from 'react';
import styles from './canvas.module.css'
import { TypingGame } from '../game/TypingGame';


// Два состояния приложения космос в виде точек, и гиперпрыжок — полоски
type State = 'regular' | 'hyperJump';

interface Star {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    size: number;
    alpha: number;
}


const BASE_SPEED = 0.1;
const SPEED_STEP = 0.5;
const SIZE = 1.5;
const BASE_QUANTITY = 300;
const MIN_QUANTITY = 100;
// const MAX_QUANTITY = 600; 
const QUANTITY_STEP = 10;
const COLOR = 'white';

const TARGET_DECAY = 0.03;
const SPEED_SMOOTHING = 0.05;
const HYPERJUMP_THRESHOLD = 20;
// const SPEED_MULTIPLIER = 0;
// const QUANTITY_MULTIPLIER = 500;

export default function MagentaCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    
    // Стейты
    const [qtyStars, setQtyStars] = useState(BASE_QUANTITY);
    const [speedPerSecond, setSpeedPerSecond] = useState(BASE_SPEED); // Оставил для работы тестовых кнопок
    const [gameState, setGameState] = useState<State>('regular'); // Что бы вызвать гиперпрыжен необходимо переключить состояние

    
    // Рефы
    const hyperjumpRef = useRef(false);
    const speedRef = useRef(BASE_SPEED);
    const targetSpeedRef = useRef(BASE_SPEED); 
    const targetQtyRef = useRef(BASE_QUANTITY);
    const lastSetQtyRef = useRef(BASE_QUANTITY);
    const starsRef = useRef<Star[]>([]);
    // const keydownTimes = useRef<number[]>([]);
    const gameStateRef = useRef<'regular' | 'hyperJump'>(gameState);


    const createStar = (): Star => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        return {
            x, y,
            velocityX: x - window.innerWidth / 2,
            velocityY: y - window.innerHeight / 2,
            size: Math.random() * SIZE,
            alpha: 0,
        };
    };

    // Обновление массива звёзд при  изменении стейта
    useEffect(() => {
        const stars = starsRef.current;
        while (stars.length < qtyStars) stars.push(createStar());
        while (stars.length > qtyStars) stars.pop();
    }, [qtyStars]);

    // Синхронизация стейта скорости с рефом (нужна для тестовых кнопок)
    useEffect(() => {
        targetSpeedRef.current = speedPerSecond;
    }, [speedPerSecond]);

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    // Цикл отрисовки
    useEffect(() => {
        let animationFrameId: number;
        let lastTimestamp = 0;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = COLOR;
        ctx.strokeStyle = COLOR;

        const render = (timestamp: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const deltaTime = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0.016;
            lastTimestamp = timestamp;

            // остывание двигателя (+кол-во звёзд))
            targetSpeedRef.current += (speedPerSecond - targetSpeedRef.current) * TARGET_DECAY;
            targetQtyRef.current += (BASE_QUANTITY - targetQtyRef.current) * TARGET_DECAY;


            // инерция корабля
            speedRef.current += (targetSpeedRef.current - speedRef.current) * SPEED_SMOOTHING;

            // защита от полной остановки
            if (speedRef.current < 0.1) speedRef.current = 0.1;


            // плавная синхронизация
            const desiredQty = Math.round(targetQtyRef.current);
            if (Math.abs(lastSetQtyRef.current - desiredQty) > 50) {
                setQtyStars(desiredQty);
                lastSetQtyRef.current = desiredQty; // Запоминаем, что установили
            }

            // переключение режима
            hyperjumpRef.current = speedRef.current > HYPERJUMP_THRESHOLD;
            if (speedRef.current < HYPERJUMP_THRESHOLD) {
                gameStateRef.current = 'regular'
            } else {
                gameStateRef.current = 'hyperJump'
            }


            starsRef.current.forEach(coord => {
                if (gameStateRef.current == 'regular') {
                    coord.alpha = Math.min(1, coord.alpha + deltaTime * 10);
                    ctx.globalAlpha = coord.alpha;
                    ctx.beginPath();
                    ctx.arc(coord.x, coord.y, coord.size, 0, Math.PI * 2);
                    ctx.fill();
                } else if (gameStateRef.current == 'hyperJump') {
                    coord.alpha = Math.min(1, coord.alpha + deltaTime * 10);
                    ctx.globalAlpha = coord.alpha;
                    ctx.beginPath();
                    ctx.moveTo(coord.x, coord.y);
                    ctx.lineTo(coord.x + coord.velocityX * 0.5, coord.y + coord.velocityY * 0.5);
                    ctx.stroke();
                }

                // Респаун звёзд
                if (coord.y > window.innerHeight || coord.x > window.innerWidth || coord.y < 0 || coord.x < 0) {
                    coord.x = Math.random() * window.innerWidth;
                    coord.y = Math.random() * window.innerHeight;
                    coord.velocityX = coord.x - window.innerWidth / 2;
                    coord.velocityY = coord.y - window.innerHeight / 2;
                    coord.alpha = 0;
                }

                // Движение
                coord.y += speedRef.current * deltaTime * coord.velocityY; 
                coord.x += speedRef.current * deltaTime * coord.velocityX;
            });
            ctx.globalAlpha = 1;

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrameId);
    }, [speedPerSecond]);

    const handleClick = () => {
        console.log('increase');
        setSpeedPerSecond((prev) => prev + SPEED_STEP);
        setQtyStars((prev) => prev + QUANTITY_STEP);
    }
    
    const handleClickReduce = () => {
        setSpeedPerSecond((prev) => Math.max(0.1, prev - SPEED_STEP));
        setQtyStars((prev) => prev > MIN_QUANTITY ? prev - QUANTITY_STEP : prev);
    }

    // // Слушатель клавиатуры (исправлен: теперь использует SPEED_MULTIPLIER вместо отсутствующего speedStep)
    // useEffect(() => {
    //     function handleKeydown(event: KeyboardEvent) {
    //         if (event.key.length === 1) {
    //             const now = performance.now();
    //             keydownTimes.current.push(now);
    //             keydownTimes.current = keydownTimes.current.filter(time => now - time <= 5000); 

    //             const cps = keydownTimes.current.length / 5;

    //             // При печати увеличиваем скорость поверх базовой, используя твой множитель
    //             targetSpeedRef.current = speedPerSecond + (cps * SPEED_MULTIPLIER); 

    //             // При печати увеличиваем количество звёзд, используя твой множитель
    //             const newTargetQty = Math.min(
    //                 MAX_QUANTITY, 
    //                 Math.max(MIN_QUANTITY, BASE_QUANTITY + Math.floor(cps * QUANTITY_MULTIPLIER))
    //             );

    //             // Обновляем стейт только при существенной разнице (> 15), чтобы не ронять FPS
    //             targetQtyRef.current = Math.abs(targetQtyRef.current - newTargetQty) > 15 ? newTargetQty : targetQtyRef.current;
    //         }
    //     }

    //     document.addEventListener('keydown', handleKeydown);
    //     return () => document.removeEventListener('keydown', handleKeydown);
    // }, [speedPerSecond, BASE_QUANTITY, MIN_QUANTITY, MAX_QUANTITY, SPEED_MULTIPLIER, QUANTITY_MULTIPLIER]);

    // Тестовые кнопки (работают через SPEED_STEP и QUANTITY_STEP)


    return (
        <>
            <canvas
                ref={canvasRef}
                className={styles.canvas}>
                Your browser is not supported.
            </canvas>
            <TypingGame onIncrease={handleClick}  onDecrease={handleClickReduce}/>

            
            <div className={styles.buttonWrapper}>
                <button 
                    className={styles.button}
                    onClick={handleClick}>
                    Тест: Увеличить базу
                </button>
                <button 
                    className={styles.button}
                    onClick={handleClickReduce}>
                    Тест: Уменьшить базу
                </button>
            </div>
        </>
    );
}