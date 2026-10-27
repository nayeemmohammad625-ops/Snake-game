/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Pause, Play, Trophy, Palette, Settings } from 'lucide-react';
import { Difficulty, GameState, SnakeSkin } from '../types/game';
import { DIFFICULTIES } from '../utils/difficulty';

interface HeaderHUDProps {
  score: number;
  highScore: number;
  gameState: GameState;
  difficulty: Difficulty;
  currentSkin: SnakeSkin;
  isMuted: boolean;
  onToggleSound: () => void;
  onTogglePause: () => void;
  onOpenChooseSnake: () => void;
  onOpenSettings: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  score,
  highScore,
  gameState,
  difficulty,
  currentSkin,
  isMuted,
  onToggleSound,
  onTogglePause,
  onOpenChooseSnake,
  onOpenSettings,
}) => {
  return (
    <header className="w-full flex items-center justify-between gap-3 py-2.5 px-3 md:px-6 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md shrink-0">
      {/* Zone 1: Brand title & Skin Indicator */}
      <div className="flex items-center gap-2 shrink-0">
        <div
          className="w-2.5 h-2.5 rounded-full shadow-sm"
          style={{ backgroundColor: currentSkin.headColor }}
        />
        <span className="text-sm md:text-base font-bold tracking-tight text-white whitespace-nowrap">
          Neon Snake
        </span>

        {/* Quick Snake Skin Trigger */}
        <button
          type="button"
          onClick={onOpenChooseSnake}
          className="hidden sm:flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
          title="Change Snake Skin"
        >
          <Palette className="w-3.5 h-3.5" style={{ color: currentSkin.headColor }} />
          <span className="font-medium text-[11px] truncate max-w-[90px]">{currentSkin.name}</span>
        </button>
      </div>

      {/* Zone 2: HUD Metrics */}
      <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm">
        {/* Score */}
        <div className="flex items-baseline gap-1">
          <span className="text-slate-400 font-medium text-[10px] md:text-xs">SCORE</span>
          <span className="text-sm md:text-base font-bold font-mono tabular-nums text-emerald-400">
            {score}
          </span>
        </div>

        {/* High Score with Difficulty label */}
        <div className="flex items-baseline gap-1">
          <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0 self-center" />
          <span className="text-slate-400 font-medium text-[10px] md:text-xs hidden xs:inline uppercase">
            {DIFFICULTIES[difficulty].label} BEST
          </span>
          <span className="text-sm md:text-base font-bold font-mono tabular-nums text-white">
            {highScore}
          </span>
        </div>
      </div>

      {/* Zone 3: Interactive Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Mobile Snake Skin Trigger */}
        <button
          type="button"
          onClick={onOpenChooseSnake}
          className="sm:hidden p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors cursor-pointer"
          title="Choose Snake"
          aria-label="Choose Snake"
        >
          <Palette className="w-4 h-4" style={{ color: currentSkin.headColor }} />
        </button>

        {/* Pause / Resume Button */}
        {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
          <button
            type="button"
            onClick={onTogglePause}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
            title={gameState === 'PLAYING' ? 'Pause Game (P or Space)' : 'Resume Game (P or Space)'}
            aria-label={gameState === 'PLAYING' ? 'Pause' : 'Resume'}
          >
            {gameState === 'PLAYING' ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 fill-current text-emerald-400" />
            )}
          </button>
        )}

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
          title={isMuted ? 'Unmute Sound (M)' : 'Mute Sound (M)'}
          aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
          title="Controls & Layout Settings"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
