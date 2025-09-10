import React, { useEffect } from 'react';
import Game from './components/Game';

function App() {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-b from-blue-400 to-blue-600">
      <Game />
    </div>
  );
}

export default App;
