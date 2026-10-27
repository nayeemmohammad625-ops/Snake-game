/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Gamepad2, Volume2, VolumeX, Maximize2, MoveHorizontal, Trash2 } from 'lucide-react';
import { ControlMode, DPadSize, DPadAlignment, UserControlSettings } from '../types/game';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  controls: UserControlSettings;
  onChangeControls: (updated: Partial<UserControlSettings>) => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onResetHighScores: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  controls,
  onChangeControls,
  isMuted,
  onToggleSound,
  onResetHighScores,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm flex flex-col rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div>
            <h3 className="text-base font-bold text-white">Controls & Settings</h3>
            <p className="text-xs text-slate-400">Configure your playstyle and layout</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* 1. Control Mode */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              <span>Mobile Control Mode</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'both' as ControlMode, label: 'D-Pad & Swipe' },
                { id: 'dpad' as ControlMode, label: 'D-Pad Only' },
                { id: 'swipe' as ControlMode, label: 'Swipe Only' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeControls({ controlMode: opt.id })}
                  className={`py-2 px-1 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                    controls.controlMode === opt.id
                      ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. D-Pad Size (Visible if mode includes dpad) */}
          {controls.controlMode !== 'swipe' && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                <Maximize2 className="w-4 h-4 text-sky-400" />
                <span>D-Pad Button Size</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'small' as DPadSize, label: 'Small' },
                  { id: 'medium' as DPadSize, label: 'Medium' },
                  { id: 'large' as DPadSize, label: 'Large (Big)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeControls({ dPadSize: opt.id })}
                    className={`py-2 px-1 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                      controls.dPadSize === opt.id
                        ? 'border-sky-500 bg-sky-500/15 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. D-Pad Handedness / Alignment */}
          {controls.controlMode !== 'swipe' && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                <MoveHorizontal className="w-4 h-4 text-amber-400" />
                <span>Layout & Handedness</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'left' as DPadAlignment, label: 'Left-Handed' },
                  { id: 'center' as DPadAlignment, label: 'Centered' },
                  { id: 'right' as DPadAlignment, label: 'Right-Handed' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeControls({ dPadAlignment: opt.id })}
                    className={`py-2 px-1 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                      controls.dPadAlignment === opt.id
                        ? 'border-amber-500 bg-amber-500/15 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Audio Sound Effects */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>Game Sound Effects</span>
              </div>

              <button
                type="button"
                onClick={onToggleSound}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  !isMuted
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                    : 'border-slate-700 bg-slate-800 text-slate-400'
                }`}
              >
                {!isMuted ? 'Enabled' : 'Muted'}
              </button>
            </div>
          </div>

          {/* 5. Reset High Scores */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onResetHighScores}
              className="w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Saved High Scores</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
