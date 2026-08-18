import React, { useEffect, useRef } from 'react';
import { VisualTheme } from '../types';

interface ScreensaverCanvasProps {
  theme: VisualTheme;
  particlesEnabled: boolean;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  pulseSpeed: number;
  color: string;
}

export const ScreensaverCanvas: React.FC<ScreensaverCanvasProps> = ({
  theme,
  particlesEnabled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Initialize floating light motes / golden embers
    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      if (!particlesEnabled) return;

      const particleCount = Math.floor((width * height) / 18000); // Responsive density

      for (let i = 0; i < particleCount; i++) {
        let color = 'rgba(255, 215, 0, '; // Default gold
        if (theme === 'candlelight') {
          color = 'rgba(255, 180, 70, ';
        } else if (theme === 'stained-glass') {
          const colors = [
            'rgba(255, 215, 0, ', // Gold
            'rgba(90, 160, 255, ', // Sapphire
            'rgba(240, 80, 100, ', // Ruby
          ];
          color = colors[Math.floor(Math.random() * colors.length)];
        } else if (theme === 'marian-blue') {
          color = 'rgba(200, 230, 255, ';
        } else if (theme === 'vatican-crimson') {
          color = 'rgba(255, 223, 128, ';
        }

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.5 + 0.8,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(Math.random() * 0.4 + 0.15), // Drift gently upwards
          alpha: Math.random() * 0.5 + 0.1,
          maxAlpha: Math.random() * 0.6 + 0.3,
          pulseSpeed: Math.random() * 0.015 + 0.005,
          color,
        });
      }
    };

    initParticles();

    // Time counters for smooth candle flicker and stained glass light shift
    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // --- 1. DRAW BACKGROUND GRADIENT BASED ON THEME ---
      if (theme === 'candlelight') {
        // Deep warm sanctuary dark with flickering candle glow at bottom
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#0c0a09'); // Stone black
        bgGrad.addColorStop(0.65, '#1c120c'); // Warm mahogany
        bgGrad.addColorStop(1, '#2d180a'); // Candlelit base

        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Candlelight Ambient Glow Circles at Bottom
        const flicker = Math.sin(time * 3) * 0.08 + Math.cos(time * 5.2) * 0.05 + 0.87;
        const candleGlow = ctx.createRadialGradient(
          width / 2,
          height + 50,
          100,
          width / 2,
          height + 50,
          Math.max(width, height) * 0.75
        );
        candleGlow.addColorStop(0, `rgba(255, 140, 40, ${0.35 * flicker})`);
        candleGlow.addColorStop(0.4, `rgba(180, 80, 20, ${0.18 * flicker})`);
        candleGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = candleGlow;
        ctx.fillRect(0, 0, width, height);
      } else if (theme === 'stained-glass') {
        // Shimmering gothic cathedral stained glass atmosphere
        const bgGrad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.3,
          50,
          width * 0.5,
          height * 0.5,
          Math.max(width, height)
        );
        bgGrad.addColorStop(0, '#0f172a'); // Midnight slate
        bgGrad.addColorStop(0.5, '#090d16');
        bgGrad.addColorStop(1, '#030509');

        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Light rays filtering down from top-center
        const shift = Math.sin(time * 0.8) * 30;
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        const rayGrad = ctx.createLinearGradient(
          width * 0.5 + shift,
          0,
          width * 0.5 - shift * 2,
          height
        );
        rayGrad.addColorStop(0, 'rgba(212, 175, 55, 0.22)'); // Gold
        rayGrad.addColorStop(0.3, 'rgba(59, 130, 246, 0.12)'); // Cobalt
        rayGrad.addColorStop(0.6, 'rgba(225, 29, 72, 0.12)'); // Ruby
        rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(width * 0.5 - 200 + shift, 0);
        ctx.lineTo(width * 0.5 + 200 + shift, 0);
        ctx.lineTo(width * 0.8, height);
        ctx.lineTo(width * 0.2, height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (theme === 'monastic-parchment') {
        // Ancient illuminated manuscript parchment background
        const bgGrad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          100,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.8
        );
        bgGrad.addColorStop(0, '#1c1917'); // Warm charcoal parchment
        bgGrad.addColorStop(0.7, '#12100e');
        bgGrad.addColorStop(1, '#090807');

        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (theme === 'vatican-crimson') {
        // Deep papal crimson with regal gold dust
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#1a0509'); // Deep dark garnet
        bgGrad.addColorStop(0.5, '#2e0a12'); // Vatican red
        bgGrad.addColorStop(1, '#120205');

        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Center golden aura
        const goldAura = ctx.createRadialGradient(
          width / 2,
          height / 2,
          20,
          width / 2,
          height / 2,
          width * 0.45
        );
        goldAura.addColorStop(0, 'rgba(234, 179, 8, 0.15)');
        goldAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = goldAura;
        ctx.fillRect(0, 0, width, height);
      } else if (theme === 'marian-blue') {
        // Celestial Marian blue
        const bgGrad = ctx.createRadialGradient(
          width / 2,
          height * 0.35,
          50,
          width / 2,
          height / 2,
          Math.max(width, height)
        );
        bgGrad.addColorStop(0, '#0c1a30'); // Royal Marian Blue
        bgGrad.addColorStop(0.6, '#060e1a');
        bgGrad.addColorStop(1, '#02060d');

        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // --- 2. DRAW PARTICLES ---
      if (particlesEnabled && particles.length > 0) {
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha += Math.sin(time * 5) * p.pulseSpeed;

          // Wrap boundaries smoothly
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          const currentAlpha = Math.min(
            p.maxAlpha,
            Math.max(0.05, Math.abs(p.alpha))
          );

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${currentAlpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color + '1)';
          ctx.fill();
          ctx.shadowBlur = 0; // Reset
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, particlesEnabled]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
};
