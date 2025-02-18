// src/components/MessageUsageDisplay/index.tsx
import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../providers/web3-provider';

// Define the interface inline 
interface MessageStats {
  messagesUsed: number;
  messagesRemaining: number;
  packagesPurchased: number;
  lastPurchaseTimestamp?: number;
  lastUpdated?: number;
}

interface MessageUsageDisplayProps {
  stats?: MessageStats;
  onPurchase: () => void;
  className?: string;
}

const MessageUsageDisplay: React.FC<MessageUsageDisplayProps> = ({ 
  stats: propStats, 
  onPurchase, 
  className = "" 
}) => {
  const { address } = useWeb3();
  const [stats, setStats] = useState<MessageStats | null>(null);
  
  // Load stats from props or from local storage
  useEffect(() => {
    if (propStats) {
      setStats(propStats);
    } else if (address && typeof window !== 'undefined') {
      const STORAGE_PREFIX = 'lingobabe_messages_';
      const localStorageKey = `${STORAGE_PREFIX}${address.toLowerCase()}`;
      const globalStorageKey = `${STORAGE_PREFIX}global`;
      
      // Try to load from address-specific storage first
      let storedStats = localStorage.getItem(localStorageKey);
      
      // If not found, try global storage
      if (!storedStats) {
        storedStats = localStorage.getItem(globalStorageKey);
      }
      
      if (storedStats) {
        try {
          const parsedStats = JSON.parse(storedStats);
          setStats(parsedStats);
        } catch (e) {
          console.warn('Failed to parse stored stats', e);
        }
      }
    }
  }, [propStats, address]);
  
  // Listen for stats updates
  useEffect(() => {
    function handleStatsUpdate(event: Event) {
      const customEvent = event as CustomEvent<MessageStats>;
      if (customEvent.detail) {
        setStats(customEvent.detail);
      }
    }
    
    function handleStorageChange(e: StorageEvent) {
      if (e.key && e.key.includes('lingobabe_messages_')) {
        if (e.newValue) {
          try {
            const updatedStats = JSON.parse(e.newValue);
            setStats(updatedStats);
          } catch (error) {
            console.warn('Failed to parse updated stats from storage event', error);
          }
        }
      }
    }
    
    window.addEventListener('messageStatsUpdated', handleStatsUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('messageStatsUpdated', handleStatsUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!stats) {
    return null;
  }

  return (
    <div className={`flex items-center gap-4 px-4 py-2 bg-gray-900 rounded-lg ${className}`}>
      <div className="text-sm text-green-400">
        Messages Remaining: <span className="text-pink-500">{stats.messagesRemaining}</span>/50
      </div>
      <button
        onClick={onPurchase}
        className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Buy More
      </button>
    </div>
  );
};

export default MessageUsageDisplay;