// src/components/ChatInterface/SceneTransition.tsx

import React, { useEffect } from 'react';

interface SceneTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  onComplete?: () => void;
}

export const SceneTransition = ({ 
  children, 
  isVisible, 
  onComplete 
}: SceneTransitionProps) => {
  useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(onComplete, 500); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      } w-full max-w-md mx-auto rounded-lg overflow-hidden`}
    >
      {children}
    </div>
  );
};
// src/components/ChatInterface/SceneTransition.tsx