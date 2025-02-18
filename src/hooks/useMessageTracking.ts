// src/hooks/useMessageTracking.ts

import { useState, useEffect, useCallback } from 'react';
import { messageStore } from '../services/messageStore';
import { MessageStats } from '@/types/messageStore';

export function useMessageTracking(address: string | null) {
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Load initial stats
  useEffect(() => {
    if (address) {
      const initialStats = messageStore.getStats(address);
      setStats(initialStats);
    } else {
      setStats(null);
    }
  }, [address]);

  // Listen for message stats updates
  useEffect(() => {
    // Using function declaration to avoid closure issues
    function handleStatsUpdate(event: Event) {
      const customEvent = event as CustomEvent<MessageStats>;
      if (customEvent.detail && address) {
        // Always get the latest stats from the store to ensure consistency
        const latestStats = messageStore.getStats(address);
        setStats(latestStats);
      }
    }
      
    // Listen for local storage changes
    function handleStorageChange(e: StorageEvent) {
      if (address && e.key && e.key.includes(address.toLowerCase())) {
        const updatedStats = messageStore.getStats(address);
        setStats(updatedStats);
      }
    }
    
    window.addEventListener('messageStatsUpdated', handleStatsUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('messageStatsUpdated', handleStatsUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [address]);
  
  // Purchase a message package
  const purchasePackage = useCallback(async () => {
    if (!address) {
      setError('No wallet connected');
      return null;
    }

    try {
      setIsPurchasing(true);
      
      // Only make the blockchain call if tokenManager is initialized
      if (window.tokenManager?.initialized) {
        await window.tokenManager.purchaseMessagePackage();
      }
      
      // Always update local storage
      const newStats = await messageStore.purchasePackage(address);
      setStats(newStats);
      return newStats;
    } catch (err: any) {
      setError(err.message || 'Failed to purchase message package');
      return null;
    } finally {
      setIsPurchasing(false);
    }
  }, [address]);

  // Use a message (decrement count)
  const useMessage = useCallback(async () => {
    if (!address) {
      setError('No wallet connected');
      return false;
    }

    if (!stats?.messagesRemaining) {
      setError('No messages remaining');
      return false;
    }

    try {
      setIsLoading(true);
      const newStats = await messageStore.useMessage(address);
      if (newStats) {
        setStats(newStats);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to use message');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, stats]);

  // Sync with blockchain data
  const syncWithBlockchain = useCallback(async () => {
    if (!address || !window.tokenManager?.initialized) {
      return false;
    }
    
    try {
      setIsLoading(true);
      const syncedStats = await messageStore.syncWithBlockchain(address);
      if (syncedStats) {
        setStats(syncedStats);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to sync with blockchain');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Reset local stats
  const resetStats = useCallback(() => {
    if (!address) return;
    const freshStats = messageStore.getStats(address);
    setStats(freshStats);
  }, [address]);

  return {
    stats,
    error,
    isPurchasing,
    isLoading,
    purchasePackage,
    useMessage,
    syncWithBlockchain,
    resetStats,
    messagesRemaining: stats?.messagesRemaining ?? 0,
    messagesUsed: stats?.messagesUsed ?? 0,
    packagesPurchased: stats?.packagesPurchased ?? 0
  };
}