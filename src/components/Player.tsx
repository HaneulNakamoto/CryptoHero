import React from 'react';

interface PlayerProps {
  x: number;
  y: number;
  isJumping: boolean;
}

const Player: React.FC<PlayerProps> = ({ x, y, isJumping }) => {
  return (
    <div
      className="absolute transition-transform duration-100"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: isJumping ? 'rotate(-10deg)' : 'rotate(0deg)'
      }}
    >
      {/* Crypto Hero Character - Pixel Art Style */}
      <div className="relative w-12 h-12">
        {/* Body */}
        <div className="absolute inset-0 bg-purple-500 border-2 border-purple-700" 
             style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }} />
        
        {/* Face */}
        <div className="absolute top-1 left-1 w-10 h-6 bg-yellow-300 border border-yellow-500" />
        
        {/* Eyes */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-black" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-black" />
        
        {/* Bitcoin Symbol */}
        <div className="absolute top-6 left-3 w-6 h-4 bg-yellow-400 border border-yellow-600 flex items-center justify-center">
          <span className="text-xs font-bold text-orange-800">₿</span>
        </div>
        
        {/* Arms */}
        <div className="absolute top-4 -left-1 w-2 h-4 bg-purple-400" />
        <div className="absolute top-4 -right-1 w-2 h-4 bg-purple-400" />
        
        {/* Legs */}
        <div className="absolute top-10 left-2 w-2 h-4 bg-blue-600" />
        <div className="absolute top-10 right-2 w-2 h-4 bg-blue-600" />
        
        {/* Cape effect when jumping */}
        {isJumping && (
          <div className="absolute -top-1 -left-2 w-3 h-8 bg-red-500 opacity-75 transform -rotate-12" />
        )}
        
        {/* Particle effects */}
        <div className="absolute -top-2 left-6 w-1 h-1 bg-yellow-400 animate-ping" />
        <div className="absolute top-1 -left-2 w-1 h-1 bg-blue-400 animate-ping" style={{ animationDelay: '0.5s' }} />
      </div>
    </div>
  );
};

export default Player;
