/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import { GameBoard } from './components/GameBoard';
import { HeaderHUD } from './components/HeaderHUD';
import { StartModal } from './components/StartModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { ChooseSnakeModal } from './components/ChooseSnakeModal';
import { SettingsModal } from './components/SettingsModal';
import { VirtualDPad } from './components/VirtualDPad';
import { SNAKE_SKINS } from './utils/skins';
import { Difficulty, UserControlSettings } from './types/game';
import { useOnlineStatus } from './hooks/useOnlineStatus';

const DEFAULT_CONTROLS: UserControlSettings = {
  controlMode: 'both',
  dPadSize: 'large',
  dPadAlignment: 'center',
};

export default function App() {
  const [isChooseSnakeOpen, setIsChooseSnakeOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // User control settings with persistence
  const [controls, setControls] = useState<UserControlSettings>(() => {
    try {
      const saved = localStorage.getItem('neon_snake_control_settings');
      if (saved) {
        return { ...DEFAULT_CONTROLS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONTROLS;
  });

  const handleUpdateControls = (updated: Partial<UserControlSettings>) => {
    setControls((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('neon_snake_control_settings', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const {
    gameState,
    difficulty,
    skinId,
    score,
    highScore,
    isNewHighScore,
    foodsEaten,
    direction,
    isMuted,
    snakeRef,
    foodRef,
    particlesRef,
    floatingTextsRef,
    foodPulseRef,
    tongueTimerRef,
    startGame,
    pauseGame,
    resumeGame,
    togglePause,
    toggleSound,
    changeDirection,
    changeDifficulty,
    changeSkin,
  } = useSnakeGame({
    gridSize: 20,
    initialDifficulty: 'easy', // Slow and relaxing base speed
  });

  const currentSkin = SNAKE_SKINS[skinId] || SNAKE_SKINS['green-python'];

  // Global screen-wide touch swipe listener (short, light swipe anywhere on screen)
  const screenTouchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (controls.controlMode === 'dpad') return;
      if (isChooseSnakeOpen || isSettingsOpen) return;

      // Ignore touches if interacting with buttons or modal overlays
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('[role="dialog"]')) {
        return;
      }

      if (e.touches.length === 1) {
        screenTouchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (controls.controlMode === 'dpad' || !screenTouchStartRef.current) return;
      if (gameState !== 'PLAYING') return;

      const touchEnd = e.changedTouches[0];
      const dx = touchEnd.clientX - screenTouchStartRef.current.x;
      const dy = touchEnd.clientY - screenTouchStartRef.current.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // Light, short swipe threshold: 16px
      const minSwipeDistance = 16;

      if (Math.max(absX, absY) >= minSwipeDistance) {
        if (absX > absY) {
          changeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
        } else {
          changeDirection(dy > 0 ? 'DOWN' : 'UP');
        }
      }
      screenTouchStartRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState, controls.controlMode, isChooseSnakeOpen, isSettingsOpen, changeDirection]);

  // Prevent page scrolling/bouncing while playing
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (gameState === 'PLAYING') {
        e.preventDefault();
      }
    };

    window.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [gameState]);

  // Board tap action: tap to start or pause
  const handleBoardTap = () => {
    if (gameState === 'PLAYING') {
      pauseGame();
    } else if (gameState === 'PAUSED') {
      resumeGame();
    } else if (gameState === 'START' || gameState === 'GAME_OVER') {
      startGame();
    }
  };

  const handleOpenChooseSnake = () => {
    if (gameState === 'PLAYING') pauseGame();
    setIsChooseSnakeOpen(true);
  };

  const handleOpenSettings = () => {
    if (gameState === 'PLAYING') pauseGame();
    setIsSettingsOpen(true);
  };

  const handleResetHighScores = () => {
    try {
      localStorage.removeItem('neon_snake_hs_easy');
      localStorage.removeItem('neon_snake_hs_medium');
      localStorage.removeItem('neon_snake_hs_hard');
      window.location.reload();
    } catch {
      // ignore
    }
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isChooseSnakeOpen) setIsChooseSnakeOpen(false);
        if (isSettingsOpen) setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChooseSnakeOpen, isSettingsOpen]);

  const isOnline = useOnlineStatus();

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#060a12] text-slate-100 selection:bg-emerald-500/30 font-sans select-none overflow-x-hidden">
      {/* Offline Status Notice */}
      {!isOnline && (
        <div className="w-full py-1 px-3 bg-amber-500/20 border-b border-amber-500/30 text-amber-300 text-[11px] font-semibold text-center flex items-center justify-center gap-1.5 animate-in fade-in">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Offline Mode — Game files are cached and fully playable without internet!</span>
        </div>
      )}

      {/* Top Header & HUD */}
      <HeaderHUD
        score={score}
        highScore={highScore}
        gameState={gameState}
        difficulty={difficulty}
        currentSkin={currentSkin}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        onTogglePause={togglePause}
        onOpenChooseSnake={handleOpenChooseSnake}
        onOpenSettings={handleOpenSettings}
      />

      {/* Main Play Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-2 sm:p-4 max-w-4xl mx-auto">
        <div className="relative w-full flex flex-col items-center">
          {/* Game Canvas Container */}
          <GameBoard
            gridSize={20}
            skinId={skinId}
            snakeRef={snakeRef}
            foodRef={foodRef}
            particlesRef={particlesRef}
            floatingTextsRef={floatingTextsRef}
            foodPulseRef={foodPulseRef}
            tongueTimerRef={tongueTimerRef}
            currentDirection={direction}
            onSwipe={changeDirection}
            onTap={handleBoardTap}
            isPaused={gameState === 'PAUSED'}
            isGameOver={gameState === 'GAME_OVER'}
          />

          {/* Overlays */}
          {gameState === 'START' && (
            <StartModal
              difficulty={difficulty}
              onChangeDifficulty={(diff: Difficulty) => changeDifficulty(diff)}
              highScore={highScore}
              currentSkin={currentSkin}
              onOpenChooseSnake={handleOpenChooseSnake}
              onOpenSettings={handleOpenSettings}
              isMuted={isMuted}
              onToggleSound={toggleSound}
              onStart={startGame}
            />
          )}

          {gameState === 'PAUSED' && (
            <PauseModal
              score={score}
              foodsEaten={foodsEaten}
              difficulty={difficulty}
              currentSkin={currentSkin}
              onResume={resumeGame}
              onRestart={startGame}
              onOpenChooseSnake={handleOpenChooseSnake}
              onChangeDifficulty={(diff: Difficulty) => changeDifficulty(diff)}
              onOpenSettings={handleOpenSettings}
            />
          )}

          {gameState === 'GAME_OVER' && (
            <GameOverModal
              score={score}
              highScore={highScore}
              isNewHighScore={isNewHighScore}
              foodsEaten={foodsEaten}
              difficulty={difficulty}
              currentSkin={currentSkin}
              onRestart={startGame}
              onOpenChooseSnake={handleOpenChooseSnake}
              onChangeDifficulty={(diff: Difficulty) => changeDifficulty(diff)}
              onOpenSettings={handleOpenSettings}
            />
          )}
        </div>

        {/* Mobile Big Touch-Friendly D-Pad Controls */}
        {controls.controlMode !== 'swipe' && (
          <div className="w-full mt-2 flex justify-center">
            <VirtualDPad
              onDirection={changeDirection}
              disabled={gameState !== 'PLAYING'}
              size={controls.dPadSize}
              alignment={controls.dPadAlignment}
            />
          </div>
        )}

        {/* Bottom Helper Bar */}
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
          {/* Desktop Controls Guide */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">W</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">A</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">S</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">D</kbd>
            </div>
            <span>or Arrows to move</span>
          </div>

          <span aria-hidden="true" className="hidden md:inline text-slate-600">·</span>

          <div className="hidden md:flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Space</kbd>
            <span>Pause / Resume</span>
          </div>

          <span aria-hidden="true" className="hidden md:inline text-slate-600">·</span>

          {/* Quick Settings Link */}
          <button
            type="button"
            onClick={handleOpenSettings}
            className="text-[11px] text-slate-400 hover:text-slate-200 underline decoration-slate-700 underline-offset-2 transition-colors cursor-pointer"
          >
            Adjust Controls & Size
          </button>
        </div>
      </main>

      {/* Choose Snake Screen Modal */}
      <ChooseSnakeModal
        isOpen={isChooseSnakeOpen}
        onClose={() => setIsChooseSnakeOpen(false)}
        selectedSkinId={skinId}
        onSelectSkin={(newSkinId) => changeSkin(newSkinId)}
      />

      {/* Controls & Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        controls={controls}
        onChangeControls={handleUpdateControls}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        onResetHighScores={handleResetHighScores}
      />
    </div>
  );
}
