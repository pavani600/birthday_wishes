import { useEffect, useRef } from 'react';

interface ConfettiEffectProps {
  type?: 'hearts' | 'balloons' | 'fireworks' | 'confetti' | 'all';
  active?: boolean;
}

export default function ConfettiEffect({ type = 'all', active = true }: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle classes
    class HeartParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50; // start below screen
        this.size = Math.random() * 15 + 8;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = -(Math.random() * 2 + 1.5); // float up
        this.opacity = Math.random() * 0.5 + 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        const pinks = ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#fda4af'];
        this.color = pinks[Math.floor(Math.random() * pinks.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        if (this.y < -30) {
          this.y = height + 30;
          this.x = Math.random() * width;
          this.opacity = Math.random() * 0.5 + 0.5;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        c.globalAlpha = this.opacity;
        c.fillStyle = this.color;
        
        // Draw heart shape
        c.beginPath();
        c.moveTo(0, 0);
        c.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, 0, 0, this.size);
        c.bezierCurveTo(this.size, 0, this.size / 2, -this.size / 2, 0, 0);
        c.closePath();
        c.fill();
        c.restore();
      }
    }

    class BalloonParticle {
      x: number;
      y: number;
      r: number;
      speedY: number;
      swing: number;
      swingSpeed: number;
      color: string;
      stringLength: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 200 + 50;
        this.r = Math.random() * 20 + 20; // balloon radius
        this.speedY = -(Math.random() * 1.2 + 1);
        this.swing = Math.random() * Math.PI * 2;
        this.swingSpeed = Math.random() * 0.02 + 0.01;
        const balloonColors = ['#f43f5e', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
        this.color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        this.stringLength = this.r * 1.5;
      }

      update() {
        this.y += this.speedY;
        this.swing += this.swingSpeed;
        this.x += Math.sin(this.swing) * 0.5;

        if (this.y < -this.r * 3) {
          this.y = height + this.r * 2;
          this.x = Math.random() * width;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.fillStyle = this.color;
        
        // Draw balloon body (ellipse)
        c.beginPath();
        c.ellipse(0, 0, this.r * 0.8, this.r, 0, 0, Math.PI * 2);
        c.fill();

        // Draw small triangle at bottom
        c.beginPath();
        c.moveTo(0, this.r);
        c.lineTo(-5, this.r + 6);
        c.lineTo(5, this.r + 6);
        c.closePath();
        c.fill();

        // Draw string
        c.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        c.lineWidth = 1.5;
        c.beginPath();
        c.moveTo(0, this.r + 6);
        c.bezierCurveTo(
          Math.sin(this.swing * 2) * 5, this.r + this.stringLength * 0.3,
          -Math.sin(this.swing * 2) * 5, this.r + this.stringLength * 0.6,
          0, this.r + this.stringLength
        );
        c.stroke();
        c.restore();
      }
    }

    class ConfettiParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      rotation: number;
      rotationSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = -Math.random() * height; // start above screen
        this.size = Math.random() * 8 + 6;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = Math.random() * 2 + 2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        const colorsList = ['#f43f5e', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#a855f7', '#06b6d4'];
        this.color = colorsList[Math.floor(Math.random() * colorsList.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 20) {
          this.y = -20;
          this.x = Math.random() * width;
          this.speedY = Math.random() * 2 + 2;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        c.fillStyle = this.color;
        c.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
        c.restore();
      }
    }

    class FireworkSpark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
      color: string;
      size: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.color = color;
        this.size = Math.random() * 3 + 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.06; // gravity
        this.vx *= 0.98; // air resistance
        this.vy *= 0.98;
        this.alpha -= this.decay;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = this.alpha;
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    class FireworkShell {
      x: number;
      y: number;
      targetY: number;
      vy: number;
      color: string;
      exploded: boolean;
      sparks: FireworkSpark[];

      constructor() {
        this.x = Math.random() * (width - 200) + 100;
        this.y = height + 10;
        this.targetY = Math.random() * (height * 0.5) + 50;
        this.vy = -(Math.random() * 5 + 7);
        const fwColors = ['#ff4b72', '#ff5cf6', '#3bd5ff', '#3bffa9', '#ffcc3b', '#c084fc'];
        this.color = fwColors[Math.floor(Math.random() * fwColors.length)];
        this.exploded = false;
        this.sparks = [];
      }

      update() {
        if (!this.exploded) {
          this.y += this.vy;
          this.vy += 0.08; // gradual decelerating
          if (this.vy >= 0 || this.y <= this.targetY) {
            this.explode();
          }
        } else {
          this.sparks.forEach((s) => s.update());
          this.sparks = this.sparks.filter((s) => s.alpha > 0);
        }
      }

      explode() {
        this.exploded = true;
        const sparkCount = Math.floor(Math.random() * 60) + 40;
        for (let i = 0; i < sparkCount; i++) {
          this.sparks.push(new FireworkSpark(this.x, this.y, this.color));
        }
      }

      draw(c: CanvasRenderingContext2D) {
        if (!this.exploded) {
          c.save();
          c.fillStyle = this.color;
          c.beginPath();
          c.arc(this.x, this.y, 4, 0, Math.PI * 2);
          c.fill();
          // tail trace
          c.fillStyle = 'rgba(255, 255, 255, 0.2)';
          c.fillRect(this.x - 1, this.y + 2, 2, 10);
          c.restore();
        } else {
          this.sparks.forEach((s) => s.draw(c));
        }
      }
    }

    // Initialize lists
    const hearts: HeartParticle[] = [];
    const balloons: BalloonParticle[] = [];
    const confetti: ConfettiParticle[] = [];
    let fireworks: FireworkShell[] = [];

    const maxHearts = 45;
    const maxBalloons = 12;
    const maxConfetti = 80;

    if (type === 'hearts' || type === 'all') {
      for (let i = 0; i < maxHearts; i++) {
        hearts.push(new HeartParticle());
      }
    }

    if (type === 'balloons' || type === 'all') {
      for (let i = 0; i < maxBalloons; i++) {
        balloons.push(new BalloonParticle());
      }
    }

    if (type === 'confetti' || type === 'all') {
      for (let i = 0; i < maxConfetti; i++) {
        confetti.push(new ConfettiParticle());
      }
    }

    // Firework spawner helper
    let fireworkTimer = 0;

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw and update Hearts
      hearts.forEach((h) => {
        h.update();
        h.draw(ctx);
      });

      // 2. Draw and update Balloons
      balloons.forEach((b) => {
        b.update();
        b.draw(ctx);
      });

      // 3. Draw and update Confetti
      confetti.forEach((cf) => {
        cf.update();
        cf.draw(ctx);
      });

      // 4. Draw and update Fireworks
      if (type === 'fireworks' || type === 'all') {
        fireworkTimer++;
        if (fireworkTimer > 50) { // Every ~1 second launch a firework
          if (fireworks.length < 5) {
            fireworks.push(new FireworkShell());
          }
          fireworkTimer = 0;
        }

        fireworks.forEach((fw) => fw.update());
        fireworks.forEach((fw) => fw.draw(ctx));

        // filter out exploded ones with no sparks left
        fireworks = fireworks.filter((fw) => !fw.exploded || fw.sparks.length > 0);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [type, active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
