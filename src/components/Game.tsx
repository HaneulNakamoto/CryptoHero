import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Coins, RotateCcw, Play, Pause } from 'lucide-react';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Obstacle extends GameObject {
  type: 'spike' | 'block';
}

interface Coin extends GameObject {
  collected: boolean;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 32;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const GAME_SPEED = 4;

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('cryptoHeroHighScore');
    return saved ? parseInt(saved) : 0;
  });
  
  const [player, setPlayer] = useState({
    x: 100,
    y: GAME_HEIGHT - 100,
    velocityY: 0,
    isJumping: false,
    isGrounded: true
  });

  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [gameDistance, setGameDistance] = useState(0);

  const gameLoopRef = useRef<number>();
  const lastObstacleRef = useRef(0);
  const lastCoinRef = useRef(0);

  const groundY = GAME_HEIGHT - 50;

  // Initialize game objects
  const initializeGame = useCallback(() => {
    setPlayer({
      x: 100,
      y: groundY - PLAYER_HEIGHT,
      velocityY: 0,
      isJumping: false,
      isGrounded: true
    });
    setObstacles([]);
    setCoins([]);
    setGameDistance(0);
    setScore(0);
    lastObstacleRef.current = 0;
    lastCoinRef.current = 0;
  }, [groundY]);

  // Jump function
  const jump = useCallback(() => {
    if (gameState === 'playing' && player.isGrounded) {
      setPlayer(prev => ({
        ...prev,
        velocityY: JUMP_FORCE,
        isJumping: true,
        isGrounded: false
      }));
    }
  }, [gameState, player.isGrounded]);

  // Handle input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameState === 'menu' || gameState === 'gameOver') {
          startGame();
        } else if (gameState === 'playing') {
          jump();
        }
      }
      if (e.code === 'Escape' && gameState === 'playing') {
        setGameState('paused');
      }
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (gameState === 'menu' || gameState === 'gameOver') {
        startGame();
      } else if (gameState === 'playing') {
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouch, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [gameState, jump]);

  // Collision detection
  const checkCollision = (rect1: GameObject, rect2: GameObject): boolean => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  // Start game
  const startGame = () => {
    initializeGame();
    setGameState('playing');
  };

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      setGameDistance(prev => prev + GAME_SPEED);
      
      // Update player physics
      setPlayer(prev => {
        let newY = prev.y + prev.velocityY;
        let newVelocityY = prev.velocityY + GRAVITY;
        let newIsGrounded = false;
        let newIsJumping = prev.isJumping;

        // Ground collision
        if (newY >= groundY - PLAYER_HEIGHT) {
          newY = groundY - PLAYER_HEIGHT;
          newVelocityY = 0;
          newIsGrounded = true;
          newIsJumping = false;
        }

        return {
          ...prev,
          y: newY,
          velocityY: newVelocityY,
          isGrounded: newIsGrounded,
          isJumping: newIsJumping
        };
      });

      // Generate obstacles
      setObstacles(prev => {
        const newObstacles = [...prev];
        
        if (gameDistance - lastObstacleRef.current > 200 + Math.random() * 300) {
          const obstacleType = Math.random() > 0.5 ? 'spike' : 'block';
          const height = obstacleType === 'spike' ? 30 : 40;
          
          newObstacles.push({
            x: GAME_WIDTH,
            y: groundY - height,
            width: 30,
            height: height,
            type: obstacleType
          });
          
          lastObstacleRef.current = gameDistance;
        }

        // Move and filter obstacles
        return newObstacles
          .map(obstacle => ({ ...obstacle, x: obstacle.x - GAME_SPEED }))
          .filter(obstacle => obstacle.x > -50);
      });

      // Generate coins
      setCoins(prev => {
        const newCoins = [...prev];
        
        if (gameDistance - lastCoinRef.current > 150 + Math.random() * 200) {
          newCoins.push({
            x: GAME_WIDTH,
            y: groundY - 80 - Math.random() * 100,
            width: 20,
            height: 20,
            collected: false
          });
          
          lastCoinRef.current = gameDistance;
        }

        // Move and filter coins
        return newCoins
          .map(coin => ({ ...coin, x: coin.x - GAME_SPEED }))
          .filter(coin => coin.x > -30);
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameDistance, groundY]);

  // Check collisions
  useEffect(() => {
    if (gameState !== 'playing') return;

    const playerRect = {
      x: player.x,
      y: player.y,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT
    };

    // Check obstacle collisions
    for (const obstacle of obstacles) {
      if (checkCollision(playerRect, obstacle)) {
        setGameState('gameOver');
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('cryptoHeroHighScore', score.toString());
        }
        return;
      }
    }

    // Check coin collisions
    setCoins(prev => {
      let newScore = score;
      const newCoins = prev.map(coin => {
        if (!coin.collected && checkCollision(playerRect, coin)) {
          newScore += 10;
          return { ...coin, collected: true };
        }
        return coin;
      });
      
      if (newScore !== score) {
        setScore(newScore);
      }
      
      return newCoins.filter(coin => !coin.collected);
    });
  }, [player, obstacles, coins, score, highScore, gameState]);

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    initializeGame();
    setGameState('menu');
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-600 overflow-hidden">
      {/* Game Canvas */}
      <div 
        className="relative bg-gradient-to-b from-sky-300 to-blue-400 border-4 border-purple-600 rounded-lg shadow-2xl overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Clouds */}
          <div className="absolute top-10 left-20 w-16 h-8 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-16 left-32 w-12 h-6 bg-white rounded-full opacity-60"></div>
          <div className="absolute top-8 right-40 w-20 h-10 bg-white rounded-full opacity-70"></div>
          
          {/* Ground */}
          <div 
            className="absolute bottom-0 w-full bg-gradient-to-t from-green-600 to-green-400"
            style={{ height: GAME_HEIGHT - groundY }}
          >
            <div className="absolute top-0 w-full h-2 bg-green-700"></div>
          </div>
        </div>

        {/* Player */}
        <div
          className="absolute transition-all duration-75 ease-out"
          style={{
            left: player.x,
            top: player.y,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT
          }}
        >
          <div className="w-full h-full bg-gradient-to-b from-purple-400 to-purple-600 rounded-lg border-2 border-purple-800 flex items-center justify-center">
            <div className="text-white text-xs font-bold">₿</div>
          </div>
        </div>

        {/* Obstacles */}
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            className={`absolute ${
              obstacle.type === 'spike' 
                ? 'bg-gradient-to-t from-red-600 to-red-400' 
                : 'bg-gradient-to-b from-gray-600 to-gray-800'
            } ${
              obstacle.type === 'spike' 
                ? 'clip-path-triangle' 
                : 'rounded-sm'
            } border-2 ${
              obstacle.type === 'spike' 
                ? 'border-red-800' 
                : 'border-gray-900'
            }`}
            style={{
              left: obstacle.x,
              top: obstacle.y,
              width: obstacle.width,
              height: obstacle.height
            }}
          />
        ))}

        {/* Coins */}
        {coins.map((coin, index) => (
          <div
            key={index}
            className="absolute bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border-2 border-yellow-600 flex items-center justify-center animate-pulse"
            style={{
              left: coin.x,
              top: coin.y,
              width: coin.width,
              height: coin.height
            }}
          >
            <Coins className="w-3 h-3 text-yellow-800" />
          </div>
        ))}

        {/* UI Overlay */}
        <div className="absolute top-4 left-4 text-white font-bold text-lg drop-shadow-lg">
          Score: {score}
        </div>
        <div className="absolute top-4 right-4 text-white font-bold text-lg drop-shadow-lg">
          Best: {highScore}
        </div>

        {gameState === 'playing' && (
          <button
            onClick={togglePause}
            className="absolute top-4 right-20 text-white hover:text-yellow-300 transition-colors"
          >
            <Pause className="w-6 h-6" />
          </button>
        )}

        {/* Game States */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                CRYPTO HERO
              </h1>
              <p className="text-lg mb-6">Tap or press SPACE to jump!</p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <Play className="w-5 h-5" />
                START GAME
              </button>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">PAUSED</h2>
              <button
                onClick={togglePause}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <Play className="w-5 h-5" />
                RESUME
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4 text-red-400">GAME OVER</h2>
              <p className="text-xl mb-2">Score: {score}</p>
              <p className="text-lg mb-6">Best: {highScore}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  PLAY AGAIN
                </button>
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  MENU
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center text-sm opacity-75 md:hidden">
        Tap anywhere to jump
      </div>
    </div>
  );
};

export default Game;
