export type GameState = 'menu' | 'playing' | 'gameOver';

export interface ObstacleType {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'spike' | 'block';
}

export interface CoinType {
  id: number;
  x: number;
  y: number;
}

export interface PlayerState {
  x: number;
  y: number;
  velocityY: number;
  isJumping: boolean;
}
