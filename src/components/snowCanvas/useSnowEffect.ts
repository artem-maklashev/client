import { useEffect } from 'react';

const useSnowEffect = () => {
  useEffect(() => {
    // читаем переменную, переданную в контейнере
    const cfg = (window as any).__RUNTIME_CONFIG__;
    const SHOW_SNOW = cfg?.SHOW_SNOW === 'true';

    // если выключено — не запускаем эффект
    if (!SHOW_SNOW) return;

    // 1. Создаём canvas программно
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      document.body.removeChild(canvas);
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let mouseX = -100;
    let mouseY = -100;


    let animationFrameId: number;
    let snowflakes: Snowflake[] = [];
    let isMouseMoving = false; // ← флаг: мышь сейчас движется
    let moveTimeout: NodeJS.Timeout | null = null;
    class Snowflake {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      life: number;
      maxLife: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 1;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = Math.random() * 2 + 1;
        this.life = 0;
        this.maxLife = 100 + Math.random() * 100;
      }

      update(): boolean {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        return this.life <= this.maxLife;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseMoving = true;

      // Сбрасываем флаг через 100 мс, если движение прекратится
      if (moveTimeout) clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMouseMoving = false;
      }, 100); // ← можно увеличить до 200–300 мс для плавности
    };

    document.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isMouseMoving && Math.random() < 0.4 ) {
        snowflakes.push(new Snowflake(mouseX, mouseY));
      }

      snowflakes = snowflakes.filter((flake) => {
        const alive = flake.update();
        if (alive) flake.draw(ctx);
        return alive;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      document.body.removeChild(canvas);
    };
  }, []);
};

export default useSnowEffect;
