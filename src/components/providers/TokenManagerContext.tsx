// src/components/providers/TokenManagerContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { tokenManager } from '@/services/tokenManager';
import Web3 from 'web3';
// Import the EthereumProvider interface
import { EthereumProvider } from '@/types/ethereum';

interface TokenManagerContextType {
  messagesRemaining: number;
  canPurchasePackage: boolean;
  isInitialized: boolean;
  initializationError: string | null;
  initialize: () => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const TokenManagerContext = createContext<TokenManagerContextType | undefined>(undefined);

export const TokenManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messagesRemaining, setMessagesRemaining] = useState(0);
  const [canPurchasePackage, setCanPurchasePackage] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const initialize = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setInitializationError('Ethereum provider not found');
      return false;
    }

    try {
      const web3 = new Web3(window.ethereum as any);
      const success = await tokenManager.initialize(web3);
      
      if (success) {
        setIsInitialized(true);
        setInitializationError(null);
        await refreshData();
        return true;
      } else {
        setInitializationError('Failed to initialize TokenManager');
        return false;
      }
    } catch (error: any) {
      console.error('TokenManager initialization error:', error);
      setInitializationError(error.message || 'Unknown initialization error');
      return false;
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (isRefreshing || typeof window === 'undefined' || !window.ethereum) return;
    
    setIsRefreshing(true);
    try {
      // Only proceed if there are connected accounts
      const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
      if (!accounts || accounts.length === 0) {
        setMessagesRemaining(0);
        setCanPurchasePackage(false);
        return;
      }
      
      if (!tokenManager.initialized) {
        await initialize();
      }
      
      const allowance = await tokenManager.checkTokenAllowance();
      setMessagesRemaining(allowance.messagesRemaining);
      setCanPurchasePackage(!!allowance.canPurchasePackage);
    } catch (error) {
      console.error('Failed to refresh TokenManager data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [initialize, isRefreshing]);

  useEffect(() => {
    // Try to initialize but don't block rendering if it fails
    initialize().catch(console.error);
    
    // Set up event listeners for blockchain account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = () => {
        refreshData().catch(console.error);
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleAccountsChanged);
      
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleAccountsChanged);
        }
      };
    }
  }, [initialize, refreshData]);

  return (
    <TokenManagerContext.Provider 
      value={{ 
        messagesRemaining, 
        canPurchasePackage, 
        isInitialized, 
        initializationError,
        initialize, 
        refreshData 
      }}
    >
      {children}
    </TokenManagerContext.Provider>
  );
};

export const useTokenManager = () => {
  const context = useContext(TokenManagerContext);
  if (context === undefined) {
    throw new Error('useTokenManager must be used within a TokenManagerProvider');
  }
  return context;
};