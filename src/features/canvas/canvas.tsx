import { useEffect, useRef } from 'react';

export default function MagentaCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const SPEED_PER_SECOND: number = 1;
        let x: number = 50;
        let animationFrameId: number;
        let lastTime = performance.now();
        


        
        const render = (currentTime: number) => {
            const deltaTime = (currentTime - lastTime) / 1000;
        // 1. Очищаем холст перед каждым новым кадром, чтобы фигура не «размазывалась»
            ctx.clearRect(0, 0, canvas.width, canvas.height);



            // 2. Рисуем прямоугольник
            ctx.fillStyle = 'magenta';
            ctx.fillRect(x, 50, 5, 5);


            if (x === (100) ) {
                x = 50;
            }

            // 3. Изменяем координату для следующего кадра
            x += SPEED_PER_SECOND * deltaTime;  // Скорость движения (можно менять)

            // 4. Запрашиваем следующий кадр анимации
            animationFrameId = requestAnimationFrame(render);
        };

        // Запускаем анимацию
        animationFrameId = requestAnimationFrame(render);


        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
        ref={canvasRef}
        style={{
            display: 'block',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
        }}
        >
        Your browser is not supported.
        </canvas>
    );
    }