// src/components/AccessStatusDisplay/index.tsx
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/components/providers/web3-provider';
import { characters } from '@/data/characters';
import { AccessStatus } from '@/types/accessStatus';

interface AccessStatusDisplayProps {
  className?: string;
}

const AccessStatusDisplay: React.FC<AccessStatusDisplayProps> = ({ 
  className = ''
}) => {
  const { address } = useWeb3();
  const [accessList, setAccessList] = useState<AccessStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadAccessStatus = async () => {
      if (!address || typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      const accessItems: AccessStatus[] = [];
      
      try {
        // First verify accesses through contract if token manager is available
        if (window.tokenManager?.initialized) {
          // Get all character IDs
          const characterIds = Object.keys(characters);
          
          for (const characterId of characterIds) {
            try {
              const accessResult = await window.tokenManager.checkAccess(characterId);
              if (accessResult.hasAccess) {
                accessItems.push({
                  hasAccess: true,
                  characterId,
                  accessGranted: accessResult.accessGranted || Date.now()
                });
              }
            } catch (error) {
              console.warn(`Failed to check access for ${characterId}:`, error);
              // Skip this character if there's an error
            }
          }
        } else {
          // Fallback to localStorage if token manager isn't available
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('character_access_' + address.toLowerCase())) {
              try {
                const accessData = JSON.parse(localStorage.getItem(key) || '');
                if (accessData && accessData.hasAccess && accessData.characterId) {
                  // Double-verify this character id is valid
                  if (accessData.characterId in characters) {
                    accessItems.push(accessData);
                  } else {
                    // Remove invalid entries
                    localStorage.removeItem(key);
                  }
                }
              } catch (e) {
                console.warn('Invalid access data format', e);
                // Remove corrupted entries
                localStorage.removeItem(key);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading access status:', error);
      } finally {
        setAccessList(accessItems);
        setIsLoading(false);
      }
    };
    
    loadAccessStatus();
    
    // Event listeners for access changes
    const handleAccessChange = (event: Event) => {
      loadAccessStatus();
    };
    
    const handleChatCompleted = (event: Event) => {
      loadAccessStatus();
    };
    
    window.addEventListener('accessStatusChanged', handleAccessChange);
    window.addEventListener('chatCompleted', handleChatCompleted);
    
    return () => {
      window.removeEventListener('accessStatusChanged', handleAccessChange);
      window.removeEventListener('chatCompleted', handleChatCompleted);
    };
  }, [address]);
  
  if (isLoading) {
    return (
      <div className={`bg-gray-800 border border-gray-700 rounded-lg p-3 ${className}`}>
        <p className="text-gray-400 text-sm animate-pulse">Loading access status...</p>
      </div>
    );
  }
  
  if (accessList.length === 0) {
    return null;
  }
  
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-3 ${className}`}>
      <h3 className="text-sm font-medium text-white mb-2">Active Chat Access</h3>
      <ul className="space-y-1">
        {accessList.map(access => {
          const character = characters[access.characterId as keyof typeof characters];
          return (
            <li key={access.characterId} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-green-100">
                {character?.name || access.characterId}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AccessStatusDisplay;