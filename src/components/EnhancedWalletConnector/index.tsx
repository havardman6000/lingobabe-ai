// src/components/EnhancedWalletConnector/index.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/components/providers/web3-provider';
import { useTokenManager } from '@/components/providers/TokenManagerContext';
import { messageStore } from '@/services/messageStore';
import { MessageStats } from '@/types/messageStore';

export default function EnhancedWalletConnector() {
  const router = useRouter();
  const { isConnected, connect: providerConnect, disconnect: providerDisconnect, address } = useWeb3();
  const { refreshData } = useTokenManager();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [messagesRemaining, setMessagesRemaining] = useState(50);

  useEffect(() => {
    const loadMessageStats = () => {
      if (address) {
        const stats = messageStore.getStats(address);
        setMessagesRemaining(stats.messagesRemaining);
      }
    };

    loadMessageStats();

    // Define event handlers that use loadMessageStats directly
    function handleStorageChange(e: StorageEvent) {
      if (e.key && e.key.startsWith('lingobabe_messages_') && address) {
        loadMessageStats();
      }
    }
    
    function handleStatsUpdated(e: Event) {
          const customEvent = e as CustomEvent<MessageStats>;
      if (customEvent.detail && address) {
        setMessagesRemaining(customEvent.detail.messagesRemaining);
      }
    }
    
    function handleMessageUsed(e: Event) {
      const customEvent = e as CustomEvent<{remaining: number}>;
      if (customEvent.detail && address) {
        setMessagesRemaining(customEvent.detail.remaining);
      }
    }
    
    function handleRefresh() {
      loadMessageStats();
    }

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('messageStatsUpdated', handleStatsUpdated);
    window.addEventListener('messageUsed', handleMessageUsed);
    window.addEventListener('refreshMessageTrackers', handleRefresh);

    // Poll for changes every 2 seconds as a backup
    const interval = setInterval(loadMessageStats, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('messageStatsUpdated', handleStatsUpdated);
      window.removeEventListener('messageUsed', handleMessageUsed);
      window.removeEventListener('refreshMessageTrackers', handleRefresh);
      clearInterval(interval);
    };
  }, [address]);

  const handleDisconnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisconnecting) return;

    try {
      setIsDisconnecting(true);

      // Clear all local storage
      sessionStorage.clear();
      localStorage.clear();

      // Reset token manager state
      if (window.tokenManager) {
        try {
          await window.tokenManager.disconnect();
        } catch (error) {
          console.warn('Token manager disconnect warning:', error);
        }
      }

      // Call provider disconnect
      await providerDisconnect();

      // Immediate redirect without timeout
      window.location.href = '/';

    } catch (error) {
      console.error('Disconnect error:', error);
      // Force reload on error
      window.location.reload();
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleConnect = async () => {
    try {
      await providerConnect();
      await refreshData(); // Refresh data after connecting
      
      // Load message stats after connecting
      if (address) {
        const stats = messageStore.getStats(address);
        setMessagesRemaining(stats.messagesRemaining);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet');
      setShowError(true);
    }
  };

  // Helper to dispatch a custom event that other components can listen for
  const notifyMessageUsed = () => {
    const event = new CustomEvent('messageCountUpdated');
    window.dispatchEvent(event);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-end gap-4">
        {showError && error && (
          <Alert variant="destructive" className="w-72">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          onClick={handleConnect}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-4">
      {showError && error && (
        <Alert variant="destructive" className="w-72">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className="flex items-center gap-4 bg-green-500/30 backdrop-blur-sm shadow-lg rounded-lg p-4 text-black"
        onClick={() => setShowDisconnect(!showDisconnect)}
      >
        <div className="bg-white/50 px-4 py-2 rounded-lg">
          <div className="text-sm">
            <span className="text-pink-500">{messagesRemaining}</span>/50 Messages
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium">
            {`${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`}
          </span>
        </div>

        {showDisconnect && (
          <Button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            variant="destructive"
            className="ml-2"
          >
            {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
          </Button>
        )}
      </div>
    </div>
  );
}