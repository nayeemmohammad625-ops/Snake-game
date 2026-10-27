/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { Direction, Point, Particle, FloatingText } from '../types/game';
import { SNAKE_SKINS } from '../utils/skins';

interface GameBoardProps {
  gridSize: number;
  skinId: string;
  snakeRef: React.MutableRefObject<Point[]>;
  foodRef: React.MutableRefObject<Point>;
  particlesRef: React.MutableRefObject<Particle[]>;
  floatingTextsRef: React.MutableRefObject<FloatingText[]>;
  foodPulseRef: React.MutableRefObject<number>;
  tongueTimerRef: React.MutableRefObject<number>;
  currentDirection: Direction;
  onSwipe: (dir: Direction) => void;
  onTap: () => void;
  isPaused: boolean;
  isGameOver: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gridSize,
  skinId,
  snakeRef,
  foodRef,
  particlesRef,
  floatingTextsRef,
  foodPulseRef,
  tongueTimerRef,
  currentDirection,
  onSwipe,
  onTap,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const skin = SNAKE_SKINS[skinId] || SNAKE_SKINS['green-python'];

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);

      const cellSize = width / gridSize;

      // 1. Sleek Background with subtle dark matrix grid
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Grid Lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.beginPath();
      for (let i = 0; i <= gridSize; i++) {
        const pos = i * cellSize;
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, height);
        ctx.moveTo(0, pos);
        ctx.lineTo(width, pos);
      }
      ctx.stroke();

      // 2. Render Glowing Food (Glowing Ruby / Red Core)
      const food = foodRef.current;
      const foodCenterX = (food.x + 0.5) * cellSize;
      const foodCenterY = (food.y + 0.5) * cellSize;
      const baseFoodRadius = cellSize * 0.38;
      const pulseScale = 1 + Math.sin(foodPulseRef.current * 4) * 0.08;
      const foodRadius = baseFoodRadius * pulseScale;

      // Radial Glow Aura
      const foodAura = ctx.createRadialGradient(
        foodCenterX,
        foodCenterY,
        foodRadius * 0.2,
        foodCenterX,
        foodCenterY,
        foodRadius * 2.8
      );
      foodAura.addColorStop(0, 'rgba(239, 68, 68, 0.85)');
      foodAura.addColorStop(0.5, 'rgba(239, 68, 68, 0.2)');
      foodAura.addColorStop(1, 'rgba(239, 68, 68, 0)');

      ctx.save();
      ctx.fillStyle = foodAura;
      ctx.beginPath();
      ctx.arc(foodCenterX, foodCenterY, foodRadius * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Food Core Orb
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(foodCenterX, foodCenterY, foodRadius, 0, Math.PI * 2);
      ctx.fill();

      // Specular highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.arc(
        foodCenterX - foodRadius * 0.3,
        foodCenterY - foodRadius * 0.3,
        foodRadius * 0.28,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Leaf / Stem
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = Math.max(2, cellSize * 0.08);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(foodCenterX, foodCenterY - foodRadius * 0.85);
      ctx.quadraticCurveTo(
        foodCenterX + foodRadius * 0.5,
        foodCenterY - foodRadius * 1.35,
        foodCenterX + foodRadius * 0.8,
        foodCenterY - foodRadius * 1.1
      );
      ctx.stroke();
      ctx.restore();

      // 3. Render Snake
      const snake = snakeRef.current;
      if (snake.length > 0) {
        ctx.save();

        const head = snake[0];
        const distToFood = Math.abs(head.x - food.x) + Math.abs(head.y - food.y);
        const isFlicking = (tongueTimerRef.current < 450) || (distToFood <= 2);

        // Body Glow
        ctx.shadowColor = skin.glowColor;
        ctx.shadowBlur = 16;

        // Render from tail to head
        for (let i = snake.length - 1; i >= 0; i--) {
          const seg = snake[i];
          const segCenterX = (seg.x + 0.5) * cellSize;
          const segCenterY = (seg.y + 0.5) * cellSize;
          const isHead = i === 0;

          // Radius scaling
          const ratio = 1 - i / Math.max(snake.length, 1);
          let segmentRadius = isHead
            ? cellSize * 0.44
            : cellSize * (0.34 + ratio * 0.08);

          // Cobra flare on segment right behind head
          if (skin.id === 'red-cobra' && i === 1) {
            segmentRadius *= 1.25;
          }

          // Connecting bridge to next segment for smooth organic body
          if (i > 0) {
            const nextSeg = snake[i - 1];
            const nextCenterX = (nextSeg.x + 0.5) * cellSize;
            const nextCenterY = (nextSeg.y + 0.5) * cellSize;

            ctx.beginPath();
            let strokeColor = skin.bodyColors[i % skin.bodyColors.length];
            if (skin.patternType === 'rainbow') {
              const hue = (i * 22 + foodPulseRef.current * 40) % 360;
              strokeColor = `hsl(${hue}, 90%, 55%)`;
            }

            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = segmentRadius * 1.85;
            ctx.lineCap = 'round';
            ctx.moveTo(segCenterX, segCenterY);
            ctx.lineTo(nextCenterX, nextCenterY);
            ctx.stroke();
          }

          // Draw Segment Circle
          ctx.beginPath();
          let fillColor = skin.bodyColors[i % skin.bodyColors.length];
          if (isHead) {
            fillColor = skin.headColor;
          } else if (skin.patternType === 'rainbow') {
            const hue = (i * 22 + foodPulseRef.current * 40) % 360;
            fillColor = `hsl(${hue}, 90%, 55%)`;
          }

          ctx.fillStyle = fillColor;
          ctx.arc(segCenterX, segCenterY, segmentRadius, 0, Math.PI * 2);
          ctx.fill();

          // Body Segment Custom Pattern Details
          if (!isHead) {
            if (skin.patternType === 'diamonds') {
              ctx.fillStyle = skin.accentColor;
              ctx.beginPath();
              ctx.moveTo(segCenterX, segCenterY - segmentRadius * 0.5);
              ctx.lineTo(segCenterX + segmentRadius * 0.4, segCenterY);
              ctx.lineTo(segCenterX, segCenterY + segmentRadius * 0.5);
              ctx.lineTo(segCenterX - segmentRadius * 0.4, segCenterY);
              ctx.closePath();
              ctx.fill();
            } else if (skin.patternType === 'banded') {
              if (i % 2 === 0) {
                ctx.strokeStyle = '#18181b';
                ctx.lineWidth = segmentRadius * 0.35;
                ctx.stroke();
              }
            } else if (skin.patternType === 'scales') {
              ctx.fillStyle = skin.accentColor;
              ctx.beginPath();
              ctx.arc(segCenterX, segCenterY, segmentRadius * 0.25, 0, Math.PI * 2);
              ctx.fill();
            } else if (skin.patternType === 'cyber') {
              ctx.fillStyle = skin.accentColor;
              ctx.beginPath();
              ctx.arc(segCenterX, segCenterY, segmentRadius * 0.3, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Head Details: Forked Tongue & Expressive Eyes
          if (isHead) {
            ctx.save();
            ctx.shadowBlur = 0;

            const eyeOffset = segmentRadius * 0.45;
            const eyeFwd = segmentRadius * 0.35;
            const eyeRadius = segmentRadius * 0.26;
            const pupilRadius = segmentRadius * 0.13;

            let eye1X = 0;
            let eye1Y = 0;
            let eye2X = 0;
            let eye2Y = 0;
            let fwdX = 0;
            let fwdY = 0;

            switch (currentDirection) {
              case 'RIGHT':
                eye1X = segCenterX + eyeFwd;
                eye1Y = segCenterY - eyeOffset;
                eye2X = segCenterX + eyeFwd;
                eye2Y = segCenterY + eyeOffset;
                fwdX = 1;
                break;
              case 'LEFT':
                eye1X = segCenterX - eyeFwd;
                eye1Y = segCenterY - eyeOffset;
                eye2X = segCenterX - eyeFwd;
                eye2Y = segCenterY + eyeOffset;
                fwdX = -1;
                break;
              case 'UP':
                eye1X = segCenterX - eyeOffset;
                eye1Y = segCenterY - eyeFwd;
                eye2X = segCenterX + eyeOffset;
                eye2Y = segCenterY - eyeFwd;
                fwdY = -1;
                break;
              case 'DOWN':
                eye1X = segCenterX - eyeOffset;
                eye1Y = segCenterY + eyeFwd;
                eye2X = segCenterX + eyeOffset;
                eye2Y = segCenterY + eyeFwd;
                fwdY = 1;
                break;
            }

            // Forked Tongue Animation
            if (isFlicking) {
              const tongueReach = segmentRadius * 1.5;
              const startX = segCenterX + fwdX * segmentRadius;
              const startY = segCenterY + fwdY * segmentRadius;
              const tipX = startX + fwdX * tongueReach;
              const tipY = startY + fwdY * tongueReach;

              ctx.strokeStyle = skin.tongueColor;
              ctx.lineWidth = Math.max(1.8, cellSize * 0.07);
              ctx.lineCap = 'round';

              ctx.beginPath();
              ctx.moveTo(startX, startY);
              ctx.lineTo(tipX, tipY);

              const forkLength = tongueReach * 0.35;
              if (fwdX !== 0) {
                ctx.moveTo(tipX, tipY);
                ctx.lineTo(tipX + fwdX * forkLength, tipY - forkLength * 0.7);
                ctx.moveTo(tipX, tipY);
                ctx.lineTo(tipX + fwdX * forkLength, tipY + forkLength * 0.7);
              } else {
                ctx.moveTo(tipX, tipY);
                ctx.lineTo(tipX - forkLength * 0.7, tipY + fwdY * forkLength);
                ctx.moveTo(tipX, tipY);
                ctx.lineTo(tipX + forkLength * 0.7, tipY + fwdY * forkLength);
              }
              ctx.stroke();
            }

            // Eyes rendering based on skin eyeType
            if (skin.eyeType === 'visor') {
              ctx.fillStyle = skin.eyeColor;
              ctx.shadowColor = skin.eyeColor;
              ctx.shadowBlur = 8;
              ctx.beginPath();
              if (fwdX !== 0) {
                ctx.roundRect(
                  segCenterX + fwdX * eyeFwd - 2,
                  segCenterY - eyeOffset * 1.2,
                  5,
                  eyeOffset * 2.4,
                  3
                );
              } else {
                ctx.roundRect(
                  segCenterX - eyeOffset * 1.2,
                  segCenterY + fwdY * eyeFwd - 2,
                  eyeOffset * 2.4,
                  5,
                  3
                );
              }
              ctx.fill();
            } else {
              ctx.fillStyle = skin.eyeColor;
              ctx.beginPath();
              ctx.arc(eye1X, eye1Y, eyeRadius, 0, Math.PI * 2);
              ctx.arc(eye2X, eye2Y, eyeRadius, 0, Math.PI * 2);
              ctx.fill();

              ctx.fillStyle = skin.pupilColor;
              if (skin.eyeType === 'slit') {
                ctx.beginPath();
                const slitW = pupilRadius * 0.6;
                const slitH = pupilRadius * 1.8;
                if (fwdX !== 0) {
                  ctx.ellipse(eye1X + fwdX * 2, eye1Y, slitW, slitH, 0, 0, Math.PI * 2);
                  ctx.ellipse(eye2X + fwdX * 2, eye2Y, slitW, slitH, 0, 0, Math.PI * 2);
                } else {
                  ctx.ellipse(eye1X, eye1Y + fwdY * 2, slitH, slitW, 0, 0, Math.PI * 2);
                  ctx.ellipse(eye2X, eye2Y + fwdY * 2, slitH, slitW, 0, 0, Math.PI * 2);
                }
                ctx.fill();
              } else if (skin.eyeType === 'gem') {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(eye1X - 1, eye1Y - 1, pupilRadius * 0.8, 0, Math.PI * 2);
                ctx.arc(eye2X - 1, eye2Y - 1, pupilRadius * 0.8, 0, Math.PI * 2);
                ctx.fill();
              } else {
                ctx.beginPath();
                ctx.arc(eye1X + fwdX * 2, eye1Y + fwdY * 2, pupilRadius, 0, Math.PI * 2);
                ctx.arc(eye2X + fwdX * 2, eye2Y + fwdY * 2, pupilRadius, 0, Math.PI * 2);
                ctx.fill();
              }
            }

            ctx.restore();
          }
        }
        ctx.restore();
      }

      // 4. Render Particles
      const particles = particlesRef.current;
      if (particles.length > 0) {
        ctx.save();
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x * cellSize, p.y * cellSize, p.radius * cellSize, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 5. Render Floating Texts
      const floatingTexts = floatingTextsRef.current;
      if (floatingTexts.length > 0) {
        ctx.save();
        ctx.font = `bold ${Math.max(14, cellSize * 0.8)}px 'Outfit', sans-serif`;
        ctx.textAlign = 'center';
        for (let i = 0; i < floatingTexts.length; i++) {
          const ft = floatingTexts[i];
          ctx.fillStyle = ft.color;
          ctx.globalAlpha = ft.alpha;
          ctx.shadowColor = ft.color;
          ctx.shadowBlur = 10;
          ctx.fillText(ft.text, ft.x * cellSize, ft.y * cellSize);
        }
        ctx.restore();
      }
    },
    [gridSize, skin, foodRef, foodPulseRef, tongueTimerRef, snakeRef, particlesRef, floatingTextsRef, currentDirection]
  );

  // Resize & Rendering Sync
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        const size = Math.floor(Math.min(rect.width, rect.height));

        if (size > 0) {
          if (canvas.width !== size * dpr || canvas.height !== size * dpr) {
            canvas.width = size * dpr;
            canvas.height = size * dpr;
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;
          }

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.save();
            ctx.scale(dpr, dpr);
            draw(ctx, size, size);
            ctx.restore();
          }
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [draw]);

  // Touch handlers: supports short, light swipe (>=16px) and tap-to-pause
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: performance.now(),
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touchEnd = e.changedTouches[0];
    const dx = touchEnd.clientX - touchStartRef.current.x;
    const dy = touchEnd.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // Short, light swipe threshold (16px)
    const minSwipeDistance = 16;

    if (Math.max(absX, absY) >= minSwipeDistance) {
      if (absX > absY) {
        onSwipe(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onSwipe(dy > 0 ? 'DOWN' : 'UP');
      }
    } else if (absX < 8 && absY < 8) {
      // It was a clean tap!
      onTap();
    }
    touchStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center rounded-2xl overflow-hidden bg-[#060a12] border border-slate-800 shadow-[0_0_35px_-5px_rgba(34,197,94,0.15)] cursor-pointer"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onTap}
      style={{ touchAction: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="block rounded-xl select-none"
      />
    </div>
  );
};
