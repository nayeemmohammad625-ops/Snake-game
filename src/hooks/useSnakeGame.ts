/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Direction, GameState, Point, Particle, FloatingText, Difficulty } from '../types/game';
import { sound } from '../utils/audio';
import { DIFFICULTIES, loadHighScore, saveHighScore } from '../utils/difficulty';
import { SNAKE_SKINS, loadSelectedSkinId, saveSelectedSkinId } from '../utils/skins';

interface UseSnakeGameProps {
  gridSize?: number;
  initialDifficulty?: Difficulty;
  initialSkinId?: string;
}

export function useSnakeGame({
  gridSize = 20,
  initialDifficulty = 'medium',
  initialSkinId,
}: UseSnakeGameProps = {}) {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [skinId, setSkinId] = useState<string>(() => initialSkinId || loadSelectedSkinId());
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => loadHighScore(initialDifficulty));
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [foodsEaten, setFoodsEaten] = useState<number>(0);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // Mutable refs for high-framerate rendering
  const snakeRef = useRef<Point[]>([
    { x: 6, y: 10 },
    { x: 5, y: 10 },
    { x: 4, y: 10 },
  ]);
  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionsQueueRef = useRef<Direction[]>([]);
  const foodRef = useRef<Point>({ x: 14, y: 10 });
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const lastTickTimeRef = useRef<number>(0);
  const foodPulseRef = useRef<number>(0);
  const tongueTimerRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // Difficulty parameters
  const diffConfig = DIFFICULTIES[difficulty];

  // Calculate current tick interval based on difficulty and foods eaten
  const currentInterval = Math.max(
    diffConfig.minIntervalMs,
    diffConfig.baseIntervalMs - Math.floor(foodsEaten / diffConfig.stepFoods) * diffConfig.decrMs
  );
  const currentIntervalRef = useRef<number>(currentInterval);
  currentIntervalRef.current = currentInterval;

  // Whenever difficulty changes, update high score display
  useEffect(() => {
    const loaded = loadHighScore(difficulty);
    setHighScore(loaded);
    setIsNewHighScore(false);
  }, [difficulty]);

  // Update skin helper
  const changeSkin = useCallback((newSkinId: string) => {
    if (SNAKE_SKINS[newSkinId]) {
      setSkinId(newSkinId);
      saveSelectedSkinId(newSkinId);
      sound.playButton();
    }
  }, []);

  // Update difficulty helper
  const changeDifficulty = useCallback((newDiff: Difficulty) => {
    setDifficulty(newDiff);
    const loaded = loadHighScore(newDiff);
    setHighScore(loaded);
    setIsNewHighScore(false);
    sound.playButton();
  }, []);

  // Sound mute toggle
  const toggleSound = useCallback(() => {
    const next = sound.toggleMute();
    setIsMuted(next);
  }, []);

  // Helper to place food on an empty cell
  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    const occupied = new Set(currentSnake.map((p) => `${p.x},${p.y}`));
    const emptyCells: Point[] = [];

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (!occupied.has(`${x},${y}`)) {
          emptyCells.push({ x, y });
        }
      }
    }

    if (emptyCells.length === 0) {
      return { x: 0, y: 0 };
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }, [gridSize]);

  // Create burst of particles at food coordinate
  const createFoodParticles = useCallback(
    (cellX: number, cellY: number, count = 20) => {
      const skin = SNAKE_SKINS[skinId] || SNAKE_SKINS['green-python'];
      const colors = skin.foodParticles;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1.5;
        particlesRef.current.push({
          x: cellX + 0.5,
          y: cellY + 0.5,
          vx: Math.cos(angle) * speed * 0.04,
          vy: Math.sin(angle) * speed * 0.04,
          radius: Math.random() * 0.18 + 0.08,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          life: 0,
          maxLife: 25 + Math.random() * 15,
        });
      }

      floatingTextsRef.current.push({
        id: Math.random().toString(),
        text: '+10',
        x: cellX + 0.5,
        y: cellY,
        alpha: 1,
        life: 0,
        color: '#fef08a',
      });
    },
    [skinId]
  );

  // Create death explosion particles
  const createDeathParticles = useCallback(
    (segments: Point[]) => {
      const skin = SNAKE_SKINS[skinId] || SNAKE_SKINS['green-python'];
      segments.forEach((seg, index) => {
        const count = index === 0 ? 22 : 6;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 3 + 1;
          particlesRef.current.push({
            x: seg.x + 0.5,
            y: seg.y + 0.5,
            vx: Math.cos(angle) * speed * 0.035,
            vy: Math.sin(angle) * speed * 0.035,
            radius: Math.random() * 0.2 + 0.06,
            color: index === 0 ? '#ffffff' : skin.headColor,
            alpha: 1,
            life: 0,
            maxLife: 35 + Math.random() * 20,
          });
        }
      });
    },
    [skinId]
  );

  // Start new game
  const startGame = useCallback(() => {
    sound.playButton();
    const initialSnake: Point[] = [
      { x: 6, y: 10 },
      { x: 5, y: 10 },
      { x: 4, y: 10 },
    ];
    snakeRef.current = initialSnake;
    directionRef.current = 'RIGHT';
    nextDirectionsQueueRef.current = [];
    foodRef.current = spawnFood(initialSnake);
    particlesRef.current = [];
    floatingTextsRef.current = [];
    lastTickTimeRef.current = performance.now();
    tongueTimerRef.current = 0;

    setScore(0);
    setFoodsEaten(0);
    setDirection('RIGHT');
    setIsNewHighScore(false);
    setGameState('PLAYING');
  }, [spawnFood]);

  // Pause game
  const pauseGame = useCallback(() => {
    if (gameState === 'PLAYING') {
      sound.playButton();
      setGameState('PAUSED');
    }
  }, [gameState]);

  // Resume game
  const resumeGame = useCallback(() => {
    if (gameState === 'PAUSED') {
      sound.playButton();
      lastTickTimeRef.current = performance.now();
      setGameState('PLAYING');
    }
  }, [gameState]);

  // Toggle pause
  const togglePause = useCallback(() => {
    if (gameState === 'PLAYING') {
      pauseGame();
    } else if (gameState === 'PAUSED') {
      resumeGame();
    }
  }, [gameState, pauseGame, resumeGame]);

  // Change direction with robust queue support & 180-degree reversal prevention
  const changeDirection = useCallback((newDir: Direction) => {
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };

    const queue = nextDirectionsQueueRef.current;
    // Compare against the very last queued direction, or the current direction if queue is empty
    const lastPendingDir = queue.length > 0 ? queue[queue.length - 1] : directionRef.current;

    // Disallow 180-degree immediate reversal or redundant repeat
    if (newDir !== lastPendingDir && newDir !== opposites[lastPendingDir]) {
      if (queue.length < 2) {
        queue.push(newDir);
        sound.playTurn();
      }
    }
  }, []);

  // Update Game Physics One Step
  const stepGame = useCallback(() => {
    if (nextDirectionsQueueRef.current.length > 0) {
      directionRef.current = nextDirectionsQueueRef.current.shift()!;
      setDirection(directionRef.current);
    }

    const currentHead = snakeRef.current[0];
    const dir = directionRef.current;

    const newHead: Point = {
      x: currentHead.x + (dir === 'RIGHT' ? 1 : dir === 'LEFT' ? -1 : 0),
      y: currentHead.y + (dir === 'DOWN' ? 1 : dir === 'UP' ? -1 : 0),
    };

    // 1. Check Wall Collision
    if (
      newHead.x < 0 ||
      newHead.x >= gridSize ||
      newHead.y < 0 ||
      newHead.y >= gridSize
    ) {
      handleGameOver();
      return;
    }

    // 2. Check Self Collision (ignoring very tail segment which moves)
    const bodyWithoutTail = snakeRef.current.slice(0, -1);
    const hasSelfCollision = bodyWithoutTail.some(
      (segment) => segment.x === newHead.x && segment.y === newHead.y
    );
    if (hasSelfCollision) {
      handleGameOver();
      return;
    }

    // 3. Check Food Collision
    const isEating = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
    const newSnake = [newHead, ...snakeRef.current];

    if (isEating) {
      const nextFoodsCount = foodsEaten + 1;
      const nextScore = score + 10;
      setScore(nextScore);
      setFoodsEaten(nextFoodsCount);

      sound.playEat(nextFoodsCount);
      createFoodParticles(newHead.x, newHead.y);

      // Check if speedup milestone reached for current difficulty
      if (nextFoodsCount % diffConfig.stepFoods === 0) {
        sound.playSpeedUp();
        floatingTextsRef.current.push({
          id: Math.random().toString(),
          text: 'SPEED UP!',
          x: newHead.x + 0.5,
          y: newHead.y - 0.5,
          alpha: 1,
          life: 0,
          color: '#38bdf8',
        });
      }

      // Check high score dynamically for this difficulty
      if (nextScore > highScore) {
        setHighScore(nextScore);
        setIsNewHighScore(true);
        saveHighScore(difficulty, nextScore);
      }

      foodRef.current = spawnFood(newSnake);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
  }, [
    gridSize,
    foodsEaten,
    score,
    highScore,
    difficulty,
    diffConfig,
    spawnFood,
    createFoodParticles,
  ]);

  const handleGameOver = useCallback(() => {
    sound.playGameOver();
    createDeathParticles(snakeRef.current);
    setGameState('GAME_OVER');

    setScore((currentScore) => {
      if (currentScore > highScore) {
        setHighScore(currentScore);
        setIsNewHighScore(true);
        saveHighScore(difficulty, currentScore);
      }
      return currentScore;
    });
  }, [highScore, difficulty, createDeathParticles]);

  // Main Loop
  useEffect(() => {
    let lastFrameTime = performance.now();

    const loop = (timestamp: number) => {
      const dt = timestamp - lastFrameTime;
      lastFrameTime = timestamp;

      foodPulseRef.current += dt * 0.005;
      tongueTimerRef.current = (tongueTimerRef.current + dt) % 2600;

      // Update particles
      if (particlesRef.current.length > 0) {
        particlesRef.current = particlesRef.current.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life++;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife);
          return p.life < p.maxLife;
        });
      }

      // Update floating texts
      if (floatingTextsRef.current.length > 0) {
        floatingTextsRef.current = floatingTextsRef.current.filter((ft) => {
          ft.y -= 0.02;
          ft.life++;
          ft.alpha = Math.max(0, 1 - ft.life / 35);
          return ft.life < 35;
        });
      }

      // Tick snake movement when PLAYING
      if (gameState === 'PLAYING') {
        const interval = currentIntervalRef.current;
        if (timestamp - lastTickTimeRef.current >= interval) {
          stepGame();
          lastTickTimeRef.current = timestamp;
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    animationFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [gameState, stepGame]);

  // Global Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.code === 'Space') {
        if (gameState === 'START' || gameState === 'GAME_OVER') {
          startGame();
        } else if (gameState === 'PLAYING') {
          pauseGame();
        } else if (gameState === 'PAUSED') {
          resumeGame();
        }
        return;
      }

      if (e.key === 'p' || e.key === 'P') {
        togglePause();
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        toggleSound();
        return;
      }

      if (gameState !== 'PLAYING') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'KeyW':
        case 'w':
        case 'W':
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 'KeyS':
        case 's':
        case 'S':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'KeyA':
        case 'a':
        case 'A':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'KeyD':
        case 'd':
        case 'D':
          changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, startGame, pauseGame, resumeGame, togglePause, toggleSound, changeDirection]);

  return {
    gameState,
    difficulty,
    skinId,
    score,
    highScore,
    isNewHighScore,
    foodsEaten,
    direction,
    isMuted,
    currentInterval,
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
  };
}
