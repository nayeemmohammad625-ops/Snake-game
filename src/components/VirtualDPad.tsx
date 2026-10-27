/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Direction, DPadSize, DPadAlignment } from '../types/game';

interface VirtualDPadProps {
  onDirection: (dir: Direction) => void;
  disabled?: boolean;
  size?: DPadSize;
  alignment?: DPadAlignment;
}

export const VirtualDPad: React.FC<VirtualDPadProps> = ({
  onDirection,
  disabled = false,
  size = 'large',
  alignment = 'center',
}) => {
  const triggerDirection = (e: React.MouseEvent | React.TouchEvent, dir: Direction) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // ignore
      }
    }
    onDirection(dir);
  };

  // Dimensions configuration based on size setting
  const sizeClasses = {
    small: 'w-36 h-36 p-1 gap-1',
    medium: 'w-44 h-44 p-1.5 gap-1.5',
    large: 'w-52 h-52 sm:w-56 sm:h-56 p-2 gap-2',
  }[size];

  const iconSizes = {
    small: 'w-6 h-6',
    medium: 'w-7 h-7',
    large: 'w-8 h-8 sm:w-9 sm:h-9',
  }[size];

  const alignmentClasses = {
    left: 'justify-start pl-2 sm:pl-4',
    center: 'justify-center',
    right: 'justify-end pr-2 sm:pr-4',
  }[alignment];

  return (
    <div
      className={`w-full flex items-center ${alignmentClasses} select-none py-1 touch-manipulation`}
      style={{ touchAction: 'none' }}
    >
      <div
        className={`relative grid grid-cols-3 grid-rows-3 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl ${sizeClasses}`}
      >
        {/* Center hub */}
        <div className="col-start-2 row-start-2 flex items-center justify-center rounded-2xl bg-slate-950/70 border border-slate-800/50">
          <div className="w-4 h-4 rounded-full bg-emerald-500/30 border border-emerald-500/40" />
        </div>

        {/* UP BUTTON */}
        <button
          type="button"
          onPointerDown={(e) => triggerDirection(e, 'UP')}
          className="col-start-2 row-start-1 flex items-center justify-center rounded-2xl bg-slate-800/95 active:bg-emerald-500 active:text-slate-950 text-slate-200 border border-slate-700/70 active:scale-95 transition-all shadow-md touch-manipulation cursor-pointer"
          aria-label="Move Up"
        >
          <ArrowUp className={`${iconSizes} stroke-[2.5]`} />
        </button>

        {/* LEFT BUTTON */}
        <button
          type="button"
          onPointerDown={(e) => triggerDirection(e, 'LEFT')}
          className="col-start-1 row-start-2 flex items-center justify-center rounded-2xl bg-slate-800/95 active:bg-emerald-500 active:text-slate-950 text-slate-200 border border-slate-700/70 active:scale-95 transition-all shadow-md touch-manipulation cursor-pointer"
          aria-label="Move Left"
        >
          <ArrowLeft className={`${iconSizes} stroke-[2.5]`} />
        </button>

        {/* RIGHT BUTTON */}
        <button
          type="button"
          onPointerDown={(e) => triggerDirection(e, 'RIGHT')}
          className="col-start-3 row-start-2 flex items-center justify-center rounded-2xl bg-slate-800/95 active:bg-emerald-500 active:text-slate-950 text-slate-200 border border-slate-700/70 active:scale-95 transition-all shadow-md touch-manipulation cursor-pointer"
          aria-label="Move Right"
        >
          <ArrowRight className={`${iconSizes} stroke-[2.5]`} />
        </button>

        {/* DOWN BUTTON */}
        <button
          type="button"
          onPointerDown={(e) => triggerDirection(e, 'DOWN')}
          className="col-start-2 row-start-3 flex items-center justify-center rounded-2xl bg-slate-800/95 active:bg-emerald-500 active:text-slate-950 text-slate-200 border border-slate-700/70 active:scale-95 transition-all shadow-md touch-manipulation cursor-pointer"
          aria-label="Move Down"
        >
          <ArrowDown className={`${iconSizes} stroke-[2.5]`} />
        </button>
      </div>
    </div>
  );
};
