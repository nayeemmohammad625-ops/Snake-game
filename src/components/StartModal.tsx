/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Trophy, Volume2, VolumeX, ChevronRight, Settings, Download, Smartphone } from 'lucide-react';
import { Difficulty, SnakeSkin } from '../types/game';
import { DIFFICULTIES } from '../utils/difficulty';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface StartModalProps {
  difficulty: Difficulty;
  onChangeDifficulty: (diff: Difficulty) => void;
  highScore: number;
  currentSkin: SnakeSkin;
  onOpenChooseSnake: () => void;
  onOpenSettings: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onStart: () => void;
}

export const StartModal: React.FC<StartModalProps> = ({
  difficulty,
  onChangeDifficulty,
  highScore,
  currentSkin,
  onOpenChooseSnake,
  onOpenSettings,
  isMuted,
  onToggleSound,
  onStart,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md rounded-2xl animate-in fade-in duration-200">
      <div className="w-full max-w-md flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-y-auto max-h-[95%]">
        {/* Title Lockup */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e]" />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Snake Game
          </h1>
        </div>

        <p className="text-xs text-slate-400 mb-3.5">
          Eat glowing food · Relaxed comfortable speed · Grow your tail
        </p>

        {/* Custom PWA Install Button (Hides once installed) */}
        {!isInstalled && (isInstallable || isIOS) && (
          <div className="w-full mb-3">
            {isInstallable ? (
              <button
                type="button"
                onClick={install}
                className="w-full py-2.5 px-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.15)] cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Install App on Phone</span>
              </button>
            ) : isIOS ? (
              <button
                type="button"
                onClick={() => setShowIOSGuide(true)}
                className="w-full py-2.5 px-4 flex items-center justify-center gap-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Install on iPhone / iPad</span>
              </button>
            ) : null}
          </div>
        )}

        {/* Difficulty Selection */}
        <div className="w-full mb-3 text-left">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Select Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
              const cfg = DIFFICULTIES[d];
              const isSelected = difficulty === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChangeDifficulty(d)}
                  className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-[0_0_12px_rgba(34,197,94,0.18)]'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold capitalize">{cfg.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {d === 'easy' ? 'Slow & Calm' : d === 'medium' ? 'Balanced' : 'Fast Pace'}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 px-0.5">
            {DIFFICULTIES[difficulty].tagline}
          </p>
        </div>

        {/* High Score for Current Difficulty */}
        <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-3">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>High Score ({DIFFICULTIES[difficulty].label})</span>
          </div>
          <span className="text-base font-bold font-mono tabular-nums text-white">
            {highScore}
          </span>
        </div>

        {/* Choose Snake Banner Card */}
        <div
          onClick={onOpenChooseSnake}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors mb-3 group"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm"
              style={{
                backgroundColor: currentSkin.headColor + '20',
                borderColor: currentSkin.headColor,
              }}
            >
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: currentSkin.headColor }}
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {currentSkin.name}
                </span>
                <span className="text-[10px] text-slate-400">Skin</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">
                {currentSkin.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
            <span>Change</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <button
            type="button"
            onClick={onStart}
            className="w-full py-3.5 px-6 flex items-center justify-center gap-2.5 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition-all rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.35)] cursor-pointer whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Game</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onToggleSound}
              className="py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors whitespace-nowrap cursor-pointer"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  <span>Audio Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Audio On</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-slate-500">
          Tap or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Space</kbd> anytime to start
        </p>

        {/* iOS Safari Installation Guide Modal */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-xs rounded-2xl bg-slate-900 border border-slate-800 p-5 text-center shadow-2xl">
              <Smartphone className="w-8 h-8 text-sky-400 mx-auto mb-2" />
              <h4 className="text-base font-bold text-white mb-2">Install on iOS</h4>
              <p className="text-xs text-slate-300 text-left space-y-1 mb-4 leading-relaxed">
                1. Tap the <strong>Share</strong> button in Safari's bottom toolbar.<br />
                2. Scroll down and select <strong>Add to Home Screen</strong>.<br />
                3. Tap <strong>Add</strong> in the top right to install!
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
