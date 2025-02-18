// src/components/providers/TokenManagerContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { tokenManager } from '@/services/tokenManager';
import Web3 from 'web3';

interface TokenManagerContextType {
  messagesRemaining: number;
  canPurchasePackage: boolean;
  initialize: () => Promise<void>;
  refreshData: () => Promise<void>; // Add a refresh function
}

const TokenManagerContext = createContext<TokenManagerContextType | undefined>(undefined);

export const TokenManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messagesRemaining, setMessagesRemaining] = useState(0);
  const [canPurchasePackage, setCanPurchasePackage] = useState(false);

  const initialize = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await tokenManager.initialize(web3);
      await refreshData(); // Initialize with a refresh
    }
  };

  const refreshData = useCallback(async () => {
    if (window.ethereum) {
      const allowance = await tokenManager.checkTokenAllowance();
      setMessagesRemaining(allowance.messagesRemaining);
      setCanPurchasePackage(!!allowance.canPurchasePackage); // Explicitly convert to boolean
    }
  }, []);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <TokenManagerContext.Provider value={{ messagesRemaining, canPurchasePackage, initialize, refreshData }}>
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
