'use client';

import { useEffect, useRef } from 'react';

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  opacity: number;
  blur: number;
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocksRef = useRef<Block[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const createBlock = (y?: number): Block => {
      const width = Math.random() * 80 + 30; // 30-110px wide
      const height = Math.random() * 50 + 20; // 20-70px tall
      return {
        x: Math.random() * (canvas.width - width),
        y: y ?? -height - Math.random() * 200,
        width,
        height,
        speed: Math.random() * 2 + 0.8, // 0.8-2.8 speed for depth effect
        opacity: Math.random() * 0.4 + 0.2, // 0.2-0.6 opacity (more visible)
        blur: Math.random() * 6 + 2, // 2-8px blur (less blur for visibility)
      };
    };

    const initBlocks = () => {
      const blockCount = Math.floor((canvas.width * canvas.height) / 25000); // Responsive density
      blocksRef.current = [];
      for (let i = 0; i < blockCount; i++) {
        // Distribute blocks across the screen initially
        blocksRef.current.push(createBlock(Math.random() * canvas.height));
      }
    };

    const drawBlock = (block: Block) => {
      ctx.save();
      ctx.filter = `blur(${block.blur}px)`;

      // Create gradient for glow effect
      const gradient = ctx.createLinearGradient(
        block.x,
        block.y,
        block.x,
        block.y + block.height
      );
      gradient.addColorStop(0, `rgba(0, 255, 180, ${block.opacity * 0.5})`);
      gradient.addColorStop(0.5, `rgba(0, 230, 160, ${block.opacity})`);
      gradient.addColorStop(1, `rgba(0, 180, 140, ${block.opacity * 0.7})`);

      // Add glow effect
      ctx.shadowColor = 'rgba(0, 255, 180, 0.8)';
      ctx.shadowBlur = block.blur * 3;

      // Draw main block
      ctx.fillStyle = gradient;
      ctx.fillRect(block.x, block.y, block.width, block.height);

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      blocksRef.current.forEach((block, index) => {
        // Update position
        block.y += block.speed;

        // Reset block when it goes off screen
        if (block.y > canvas.height) {
          blocksRef.current[index] = createBlock();
        }

        drawBlock(block);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initBlocks();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initBlocks();
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    />
  );
}

