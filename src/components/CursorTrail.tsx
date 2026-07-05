import { useEffect } from 'react';

export default function CursorTrail() {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cursorContainer = document.createElement('div');
    cursorContainer.style.position = 'fixed';
    cursorContainer.style.top = '0';
    cursorContainer.style.left = '0';
    cursorContainer.style.width = '100vw';
    cursorContainer.style.height = '100vh';
    cursorContainer.style.pointerEvents = 'none';
    cursorContainer.style.zIndex = '9999';
    cursorContainer.style.overflow = 'hidden';
    document.body.appendChild(cursorContainer);

    // Custom cursor dot
    const cursorDot = document.createElement('div');
    cursorDot.style.position = 'fixed';
    cursorDot.style.width = '10px';
    cursorDot.style.height = '10px';
    cursorDot.style.borderRadius = '50%';
    cursorDot.style.backgroundColor = '#e0a899'; // rose-gold accent
    cursorDot.style.boxShadow = '0 0 10px #b04b4b, 0 0 20px #e0a899';
    cursorDot.style.pointerEvents = 'none';
    cursorDot.style.zIndex = '10000';
    cursorDot.style.transform = 'translate(-50%, -50%)';
    cursorDot.style.transition = 'width 0.1s, height 0.1s, background-color 0.1s';
    cursorDot.style.opacity = '0';
    document.body.appendChild(cursorDot);

    let lastX = 0;
    let lastY = 0;
    let isActive = false;

    const colors = ['#e0a899', '#b04b4b', '#fdf8f8', '#ffd1c7', '#d4af37'];
    const characters = ['❤️', '✨', '🌹', '🌸', '✦'];

    const spawnParticle = (x: number, y: number) => {
      const particle = document.createElement('span');
      const char = characters[Math.floor(Math.random() * characters.length)];
      const size = Math.random() * 12 + 8; // 8px to 20px
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.textContent = char;
      particle.style.position = 'absolute';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.fontSize = `${size}px`;
      particle.style.pointerEvents = 'none';
      particle.style.transform = 'translate(-50%, -50%) scale(1)';
      particle.style.transition = 'all 1.2s cubic-bezier(0.1, 0.8, 0.3, 1)';
      particle.style.opacity = '1';
      particle.style.textShadow = `0 0 5px ${color}`;

      cursorContainer.appendChild(particle);

      // Force reflow
      void particle.offsetWidth;

      // Animate out
      const destinationX = x + (Math.random() - 0.5) * 100;
      const destinationY = y - (Math.random() * 80 + 40); // Float upwards
      const rotation = (Math.random() - 0.5) * 360;

      particle.style.left = `${destinationX}px`;
      particle.style.top = `${destinationY}px`;
      particle.style.transform = `translate(-50%, -50%) scale(0) rotate(${rotation}deg)`;
      particle.style.opacity = '0';

      // Cleanup
      setTimeout(() => {
        particle.remove();
      }, 1200);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive) {
        cursorDot.style.opacity = '1';
        isActive = true;
      }
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;

      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist > 25) { // Spawn particle every 25px of movement
        spawnParticle(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const dist = Math.hypot(touch.clientX - lastX, touch.clientY - lastY);
      if (dist > 30) {
        spawnParticle(touch.clientX, touch.clientY);
        lastX = touch.clientX;
        lastY = touch.clientY;
      }
    };

    // Change cursor style on hoverable items
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.tagName === 'A' ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer')
      ) {
        cursorDot.style.width = '20px';
        cursorDot.style.height = '20px';
        cursorDot.style.backgroundColor = '#b04b4b';
      } else {
        cursorDot.style.width = '10px';
        cursorDot.style.height = '10px';
        cursorDot.style.backgroundColor = '#e0a899';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cursorContainer.remove();
      cursorDot.remove();
    };
  }, []);

  return null;
}
