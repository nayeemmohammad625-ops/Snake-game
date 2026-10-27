/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RotateCcw, Trophy, Award, Flame, Palette, Gauge, Settings } from 'lucide-react';
import { Difficulty, SnakeSkin } from '../types/game';
import { DIFFICULTIES } from '../utils/difficulty';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  foodsEaten: number;
  difficulty: Difficulty;
  currentSkin: SnakeSkin;
  onRestart: () => void;
  onOpenChooseSnake: () => void;
  onChangeDifficulty: (diff: Difficulty) => void;
  onOpenSettings: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHighScore,
  foodsEaten,
  difficulty,
  currentSkin,
  onRestart,
  onOpenChooseSnake,
  onChangeDifficulty,
  onOpenSettings,
}) => {
  const [showDiffPicker, setShowDiffPicker] = useState(false);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md rounded-2xl animate-in fade-in duration-200">
      <div className="w-full max-w-sm flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-y-auto max-h-[95%]">
        {/* Status */}
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-1">
          <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
          <span>COLLISION</span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white mb-3">
          Game Over
        </h2>

        {/* New Record Banner */}
        {isNewHighScore && score > 0 && (
          <div className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Award className="w-4 h-4 text-amber-400" />
            <span>NEW {DIFFICULTIES[difficulty].label.toUpperCase()} RECORD!</span>
          </div>
        )}

        {/* Score Grid */}
        <div className="w-full grid grid-cols-2 gap-2.5 mb-3.5">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400">Score</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
              {score}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>{DIFFICULTIES[difficulty].label} Best</span>
            </div>
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {highScore}
            </span>
          </div>
        </div>

        {/* Breakdown Row */}
        <div className="w-full flex items-center justify-around py-1.5 px-3 rounded-xl bg-slate-950/40 border border-slate-800/50 text-xs text-slate-400 mb-4">
          <span>Foods: <strong className="text-slate-200 font-mono">{foodsEaten}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Skin: <strong className="text-slate-200">{currentSkin.name}</strong></span>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          {/* Restart */}
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3 px-6 flex items-center justify-center gap-2 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition-all rounded-xl shadow-[0_0_18px_rgba(34,197,94,0.35)] cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>

          {/* Change Snake Button */}
          <button
            type="button"
            onClick={onOpenChooseSnake}
            className="w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>Change Snake</span>
          </button>

          {/* Change Difficulty Button */}
          {!showDiffPicker ? (
            <button
              type="button"
              onClick={() => setShowDiffPicker(true)}
              className="w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Gauge className="w-4 h-4 text-sky-400" />
              <span>Change Difficulty ({DIFFICULTIES[difficulty].label})</span>
            </button>
          ) : (
            <div className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1.5">Choose New Difficulty</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      onChangeDifficulty(d);
                      setShowDiffPicker(false);
                      onRestart();
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                      difficulty === d
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-full py-2 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800/60 rounded-xl border border-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Controls & Layout Settings</span>
          </button>
        </div>

        <p className="mt-3 text-[11px] text-slate-500">
          Tap or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Space</kbd> to restart
        </p>
      </div>
    </div>
  );
};
