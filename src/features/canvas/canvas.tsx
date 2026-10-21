import { useEffect, useRef, useState } from 'react';


interface coords {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    // radius: number;     // Разный размер для глубины
    // alpha: number;      // Плавное появление (эффект мерцания)
    // active: boolean;    // Задержка появления
    // spawnDelay: number; // Сколько кадров ждать до появления
}

export default function MagentaCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    let [speedPerSecond, setSpeedPerSecond] = useState(1)
    const speedRef = useRef(speedPerSecond);

    let coords: coords[] = []
    
    const min = -50;
    const max = 50 ;
    const windowWidth = window.innerWidth;
    console.log(windowWidth);
    console.log(window.innerWidth);
    

    for (let i = 0; i < 2000; i++) {
        let randomX: number = Math.floor(Math.random() * window.innerWidth)
        let randomY: number = Math.floor(Math.random() * window.innerHeight)
        let randomVelocityX: number = Math.floor(Math.random() * (max - min + 1)) + min;
        let randomVelocityY: number = Math.floor(Math.random() * (max - min + 1)) + min;
        coords.push({x: randomX, y: randomY, velocityX: randomVelocityX, velocityY: randomVelocityY})
    }

    
    const handleClick = () => {
        setSpeedPerSecond((prev) => prev + 50 )
    }   
    
    const handleClickReduce = () => {
        setSpeedPerSecond((prev) => Math.max(0, prev - 50))
    }   



    useEffect(() => {
        speedRef.current = speedPerSecond;
    }, [speedPerSecond]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        let animationFrameId: number;
        let lastTimestamp= 0;
        
        // const intervalId = setInterval(() => {
        //     coords.forEach(coord => {
        //         coord.x = Math.floor(Math.random() * window.innerWidth)
        //         coord.y = Math.floor(Math.random() * window.innerHeight)

        //     })

        // }, 2000)


        
        const render = (timestamp: number) => {
        // 1. Очищаем холст перед каждым новым кадром, чтобы фигура не «размазывалась»
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const deltaTime = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            // 2. Рисуем прямоугольник
            ctx.fillStyle = 'white';
            console.log(ctx);
            
            
            coords.forEach(coord => {
                // Рисуем звезды
                ctx.beginPath();
                ctx.arc(coord.x, coord.y, 1, 0, Math.PI * 2);
                ctx.fill();
                if (coord.y > windowWidth || coord.x > windowWidth || coord.y < -(window.innerWidth - window.innerHeight) || coord.x < 0) {
                    coord.y = (window.innerHeight / 2)
                    coord.x =  (window.innerWidth / 2)
                }
                coord.y += speedRef.current * deltaTime * coord.velocityY;  // Скорость движения (можно менять)
                coord.x -= speedRef.current * deltaTime * coord.velocityX;  // Скорость движения (можно менять)
                
            });

            
            

            // 4. Запрашиваем следующий кадр анимации
            animationFrameId = requestAnimationFrame(render);
        };

        // Запускаем анимацию
        animationFrameId = requestAnimationFrame(render);


        return () => {
            cancelAnimationFrame(animationFrameId);
            // clearInterval(intervalId)
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