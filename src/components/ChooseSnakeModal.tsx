/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { SnakeSkin } from '../types/game';
import { SKINS_LIST } from '../utils/skins';

interface ChooseSnakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkinId: string;
  onSelectSkin: (skinId: string) => void;
}

// Mini Animated Snake Preview Card
const SnakeSkinPreview: React.FC<{
  skin: SnakeSkin;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ skin, isSelected, onSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = Math.random() * 100;

    const render = () => {
      t += 0.055;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Dark preview backdrop
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(0, 0, width, height);

      // Slithering snake path
      const segmentsCount = 7;
      const headX = width * 0.72;
      const centerY = height * 0.5;

      // Glow pass
      ctx.save();
      ctx.shadowColor = skin.glowColor;
      ctx.shadowBlur = 12;

      // Draw segments from tail to head
      for (let i = segmentsCount - 1; i >= 0; i--) {
        const segDist = i * 14;
        const wave = Math.sin(t + i * 0.6) * 10;
        const segX = headX - segDist;
        const segY = centerY + wave;
        const isHead = i === 0;
        const segRadius = isHead ? 8.5 : Math.max(5, 7.5 - i * 0.4);

        // Connecting stroke
        if (i < segmentsCount - 1) {
          const prevWave = Math.sin(t + (i + 1) * 0.6) * 10;
          const prevX = headX - (i + 1) * 14;
          const prevY = centerY + prevWave;

          ctx.beginPath();
          let strokeColor = skin.bodyColors[i % skin.bodyColors.length];
          if (skin.patternType === 'rainbow') {
            strokeColor = `hsl(${(i * 35 + t * 40) % 360}, 90%, 55%)`;
          }
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = segRadius * 1.8;
          ctx.lineCap = 'round';
          ctx.moveTo(segX, segY);
          ctx.lineTo(prevX, prevY);
          ctx.stroke();
        }

        // Segment circle
        ctx.beginPath();
        let fillColor = isHead ? skin.headColor : skin.bodyColors[i % skin.bodyColors.length];
        if (skin.patternType === 'rainbow') {
          fillColor = `hsl(${(i * 35 + t * 40) % 360}, 90%, 55%)`;
        }
        ctx.fillStyle = fillColor;
        ctx.arc(segX, segY, segRadius, 0, Math.PI * 2);
        ctx.fill();

        // Pattern detail on body
        if (!isHead && skin.patternType === 'diamonds') {
          ctx.fillStyle = skin.accentColor;
          ctx.beginPath();
          ctx.arc(segX, segY, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Head eyes & tongue
        if (isHead) {
          ctx.save();
          ctx.shadowBlur = 0;

          // Tongue flick
          const flick = Math.sin(t * 3) > 0.4;
          if (flick) {
            ctx.strokeStyle = skin.tongueColor;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(segX + segRadius, segY);
            ctx.lineTo(segX + segRadius + 8, segY);
            ctx.lineTo(segX + segRadius + 11, segY - 3);
            ctx.moveTo(segX + segRadius + 8, segY);
            ctx.lineTo(segX + segRadius + 11, segY + 3);
            ctx.stroke();
          }

          // Eyes
          if (skin.eyeType === 'visor') {
            ctx.fillStyle = skin.eyeColor;
            ctx.fillRect(segX + 2, segY - 4, 3, 8);
          } else {
            ctx.fillStyle = skin.eyeColor;
            ctx.beginPath();
            ctx.arc(segX + 2, segY - 3, 2.2, 0, Math.PI * 2);
            ctx.arc(segX + 2, segY + 3, 2.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = skin.pupilColor;
            ctx.beginPath();
            ctx.arc(segX + 2.8, segY - 3, 1.1, 0, Math.PI * 2);
            ctx.arc(segX + 2.8, segY + 3, 1.1, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [skin]);

  return (
    <div
      onClick={onSelect}
      className={`relative group cursor-pointer flex flex-col rounded-2xl p-4 border transition-all duration-200 ${
        isSelected
          ? 'bg-slate-900 border-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.22)] ring-1 ring-emerald-500'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
      }`}
    >
      {/* Live Animated Slither Canvas */}
      <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 mb-3 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={180}
          height={96}
          className="w-full h-full block"
        />
      </div>

      {/* Info Block */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
            {skin.name}
          </h4>
          {isSelected && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Equipped</span>
            </div>
          )}
        </div>

        <p className="text-[11px] font-medium text-slate-400 mb-1.5">
          {skin.subtitle}
        </p>

        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
          {skin.description}
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`mt-auto w-full py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            isSelected
              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(34,197,94,0.3)]'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {isSelected ? 'Equipped' : 'Select Skin'}
        </button>
      </div>
    </div>
  );
};

export const ChooseSnakeModal: React.FC<ChooseSnakeModalProps> = ({
  isOpen,
  onClose,
  selectedSkinId,
  onSelectSkin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div>
            <h3 className="text-lg font-bold text-white">Choose Your Snake</h3>
            <p className="text-xs text-slate-400">
              Select any skin anytime · Each features unique patterns and eyes
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close Choose Snake"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Skins Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {SKINS_LIST.map((skin) => (
            <SnakeSkinPreview
              key={skin.id}
              skin={skin}
              isSelected={selectedSkinId === skin.id}
              onSelect={() => {
                onSelectSkin(skin.id);
                onClose();
              }}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between text-xs text-slate-400">
          <span>Selected skin is automatically saved</span>
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
