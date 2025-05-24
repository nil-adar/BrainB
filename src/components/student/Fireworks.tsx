
import React, { useEffect } from 'react';

interface FireworksProps {
  show: boolean;
  onComplete: () => void;
  duration?: number;
  onReset?: () => void;  // New prop for resetting tasks
}

const Fireworks: React.FC<FireworksProps> = ({ 
  show, 
  onComplete,
  duration = 3000,
  onReset,  // New prop for resetting tasks
}) => {
  useEffect(() => {
    if (show) {
      console.log(`Fireworks showing, will hide after ${duration}ms`);
      const timer = setTimeout(() => {
        console.log('Fireworks timeout completed, calling onComplete');
        onComplete();
        
        // Call onReset after a small delay to ensure the fireworks are hidden first
        if (onReset) {
          console.log('Resetting tasks after fireworks');
          setTimeout(onReset, 500);
        }
      }, duration);
      
      return () => {
        console.log('Cleaning up fireworks timer');
        clearTimeout(timer);
      };
    }
  }, [show, onComplete, duration, onReset]);
  
  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ animation: `fadeInOut ${duration}ms ease-in-out` }}
      onClick={onComplete}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="pyro">
          <div className="before"></div>
          <div className="after"></div>
        </div>
        
        {/* CSS inline for the fireworks animation */}
        <style dangerouslySetInnerHTML={{ __html: `
          .pyro {
            position: absolute;
            inset: 0;
            z-index: 10;
          }
          
          .pyro > .before, .pyro > .after {
            position: absolute;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            box-shadow: 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff;
            animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;
          }
          
          .pyro > .after {
            animation-delay: 1.25s, 1.25s, 1.25s;
            animation-duration: 1.25s, 1.25s, 6.25s;
          }
          
          @keyframes bang {
            to {
              box-shadow: -70px -115.67px #00ff73, -28px -99.67px #ff006e, -58px -31.67px #ff006a, 24px -30.67px #ff8000, -92px -7.67px #9dff00, -14px -142.67px #00ffa2, -72px -4.67px #ffb300;
            }
          }
          
          @keyframes gravity {
            to {
              transform: translateY(200px);
              opacity: 0;
            }
          }
          
          @keyframes position {
            0%, 19.9% {
              margin-top: 10%;
              margin-left: 40%;
            }
            20%, 39.9% {
              margin-top: 40%;
              margin-left: 30%;
            }
            40%, 59.9% {
              margin-top: 20%;
              margin-left: 70%;
            }
            60%, 79.9% {
              margin-top: 30%;
              margin-left: 20%;
            }
            80%, 99.9% {
              margin-top: 30%;
              margin-left: 80%;
            }
          }
          
          @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}} />
      </div>
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl py-6 px-10 shadow-2xl">
        <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          Great Job!
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-300 mt-2">
          You've completed all your tasks!
        </p>
      </div>
    </div>
  );
};

export default Fireworks;   