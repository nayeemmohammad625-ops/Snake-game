/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, Palette, Gauge, Settings } from 'lucide-react';
import { Difficulty, SnakeSkin } from '../types/game';
import { DIFFICULTIES } from '../utils/difficulty';

interface PauseModalProps {
  score: number;
  foodsEaten: number;
  difficulty: Difficulty;
  currentSkin: SnakeSkin;
  onResume: () => void;
  onRestart: () => void;
  onOpenChooseSnake: () => void;
  onChangeDifficulty: (diff: Difficulty) => void;
  onOpenSettings: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  score,
  foodsEaten,
  difficulty,
  currentSkin,
  onResume,
  onRestart,
  onOpenChooseSnake,
  onChangeDifficulty,
  onOpenSettings,
}) => {
  const [showDiffPicker, setShowDiffPicker] = React.useState(false);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md rounded-2xl animate-in fade-in duration-200">
      <div className="w-full max-w-xs flex flex-col items-center text-center p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <h2 className="text-xl font-bold tracking-tight text-white mb-1">
          Game Paused
        </h2>

        {/* Score & Skin Metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <span>Score: <strong className="text-emerald-400 font-mono">{score}</strong></span>
          <span aria-hidden="true">·</span>
          <span>{foodsEaten} Foods</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{difficulty}</span>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          {/* Resume */}
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3 px-5 flex items-center justify-center gap-2 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition-all rounded-xl shadow-[0_0_18px_rgba(34,197,94,0.3)] cursor-pointer whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume Game</span>
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-colors whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Restart</span>
          </button>

          {/* Change Snake Button */}
          <button
            type="button"
            onClick={onOpenChooseSnake}
            className="w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>Change Snake ({currentSkin.name})</span>
          </button>

          {/* Change Difficulty Button / Quick Selector */}
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
            <div className="w-full p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1.5">Select New Difficulty</span>
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

        <p className="mt-3.5 text-[11px] text-slate-500">
          Tap or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Space</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">P</kbd> to resume
        </p>
      </div>
    </div>
  );
};
