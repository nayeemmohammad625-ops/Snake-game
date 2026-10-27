/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Difficulty, DifficultyConfig } from '../types/game';

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: {
    id: 'easy',
    label: 'Easy',
    tagline: 'Slow & relaxing, gentle acceleration',
    baseIntervalMs: 200, // Very slow & comfortable base speed
    stepFoods: 8,        // Rises only slightly over time
    decrMs: 5,
    minIntervalMs: 140,  // Stays calm and relaxing even in late game
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    tagline: 'Moderate speed, steady gradual rise',
    baseIntervalMs: 150, // Moderate pace
    stepFoods: 6,
    decrMs: 7,
    minIntervalMs: 90,
    badgeColor: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
  },
  hard: {
    id: 'hard',
    label: 'Hard',
    tagline: 'Fast pace, speeds up every few foods',
    baseIntervalMs: 110, // Faster pace
    stepFoods: 4,        // Speeds up every 4 foods
    decrMs: 8,
    minIntervalMs: 55,
    badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  },
};

export function getHighScoreKey(difficulty: Difficulty): string {
  return `neon_snake_hs_${difficulty}`;
}

export function loadHighScore(difficulty: Difficulty): number {
  if (typeof window === 'undefined') return 0;
  try {
    const saved = localStorage.getItem(getHighScoreKey(difficulty));
    return saved ? parseInt(saved, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(difficulty: Difficulty, score: number): void {
  if (typeof window === 'undefined') return;
  try {
    const current = loadHighScore(difficulty);
    if (score > current) {
      localStorage.setItem(getHighScoreKey(difficulty), String(score));
    }
  } catch {
    // ignore
  }
}

export function loadAllHighScores(): Record<Difficulty, number> {
  return {
    easy: loadHighScore('easy'),
    medium: loadHighScore('medium'),
    hard: loadHighScore('hard'),
  };
}
