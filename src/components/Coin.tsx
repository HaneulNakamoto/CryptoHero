import React from 'react';
import { CoinType } from '../types/game';

interface CoinProps {
  coin: CoinType;
}

const Coin: React.FC<CoinProps> = ({ coin }) => {
  return (
    <div
      className="absolute animate-bounce"
      style={{
        left: `${coin.x}px`,
        top: `${coin.y}px`,
        width: '32px',
        height: '32px'
      }}
    >
      {/* Crypto Coin - Pixel Art Style */}
      <div className="relative w-8 h-8">
        {/* Outer ring */}
        <div className="absolute inset-0 bg-yellow-400 border-2 border-yellow-600 rounded-full" />
        
        {/* Inner circle */}
        <div className="absolute inset-1 bg-yellow-300 border border-yellow-500 rounded-full" />
        
        {/* Bitcoin symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-orange-800 text-sm font-bold">₿</span>
        </div>
        
        {/* Shine effect */}
        <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-100 rounded-full opacity-75" />
        
        {/* Sparkle particles */}
        <div className="absolute -top-1 -right-1 w-1 h-1 bg-white animate-ping" />
        <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-white animate-ping" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  );
};

export default Coin;
