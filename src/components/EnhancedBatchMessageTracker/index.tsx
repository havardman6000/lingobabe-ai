import React, { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Web3 from 'web3';

// Define the interface for the ref methods
export interface MessageTrackerRef {
  handleMessageSent: () => Promise<void>;
  canSendMessage: () => boolean;
  getCurrentCount: () => number;
}

interface MessageTrackerProps {
  onUpdate?: (stats: MessageStats) => void;
}

interface MessageStats {
  pending: number;
  synced: number;
  total: number;
  lastSyncTime?: number;
}

const SYNC_THRESHOLD = 10;
const LOCAL_STORAGE_PREFIX = 'message_tracker_';

const EnhancedMessageTracker = forwardRef<MessageTrackerRef, MessageTrackerProps>((props, ref) => {
  const [stats, setStats] = useState<MessageStats>({
    pending: 0,
    synced: 0,
    total: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const getStorageKey = (address: string) => `${LOCAL_STORAGE_PREFIX}${address.toLowerCase()}`;

  const saveStats = useCallback(async (newStats: MessageStats) => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (!accounts?.length) throw new Error('No connected account');

      localStorage.setItem(getStorageKey(accounts[0]), JSON.stringify(newStats));
      setStats(newStats);
      props.onUpdate?.(newStats);
    } catch (error) {
      console.error('Error saving stats:', error);
      setError('Failed to save message stats');
    }
  }, [props]);

  const syncMessages = useCallback(async () => {
    if (!window.ethereum || !window.tokenManager || syncing) return;

    try {
      setSyncing(true);
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (!accounts?.length) throw new Error('No connected account');

      if (stats.pending > 0) {
        const web3 = new Web3(window.ethereum);
        await window.tokenManager.initialize(web3);
        
        // Batch increment messages
        await window.tokenManager.incrementMessageCount();

        const newStats = {
          ...stats,
          pending: 0,
          synced: stats.synced + stats.pending,
          lastSyncTime: Date.now()
        };

        await saveStats(newStats);
      }
    } catch (error: any) {
      console.error('Sync error:', error);
      setError(error.message || 'Failed to sync messages');
    } finally {
      setSyncing(false);
    }
  }, [stats, syncing, saveStats]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    handleMessageSent: async () => {
      try {
        const newStats = {
          ...stats,
          pending: stats.pending + 1,
          total: stats.total + 1
        };

        await saveStats(newStats);

        if (newStats.pending >= SYNC_THRESHOLD) {
          await syncMessages();
        }
      } catch (error) {
        console.error('Error handling message:', error);
        setError('Failed to track message');
      }
    },
    canSendMessage: () => {
      return !syncing && stats.total < 50;
    },
    getCurrentCount: () => {
      return stats.total;
    }
  }));

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-white space-y-2">
        <div>Messages:</div>
        <div className="ml-2">
          <div>Pending: {stats.pending}</div>
          <div>Synced: {stats.synced}</div>
          <div>Total: {stats.total}</div>
        </div>

        {stats.pending > 0 && (
          <Button
            onClick={() => syncMessages()}
            disabled={syncing}
            className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
          >
            {syncing ? 'Syncing...' : `Sync ${stats.pending} Messages`}
          </Button>
        )}
      </div>
    </div>
  );
});

EnhancedMessageTracker.displayName = 'EnhancedMessageTracker';

export default EnhancedMessageTracker;
//src/components/EnhancedBatchMessageTracker/index.tsx