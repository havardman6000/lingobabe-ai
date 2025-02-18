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
  
  useEffect(() => {
    const loadAccessStatus = () => {
      if (!address || typeof window === 'undefined') return;
      
      const accessItems: AccessStatus[] = [];
      
      // Iterate through localStorage to find all access entries
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('character_access_' + address.toLowerCase())) {
          try {
            const accessData = JSON.parse(localStorage.getItem(key) || '');
            if (accessData && accessData.hasAccess && accessData.characterId) {
              accessItems.push(accessData);
            }
          } catch (e) {
            console.warn('Invalid access data format', e);
          }
        }
      }
      
      setAccessList(accessItems);
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