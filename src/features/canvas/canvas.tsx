import { useEffect, useRef, useState } from 'react';


interface Star {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    size: number;
    alpha: number;
}

// Настройки по умолчанию
const speed = 10;
const speedStep = 0.5;
const size = 1.5;
const quantity = 300;
const quantityStep = 10;
const minQuantity = 100;
const color = 'white';


export default function MagentaCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [speedPerSecond, setSpeedPerSecond] = useState(speed);
    const [qtyStars, setQtyStars] = useState(quantity)
    const hyperjumpRef = useRef(false);
    const speedRef = useRef(speedPerSecond);
    const starsRef = useRef<Star[]>([]);


    const createStar = (): Star => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        return {
            x,
            y,
            velocityX: x - window.innerWidth / 2,
            velocityY: y - window.innerHeight / 2,
            size: Math.random() * size,
            alpha: 0,
        };
    };
    
    // Прибавляет и убавляет скорость и количество звёзд
    const handleClick = () => {
        setSpeedPerSecond((prev) => prev + speedStep)
        setQtyStars((prev) => prev + quantityStep)
    }   
    
    const handleClickReduce = () => {
        setSpeedPerSecond((prev) => Math.max(0, prev -  speedStep))
        setQtyStars((prev) => prev > minQuantity ? prev - quantityStep : prev)
    }



    useEffect(() => {
        speedRef.current = speedPerSecond;
    }, [speedPerSecond]);


    useEffect(() => {
    const stars = starsRef.current;

        while (stars.length < qtyStars) {
            stars.push(createStar());
        }

        while (stars.length > qtyStars) {
            stars.pop();
        }
    }, [qtyStars]);


    useEffect(() => {
        let animationFrameId: number;
        let lastTimestamp = 0;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        ctx.fillStyle = color;
        ctx.strokeStyle = color;

        const render = (timestamp: number) => {
            // Очищаем холст перед каждым новым кадром
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const deltaTime = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            // if(timestamp > 5000) {
            //     hyperjumpRef.current = true;
            // }
            // if(timestamp >  10000) {
            //     hyperjumpRef.current = false;
            // }

            
            starsRef.current.forEach(coord => {
                // Рисуем звезды
                if(!hyperjumpRef.current) {
                    // Звёздное небо
                    coord.alpha = Math.min(1, coord.alpha + deltaTime * 10);
                    ctx.globalAlpha = coord.alpha;
                    ctx.beginPath();
                    ctx.arc(coord.x, coord.y, coord.size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Гиперпрыжок
                    coord.alpha = Math.min(1, coord.alpha + deltaTime * 10);
                    ctx.beginPath();
                    ctx.moveTo(coord.x, coord.y);
                    ctx.lineTo(coord.x + coord.velocityX * 0.5, coord.y + coord.velocityY * 0.5 );
                    ctx.globalAlpha = coord.alpha;
                    ctx.stroke();
                }

                // Задаём координаты появления новых звёзд
                if (
                    coord.y > window.innerHeight ||
                    coord.x > window.innerWidth ||
                    coord.y < 0 ||
                    coord.x < 0
                ) {
                    coord.x = Math.random() * window.innerWidth;
                    coord.y = Math.random() * window.innerHeight;
                    coord.velocityX = coord.x - window.innerWidth / 2;
                    coord.velocityY = coord.y - window.innerHeight / 2;
                    coord.alpha = 0;
                }

                // Движение звёзд по координатам.
                coord.y += speedRef.current * deltaTime * coord.velocityY; 
                coord.x += speedRef.current * deltaTime * coord.velocityX;
            });
            ctx.globalAlpha = 1;

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);


        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <>
            <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: '-1'
            }}
            >
            Your browser is not supported.
            </canvas>
            <button style={{position: 'relative', zIndex: 10}} onClick={() => handleClick()}>Увеличить скорость</button>
            <button style={{position: 'relative', zIndex: 10}} onClick={handleClickReduce}>Уменьшить скорость</button>
        </>
    );
}