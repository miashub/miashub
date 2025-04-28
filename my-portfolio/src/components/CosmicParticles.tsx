'use client';

import { useEffect, useRef } from 'react';

export default function CosmicParticles({ className, theme }: { className?: string; theme: 'nebula' | 'supernova' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const getSize = () => ({
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
    });

    const resizeCanvas = () => {
      const { width, height } = getSize();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();


    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 50 : 400; 
    const shootingStarFrequency = isMobile ? 0.002 : 0.004; 

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      alphaDir: number;
      hue: number;
      lightness: number;
      baseLightness: number;
      connections: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.9;
        const speedFactor = isMobile ? 0.2 : 0.3; 
        this.speedX = (Math.random() - 0.5) * speedFactor;
        this.speedY = (Math.random() - 0.5) * speedFactor;
        this.alpha = Math.random() * 0.4 + 0.3;
        this.alphaDir = Math.random() > 0.5 ? 1 : -1;
        this.hue = theme === 'nebula'
          ? Math.random() * 60 + 200
          : Math.random() * 30 + 30;
        this.baseLightness = Math.random() * 20 + 60;
        this.lightness = this.baseLightness;
        this.connections = 0;
      }

      update(bounds: { width: number; height: number }, mouse?: { x: number; y: number }) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > bounds.width) this.speedX *= -1;
        if (this.y < 0 || this.y > bounds.height) this.speedY *= -1;

        this.alpha += this.alphaDir * 0.01;
        if (this.alpha >= 0.9 || this.alpha <= 0.2) {
          this.alphaDir *= -1;
        }

        this.connections = 0;

        if (mouse) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const proximityFactor = 1 - (distance / 150);
            this.lightness = this.baseLightness + (proximityFactor * 30);
            this.alpha = 0.7 + (proximityFactor * 0.3);
          } else {
            this.lightness += (this.baseLightness - this.lightness) * 0.1;
            this.alpha += (0.5 - this.alpha) * 0.1;
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const color = `hsla(${this.hue}, 100%, ${this.lightness}%, ${this.alpha})`;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class ShootingStar {
      x: number;
      y: number;
      speed: number;
      angle: number;
      length: number;
      alpha: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height * 0.5;
        this.speed = Math.random() * 8 + 8;
        this.angle = (Math.random() * Math.PI) / 6 + Math.PI / 4;
        this.length = Math.random() * 100 + 50;
        this.alpha = 1;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= 0.01;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createLinearGradient(
          this.x, this.y,
          this.x - Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        gradient.addColorStop(0, `hsla(0, 0%, 100%, ${this.alpha})`);
        gradient.addColorStop(1, `hsla(0, 0%, 100%, 0)`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
        ctx.stroke();
      }
    }

    const particles: Particle[] = [];
    const shootingStars: ShootingStar[] = [];
    const mouse = { x: -9999, y: -9999 };

    const initParticles = () => {
      const { width, height } = getSize();
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(width, height));
      }
    };

    const drawConnections = () => {
      const maxConnections = 5;
      const maxDistance = 150;

      particles.sort((a, b) => a.x - b.x);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];

          if (p2.x - p1.x > maxDistance) break;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (
            distSq < maxDistance * maxDistance &&
            p1.connections < maxConnections &&
            p2.connections < maxConnections
          ) {
            const dist = Math.sqrt(distSq);
            const opacity = 1 - dist / maxDistance;
            const lineWidth = 0.3 + (1 - dist / maxDistance) * 0.7;
            const hue = (p1.hue + p2.hue) / 2;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${hue}, 80%, 70%, ${opacity * 0.4})`;
            ctx.lineWidth = lineWidth;
            ctx.stroke();

            p1.connections++;
            p2.connections++;
          }
        }
      }
    };

    const animate = () => {
      const { width, height } = getSize();
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => p.update({ width, height }, mouse));
      drawConnections();
      particles.forEach((p) => p.draw(ctx));

      shootingStars.forEach((star) => {
        star.update();
        star.draw(ctx);
      });

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        if (shootingStars[i].alpha <= 0) {
          shootingStars.splice(i, 1);
        }
      }

      if (Math.random() < shootingStarFrequency) {
        shootingStars.push(new ShootingStar(width, height));
      }

      requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`${className ?? ''} absolute top-0 left-0 w-full h-full pointer-events-none`}
    />
  );
}
