// src/components/LocalMessageTracker/index.tsx
import React, { forwardRef, useImperativeHandle, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Web3 from 'web3';
import { MessageStats } from '@/types/messageStore';

export interface MessageTrackerRef {
  handleMessageSent: () => Promise<void>;
  canSendMessage: () => boolean;
  getCurrentCount: () => number;
  purchasePackage: () => Promise<void>;
}

interface MessageTrackerProps {
  onUpdate?: (stats: MessageStats) => void;
}

const LOCAL_STORAGE_PREFIX = 'message_tracker_';
const MESSAGES_PER_PACKAGE = 50;

const LocalMessageTracker = forwardRef<MessageTrackerRef, MessageTrackerProps>((props, ref) => {
  const [stats, setStats] = useState<MessageStats>({
    messagesUsed: 0,
    messagesRemaining: MESSAGES_PER_PACKAGE,
    packagesPurchased: 0 // Initialize with packagesPurchased
  });
  const [error, setError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const getStorageKey = (address: string) => `${LOCAL_STORAGE_PREFIX}${address.toLowerCase()}`;

  // Load initial stats
  useEffect(() => {
    const loadStats = async () => {
      if (!window.ethereum) return;
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (!accounts?.length) return;

        const stored = localStorage.getItem(getStorageKey(accounts[0]));
        if (stored) {
          setStats(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, []);

  // Save stats to localStorage
  const saveStats = useCallback(async (newStats: MessageStats) => {
    if (!window.ethereum) return;
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (!accounts?.length) return;

      localStorage.setItem(getStorageKey(accounts[0]), JSON.stringify(newStats));
      setStats(newStats);
      props.onUpdate?.(newStats);
    } catch (error) {
      console.error('Error saving stats:', error);
      setError('Failed to save message stats');
    }
  }, [props]);

  // Handle message purchases
  const handlePurchasePackage = async () => {
    if (!window.ethereum || !window.tokenManager || isPurchasing) return;

    setIsPurchasing(true);
    setError(null);

    try {
      const web3 = new Web3(window.ethereum);
      await window.tokenManager.initialize(web3);

      // This will trigger the transaction prompt
      await window.tokenManager.purchaseMessagePackage();

      // Update local stats after successful purchase
      const newStats = {
        ...stats,
        messagesRemaining: stats.messagesRemaining + MESSAGES_PER_PACKAGE,
        lastPackagePurchaseTime: Date.now(),
        packagesPurchased: (stats.packagesPurchased || 0) + 1 // Increment packagesPurchased
      };

      await saveStats(newStats);
    } catch (error: any) {
      console.error('Purchase error:', error);
      setError(error.message || 'Failed to purchase message package');
    } finally {
      setIsPurchasing(false);
    }
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    handleMessageSent: async () => {
      try {
        if (stats.messagesRemaining <= 0) {
          throw new Error('No messages remaining. Please purchase a new package.');
        }

        const newStats = {
          ...stats,
          messagesUsed: stats.messagesUsed + 1,
          messagesRemaining: stats.messagesRemaining - 1
        };

        await saveStats(newStats);
      } catch (error: any) {
        console.error('Error handling message:', error);
        setError(error.message || 'Failed to track message');
        throw error;
      }
    },
    canSendMessage: () => {
      return stats.messagesRemaining > 0 && !isPurchasing;
    },
    getCurrentCount: () => {
      return stats.messagesUsed;
    },
    purchasePackage: handlePurchasePackage
  }));

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-white space-y-2">
        <div className="flex flex-col gap-1">
          <div>Messages Used: {stats.messagesUsed}</div>
          <div>Messages Remaining: {stats.messagesRemaining}</div>
          <div>Packages Purchased: {stats.packagesPurchased}</div>
        </div>

        <Button
          onClick={handlePurchasePackage}
          disabled={isPurchasing}
          className="w-full bg-green-600 hover:bg-green-700 mt-2"
        >
          {isPurchasing ? 'Purchasing...' : 'Purchase Message Package'}
        </Button>
      </div>
    </div>
  );
});

LocalMessageTracker.displayName = 'LocalMessageTracker';

export default LocalMessageTracker;
