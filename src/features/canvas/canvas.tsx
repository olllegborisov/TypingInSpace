import { useEffect, useRef, useState } from 'react';


interface coords {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    radius: number;     // Разный размер для глубины
    sourceX: number;
    sourceY: number;
    alpha: number;      // Плавное появление (эффект мерцания)
    // active: boolean;    // Задержка появления
    // spawnDelay: number; // Сколько кадров ждать до появления
}

export default function MagentaCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    let [speedPerSecond, setSpeedPerSecond] = useState(0.5);
    let [qtyStars, setQtyStart] = useState(500)
    const speedRef = useRef(speedPerSecond);

    let coords: coords[] = []
    
    const createStar = (): coords => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        return {
            x,
            y,
            velocityX: x - window.innerWidth / 2,
            velocityY: y - window.innerHeight / 2,
            radius: Math.random() * 1.5,
            sourceX: x,
            sourceY: y,
            alpha: 0,
        };
    };
    
    for (let i = 0; i < qtyStars; i++) {
        coords.push(createStar());
    }

    const handleClick = () => {
        setSpeedPerSecond((prev) => prev + 0.5 )
        setQtyStart((prev) => prev + 50)
        
    }   
    
    const handleClickReduce = () => {
        setSpeedPerSecond((prev) => Math.max(0, prev -  0.5))
        setQtyStart((prev) => prev > 50 ? prev -  50 : prev)
    }


    useEffect(() => {
        speedRef.current = speedPerSecond;
    }, [speedPerSecond]);

    useEffect(() => {
        let animationFrameId: number;
        let lastTimestamp = 0;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        const render = (timestamp: number) => {
            // Очищаем холст перед каждым новым кадром
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const deltaTime = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            
            coords.forEach(coord => {
                // Рисуем звезды
                coord.alpha = Math.min(1, coord.alpha + deltaTime * 10);
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(coord.x, coord.y, coord.radius, 0, Math.PI * 2);
                ctx.globalAlpha = coord.alpha;
                ctx.fill();

                // Задаём координаты появления новых звёзд
                if (
                    coord.y > window.innerHeight ||
                    coord.x > window.innerWidth ||
                    coord.y < 0 ||
                    coord.x < 0
                ) {
                    coord.x = Math.random() * window.innerWidth;
                    coord.y = Math.random() * window.innerHeight;

                    coord.sourceX = coord.x;
                    coord.sourceY = coord.y;

                    coord.velocityX = coord.x - window.innerWidth / 2;
                    coord.velocityY = coord.y - window.innerHeight / 2;

                    coord.alpha = 0;
                }
                // Движение звёзд по координатам.
                coord.y += speedRef.current * deltaTime * coord.velocityY; 
                coord.x += speedRef.current * deltaTime * coord.velocityX;
            });
            ctx.globalAlpha = 1;


            // Запрашиваем следующий кадр анимации
            animationFrameId = requestAnimationFrame(render);
        };

        // Запускаем анимацию
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
            <button style={{zIndex: 10}} onClick={() => handleClick()}>Увеличить скорость</button>
            <button style={{zIndex: 10}} onClick={handleClickReduce}>Уменьшить скорость</button>
        </>
    );
    }