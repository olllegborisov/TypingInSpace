import { useEffect, useRef, useState } from 'react';

export default function MagentaCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    let [speedPerSecond, setSpeedPerSecond] = useState(100)
    const speedRef = useRef(speedPerSecond);

    let coords: {x: number; y: number}[] = [
        {x: 50, y: 20}
    ]
    
    for (let i = 0; i < 1000; i++) {
        let randomX: number = Math.floor(Math.random() * window.innerWidth)
        let randomY: number = Math.floor(Math.random() * window.innerHeight)
        coords.push({x: randomX, y: randomY})
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
                ctx.beginPath();
                ctx.arc(coord.x, coord.y, 1, 0, Math.PI * 2);
                ctx.fill();
                // 3. Изменяем координату для следующего кадра
                if(coord.x > window.innerWidth / 2) {
                    coord.x += speedRef.current * deltaTime;  // Скорость движения (можно менять)
                } 
                if (coord.x < window.innerWidth / 2) {
                    coord.x -= speedRef.current * deltaTime;  // Скорость движения (можно менять)
                }
                if (coord.y > window.innerHeight ) {
                    coord.y = Math.floor(Math.random() * window.innerHeight)
                    coord.x = Math.floor(Math.random() * window.innerWidth)
                }
                coord.y += speedRef.current * deltaTime;  // Скорость движения (можно менять)
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