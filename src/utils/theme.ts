/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ThemeConfig {
  id: string;
  name: string;
  snakeHead: string;
  snakeBodyStart: string;
  snakeBodyEnd: string;
  snakeGlow: string;
  snakeEye: string;
  foodCore: string;
  foodAura: string;
  foodParticles: string[];
  boardBg: string;
  gridLine: string;
  borderGlow: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  'neon-emerald': {
    id: 'neon-emerald',
    name: 'Neon Emerald',
    snakeHead: '#22c55e',
    snakeBodyStart: '#4ade80',
    snakeBodyEnd: '#10b981',
    snakeGlow: 'rgba(34, 197, 94, 0.75)',
    snakeEye: '#ffffff',
    foodCore: '#ef4444',
    foodAura: 'rgba(239, 68, 68, 0.85)',
    foodParticles: ['#ef4444', '#f87171', '#fca5a5', '#fb7185', '#fda4af'],
    boardBg: '#080c14',
    gridLine: 'rgba(255, 255, 255, 0.04)',
    borderGlow: 'rgba(34, 197, 94, 0.3)',
  },
  'cyber-cyan': {
    id: 'cyber-cyan',
    name: 'Cyber Cyan',
    snakeHead: '#06b6d4',
    snakeBodyStart: '#38bdf8',
    snakeBodyEnd: '#0284c7',
    snakeGlow: 'rgba(6, 182, 212, 0.75)',
    snakeEye: '#ffffff',
    foodCore: '#f59e0b',
    foodAura: 'rgba(245, 158, 11, 0.85)',
    foodParticles: ['#f59e0b', '#fbbf24', '#fcd34d', '#f97316'],
    boardBg: '#050a14',
    gridLine: 'rgba(255, 255, 255, 0.04)',
    borderGlow: 'rgba(6, 182, 212, 0.3)',
  },
  'synthwave-sunset': {
    id: 'synthwave-sunset',
    name: 'Synthwave',
    snakeHead: '#d946ef',
    snakeBodyStart: '#ec4899',
    snakeBodyEnd: '#8b5cf6',
    snakeGlow: 'rgba(217, 70, 239, 0.75)',
    snakeEye: '#ffffff',
    foodCore: '#eab308',
    foodAura: 'rgba(234, 179, 8, 0.85)',
    foodParticles: ['#eab308', '#facc15', '#fde047', '#f43f5e'],
    boardBg: '#0c0716',
    gridLine: 'rgba(255, 255, 255, 0.04)',
    borderGlow: 'rgba(217, 70, 239, 0.3)',
  },
};
