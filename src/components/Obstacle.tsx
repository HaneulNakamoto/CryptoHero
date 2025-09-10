import React from 'react';
import { ObstacleType } from '../types/game';

interface ObstacleProps {
  obstacle: ObstacleType;
}

const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
  return (
    <div
      className="absolute"
      style={{
        left: `${obstacle.x}px`,
        top: `${obstacle.y}px`,
        width: `${obstacle.width}px`,
        height: `${obstacle.height}px`
      }}
    >
      {obstacle.type === 'spike' ? (
        <div className="relative w-full h-full">
          {/* Spike base */}
          <div className="absolute bottom-0 w-full h-4 bg-gray-700 border-2 border-gray-900" />
          {/* Spike points */}
          <div className="absolute bottom-4 left-1 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-600" />
          <div className="absolute bottom-4 left-6 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-600" />
          <div className="absolute bottom-4 right-6 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-600" />
          <div className="absolute bottom-4 right-1 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-600" />
        </div>
      ) : (
        <div className="relative w-full h-full">
          {/* Block obstacle */}
          <div className="w-full h-full bg-gray-600 border-4 border-gray-800">
            {/* Pixel pattern */}
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-1 p-1">
              {[...Array(9)].map((_, i) => (
                <div key={i} className={`w-full h-full ${i % 2 === 0 ? 'bg-gray-500' : 'bg-gray-700'}`} />
              ))}
            </div>
          </div>
          {/* Danger symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-red-500 border-2 border-red-700 flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Obstacle;
