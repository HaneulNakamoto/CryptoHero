import React from 'react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="text-center text-white p-8 bg-gray-900 border-4 border-purple-500 rounded-lg max-w-md mx-4">
        <h2 className="text-4xl font-bold mb-4 pixel-font text-red-400">
          GAME OVER
        </h2>
        
        <div className="mb-6">
          <div className="text-2xl font-bold pixel-font text-yellow-400 mb-2">
            Final Score
          </div>
          <div className="text-5xl font-bold pixel-font text-white">
            {score}
          </div>
        </div>
        
        <div className="mb-6 text-gray-300 pixel-font">
          {score > 1000 ? "🏆 Crypto Legend!" : 
           score > 500 ? "💎 Diamond Hands!" : 
           score > 200 ? "🚀 To the Moon!" : 
           "📈 Keep HODLing!"}
        </div>
        
        <button
          onClick={onRestart}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 border-2 border-purple-800 pixel-font text-xl transition-colors duration-200"
        >
          PLAY AGAIN
        </button>
        
        <div className="mt-4 text-sm text-gray-400 pixel-font">
          Tap anywhere to restart
        </div>
      </div>
      
      <style jsx>{`
        .pixel-font {
          font-family: 'Courier New', monospace;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
};

export default GameOver;
