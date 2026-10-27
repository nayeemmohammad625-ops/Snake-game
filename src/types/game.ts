/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ControlMode = 'both' | 'dpad' | 'swipe';

export type DPadSize = 'small' | 'medium' | 'large';

export type DPadAlignment = 'center' | 'left' | 'right';

export interface UserControlSettings {
  controlMode: ControlMode;
  dPadSize: DPadSize;
  dPadAlignment: DPadAlignment;
}

export interface Point {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  alpha: number;
  life: number;
  color: string;
}

export interface DifficultyConfig {
  id: Difficulty;
  label: string;
  tagline: string;
  baseIntervalMs: number;
  stepFoods: number;
  decrMs: number;
  minIntervalMs: number;
  badgeColor: string;
}

export interface SnakeSkin {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  headColor: string;
  bodyColors: string[];
  accentColor: string;
  glowColor: string;
  eyeType: 'round' | 'slit' | 'visor' | 'prismatic' | 'gem';
  eyeColor: string;
  pupilColor: string;
  tongueColor: string;
  patternType: 'smooth' | 'scales' | 'banded' | 'diamonds' | 'rainbow' | 'cyber';
  foodParticles: string[];
}
