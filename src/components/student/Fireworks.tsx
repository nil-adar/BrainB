
import React, { useEffect, useState, useRef } from 'react';

interface FireworksProps {
  show: boolean;
  onComplete?: () => void;
  duration?: number;
}

const Fireworks: React.FC<FireworksProps> = ({ 
  show, 
  onComplete, 
  duration = 3000 // Default duration: exactly 3 seconds
}) => {
  const [particles, setParticles] = useState<Array<{ 
    id: number; 
    color: string; 
    x: number; 
    y: number; 
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
  }>>([]);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup function to ensure everything gets reset
  const cleanupFireworks = () => {
    console.log("Cleaning up fireworks");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsActive(false);
    setParticles([]);
    if (onComplete) onComplete();
  };
  
  // Reset when show changes to false
  useEffect(() => {
    if (!show) {
      cleanupFireworks();
    }
  }, [show]);
  
  // Create fireworks when show becomes true with guaranteed cleanup
  useEffect(() => {
    if (show && !isActive) {
      console.log("Activating fireworks for exact duration:", duration, "ms");
      setIsActive(true);
      createFireworks();
      
      // Strict timeout to ensure fireworks are dismissed after exactly duration ms
      if (timerRef.current) clearTimeout(timerRef.current);
      
      timerRef.current = setTimeout(() => {
        console.log("Duration timeout reached, cleaning up fireworks");
        cleanupFireworks();
      }, duration);
    }
    
    // Guaranteed cleanup when component unmounts
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [show, duration, isActive]);
  
  const createFireworks = () => {
    // Consistent purple theme colors
    const colors = [
      '#8B5CF6', // Main purple - primary color
      '#A78BFA', // Light purple
      '#9b87f5', // Another purple shade
      '#7C3AED', // Indigo
      '#C4B5FD', // Lighter purple
      '#4F46E5', // Indigo
      '#6366F1', // Lighter indigo
      '#A855F7', // Purple
      '#D946EF', // Pink
      '#8B5CF6', // Repeat main purple
      '#9333EA'  // Another purple shade
    ];
    
    // Create firework bursts with staggered timing
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        if (!isActive) return;
        
        const burstX = Math.random() * 80 + 10;
        const burstY = Math.random() * 60 + 10;
        const particleCount = Math.floor(Math.random() * 30) + 50;
        
        // Create particles for this burst
        const burstParticles = Array.from({ length: particleCount }, (_, id) => ({
          id: Date.now() + id + i * 1000,
          color: colors[Math.floor(Math.random() * colors.length)],
          x: burstX,
          y: burstY,
          // Increased particle size by 50% for better visibility
          size: (Math.random() * 8 + 3) * 1.5,
          speedX: (Math.random() - 0.5) * 6,
          speedY: (Math.random() - 0.5) * 6,
          opacity: 1
        }));
        
        setParticles(prev => {
          if (!isActive) return prev;
          return [...prev, ...burstParticles];
        });
        
        // Remove particles after animation
        setTimeout(() => {
          if (!isActive) return;
          setParticles(prev => prev.filter(p => !burstParticles.some(bp => bp.id === p.id)));
        }, 1500);
      }, i * 200);
    }
  };

  // Handle click to dismiss fireworks early
  const handleDismiss = () => {
    console.log("User manually dismissed fireworks");
    cleanupFireworks();
  };
  
  if (!isActive) return null;
  
  return (
    <div 
      className="fixed inset-0 z-[100] bg-black bg-opacity-30 cursor-pointer"
      onClick={handleDismiss}
    >
      {/* Celebration message - Increased text sizes */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h2 className="text-6xl font-bold text-white mb-4 animate-bounce shadow-lg">
          כל הכבוד! 🎉
        </h2>
        <p className="text-4xl text-white animate-pulse">
          סיימת את כל המשימות!
        </p>
        <button 
          className="mt-10 px-10 py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg text-2xl transition-colors duration-300"
          onClick={handleDismiss}
        >
          סגירה
        </button>
      </div>
      
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-firework"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            borderRadius: '50%',
            zIndex: 60,
            opacity: particle.opacity,
          }}
        />
      ))}
      
      <style>
        {`
          @keyframes firework {
            0% {
              transform: translate(0, 0);
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
            100% {
              transform: translate(
                calc(${(Math.random() - 0.5) * 200}px),
                calc(${(Math.random() - 0.5) * 200}px)
              );
              opacity: 0;
            }
          }
          .animate-firework {
            animation: firework 1.5s forwards cubic-bezier(0.12, 0.93, 0.55, 1);
          }
        `}
      </style>
    </div>
  );
};

export default Fireworks;