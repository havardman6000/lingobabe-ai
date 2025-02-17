import { useState, useEffect } from 'react';

const INITIAL_HAPPINESS = 50;
const HAPPINESS_KEY_PREFIX = 'happiness_points_';
export const HappinessTracker = ({ 
  characterId, 
  address,
  initialPoints = INITIAL_HAPPINESS,
  className = ''
}: {
  characterId: string;
  address: string;
  initialPoints?: number;
  className?: string;
}) => {
  const [points, setPoints] = useState(initialPoints);
  const [showAnimation, setShowAnimation] = useState(false);
  const [delta, setDelta] = useState(0);

  const getStorageKey = () => {
    if (!address || !characterId) return null;
    return `${HAPPINESS_KEY_PREFIX}${characterId}_${address.toLowerCase()}`;
  };

  useEffect(() => {
    const key = getStorageKey();
    if (key) {
      const stored = localStorage.getItem(key);
      if (stored) {
        setPoints(parseInt(stored));
      } else {
        localStorage.setItem(key, INITIAL_HAPPINESS.toString());
      }
    }
  }, [address, characterId]);

  const updatePoints = (newPoints: number) => {
    const key = getStorageKey();
    if (!key) return;

    const pointDelta = newPoints - points;
    setDelta(pointDelta);
    setShowAnimation(true);
    
    const updatedPoints = Math.min(100, Math.max(0, newPoints));
    setPoints(updatedPoints);
    localStorage.setItem(key, updatedPoints.toString());

    setTimeout(() => setShowAnimation(false), 1000);
  };

  const getStatusColor = () => {
    if (points >= 80) return 'text-green-500';
    if (points >= 60) return 'text-blue-500';
    if (points >= 40) return 'text-yellow-500';
    if (points >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 bg-gray-800/80 px-4 py-2 rounded-lg">
        <span className="text-gray-300">Happiness Level:</span>
        <span className={`font-bold ${getStatusColor()} ${showAnimation ? 'animate-pulse' : ''}`}>
          {points}/100
        </span>
      </div>
      
      {showAnimation && delta !== 0 && (
        <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 
          ${delta > 0 ? 'text-green-500' : 'text-red-500'} 
          animate-bounce font-bold`}>
          {delta > 0 ? `+${delta}` : delta}
        </div>
      )}
    </div>
  );
};

export default HappinessTracker;
//src/components/EnhancedHappinessTracker/index.tsx