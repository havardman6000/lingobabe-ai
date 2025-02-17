// src/hooks/useMessageTracking.ts

import { useState, useEffect } from 'react';
import { messageStore } from '../services/messageStore';

export function useMessageTracking(address: string | null) {
  const [stats, setStats] = useState(() => address ? messageStore.getStats(address) : null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      setStats(messageStore.getStats(address));
    } else {
      setStats(null);
    }
  }, [address]);

  const purchasePackage = async () => {
    if (!address) {
      setError('No wallet connected');
      return null;
    }

    try {
      const newStats = await messageStore.purchasePackage(address);
      setStats(newStats);
      return newStats;
    } catch (err) {
      setError('Failed to purchase message package');
      return null;
    }
  };

  const useMessage = async () => {
    if (!address) {
      setError('No wallet connected');
      return false;
    }

    if (!stats?.messagesRemaining) {
      setError('No messages remaining');
      return false;
    }

    try {
      const newStats = await messageStore.useMessage(address);
      if (newStats) {
        setStats(newStats);
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to use message');
      return false;
    }
  };

  const resetStats = async () => {
    if (!address) return;
    await messageStore.getStats(address);
    setStats(messageStore.getStats(address));
  };

  return {
    stats,
    error,
    purchasePackage,
    useMessage,
    resetStats,
    messagesRemaining: stats?.messagesRemaining ?? 0,
    messagesUsed: stats?.messagesUsed ?? 0,
    packagesPurchased: stats?.packagesPurchased ?? 0
  };
}