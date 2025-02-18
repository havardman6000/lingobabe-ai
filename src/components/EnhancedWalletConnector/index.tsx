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
import AccessStatusDisplay from '@/components/AccessStatusDisplay';

export default function EnhancedWalletConnector() {
  const router = useRouter();
  const { isConnected, connect: providerConnect, disconnect: providerDisconnect, address } = useWeb3();
  const { refreshData } = useTokenManager();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet');
    }
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

      {/* Access Status Display */}
      <AccessStatusDisplay className="mb-2" />

      <div
        className="flex items-center gap-4 bg-green-500/30 backdrop-blur-sm shadow-lg rounded-lg p-4 text-black cursor-pointer"
        onClick={() => setShowDisconnect(!showDisconnect)}
      >
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
// src/components/EnhancedWalletConnector/index.tsx