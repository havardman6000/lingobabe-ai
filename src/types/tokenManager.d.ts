// src/types/tokenManager.d.ts

import Web3 from 'web3';

export interface TokenManagerInstance {
  initialize: (web3Instance: Web3) => Promise<boolean>;
  getBalance: (address: string) => Promise<string>;
  checkTokenAllowance: () => Promise<{
    messagesRemaining: number;
    hasEnoughTokens: boolean;
    canPurchasePackage: boolean;
  }>;
  incrementMessageCount: () => Promise<{
    newBalance: string;
    messagesRemaining: number;
  }>;
  purchaseMessagePackage: () => Promise<{
    newBalance: string;
    messagesRemaining: number;
  }>;
  claimFaucet: () => Promise<void>;
  disconnect: () => Promise<boolean>;
}

declare global {
  interface Window {
    tokenManager: TokenManagerInstance;
  }
}

export {};