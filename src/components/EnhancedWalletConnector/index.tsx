// src/components/EnhancedWalletConnector/index.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/components/providers/web3-provider';
import { useTokenManager } from '@/components/providers/TokenManagerContext';

export default function EnhancedWalletConnector() {
  const router = useRouter();
  const { isConnected, connect: providerConnect, disconnect: providerDisconnect, address } = useWeb3();
  const { messagesRemaining, canPurchasePackage, refreshData } = useTokenManager();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

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
      setShowError(true);
    }
  };

  const handleSendMessage = async () => {
    // Logic to send a message
    await refreshData(); // Refresh data after sending a message
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
          <div className="text-sm">{messagesRemaining}/50 Messages</div>
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
