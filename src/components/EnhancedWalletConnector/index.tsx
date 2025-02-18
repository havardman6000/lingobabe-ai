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
  const { isConnected, connect: providerConnect, disconnect: providerDisconnect, address, balance } = useWeb3();
  const { refreshData } = useTokenManager();
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

    try {
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

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-end gap-4">
        {showError && error && (
          <Alert variant="destructive" className="w-72 rounded-xl">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          onClick={handleConnect}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-6 py-2 shadow-lg transition-all duration-300"
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
            </svg>
            Connect Wallet
          </span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-4">
      {showError && error && (
        <Alert variant="destructive" className="w-72 rounded-xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative">
        <div 
          onClick={toggleMenu}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 backdrop-blur-md rounded-full pl-4 pr-3 py-2 shadow-lg cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-white">
              {`${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`}
            </span>
          </div>
          
          <div className="h-6 w-px bg-gray-500/50 mx-2" />
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-400">{balance} LBAI</span>
          </div>
          
          <div className="ml-1 p-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 text-white transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {showMenu && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
            <Button
              onClick={handleDisconnect}
              variant="ghost"
              className="w-full justify-start text-red-400 hover:bg-gray-700 hover:text-red-300 rounded-none py-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 00-1 1v6a1 1 0 002 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                <path d="M10 14a1 1 0 01-1-1V9a1 1 0 112 0v4a1 1 0 01-1 1z" />
              </svg>
              Disconnect
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}