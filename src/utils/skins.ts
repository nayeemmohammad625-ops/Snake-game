/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeSkin } from '../types/game';

export const SNAKE_SKINS: Record<string, SnakeSkin> = {
  'green-python': {
    id: 'green-python',
    name: 'Green Python',
    subtitle: 'Jungle Apex Predator',
    description: 'Emerald scales with yellow underbelly flecks, amber slit eyes, and a flicking scarlet tongue.',
    headColor: '#16a34a',
    bodyColors: ['#22c55e', '#16a34a', '#15803d', '#166534'],
    accentColor: '#facc15',
    glowColor: 'rgba(34, 197, 94, 0.45)',
    eyeType: 'slit',
    eyeColor: '#fef08a',
    pupilColor: '#1c1917',
    tongueColor: '#ef4444',
    patternType: 'scales',
    foodParticles: ['#ef4444', '#f87171', '#fca5a5'],
  },
  'red-cobra': {
    id: 'red-cobra',
    name: 'Red Cobra',
    subtitle: 'Venomous Hooded Striker',
    description: 'Fiery crimson and volcanic obsidian banded body with piercing predatory eyes.',
    headColor: '#dc2626',
    bodyColors: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b'],
    accentColor: '#f97316',
    glowColor: 'rgba(239, 68, 68, 0.55)',
    eyeType: 'slit',
    eyeColor: '#fef08a',
    pupilColor: '#000000',
    tongueColor: '#991b1b',
    patternType: 'banded',
    foodParticles: ['#f97316', '#fb923c', '#fdba74'],
  },
  'blue-viper': {
    id: 'blue-viper',
    name: 'Blue Viper',
    subtitle: 'Glacial Deep Sea Hunter',
    description: 'Electric sapphire scales with geometric diamond dorsal patterns and icy crystal gaze.',
    headColor: '#0284c7',
    bodyColors: ['#38bdf8', '#0ea5e9', '#0284c7', '#0369a1'],
    accentColor: '#67e8f9',
    glowColor: 'rgba(14, 165, 233, 0.55)',
    eyeType: 'slit',
    eyeColor: '#e0f2fe',
    pupilColor: '#082f49',
    tongueColor: '#06b6d4',
    patternType: 'diamonds',
    foodParticles: ['#38bdf8', '#7dd3fc', '#bae6fd'],
  },
  'golden-snake': {
    id: 'golden-snake',
    name: 'Golden Snake',
    subtitle: 'Mythic Emperor Serpent',
    description: 'Lustrous polished 24K gold segments with ruby gem eyes and shimmering royal radiance.',
    headColor: '#eab308',
    bodyColors: ['#facc15', '#eab308', '#ca8a04', '#a16207'],
    accentColor: '#fef08a',
    glowColor: 'rgba(234, 179, 8, 0.6)',
    eyeType: 'gem',
    eyeColor: '#f43f5e',
    pupilColor: '#ffffff',
    tongueColor: '#eab308',
    patternType: 'scales',
    foodParticles: ['#facc15', '#fde047', '#fef08a'],
  },
  'rainbow-snake': {
    id: 'rainbow-snake',
    name: 'Rainbow Snake',
    subtitle: 'Prismatic Astral Weaver',
    description: 'Shifting dynamic spectrum that sweeps across every segment with celestial sparkle eyes.',
    headColor: '#ec4899',
    bodyColors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899'],
    accentColor: '#ffffff',
    glowColor: 'rgba(236, 72, 153, 0.55)',
    eyeType: 'prismatic',
    eyeColor: '#ffffff',
    pupilColor: '#1e1b4b',
    tongueColor: '#f43f5e',
    patternType: 'rainbow',
    foodParticles: ['#f43f5e', '#38bdf8', '#a855f7', '#22c55e', '#eab308'],
  },
  'neon-snake': {
    id: 'neon-snake',
    name: 'Neon Snake',
    subtitle: 'Cyberpunk Grid Runner',
    description: 'High-voltage electric lime glow with futuristic cybernetic visor optics.',
    headColor: '#22c55e',
    bodyColors: ['#4ade80', '#22c55e', '#10b981', '#059669'],
    accentColor: '#86efac',
    glowColor: 'rgba(34, 197, 94, 0.75)',
    eyeType: 'visor',
    eyeColor: '#86efac',
    pupilColor: '#ffffff',
    tongueColor: '#4ade80',
    patternType: 'cyber',
    foodParticles: ['#4ade80', '#86efac', '#bbf7d0'],
  },
};

export const SKINS_LIST: SnakeSkin[] = Object.values(SNAKE_SKINS);

export function loadSelectedSkinId(): string {
  if (typeof window === 'undefined') return 'green-python';
  try {
    const saved = localStorage.getItem('neon_snake_selected_skin');
    if (saved && SNAKE_SKINS[saved]) {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'green-python';
}

export function saveSelectedSkinId(skinId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('neon_snake_selected_skin', skinId);
  } catch {
    // ignore
  }
}
