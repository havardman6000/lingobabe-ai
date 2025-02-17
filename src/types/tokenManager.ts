// src/types/tokenManager.ts
import Web3 from 'web3';

export interface TokenManagerInstance {
  initialize: (web3Instance: Web3) => Promise<boolean>;
  getBalance: (address: string) => Promise<string>;
  checkTokenAllowance: () => Promise<{
    messagesRemaining: number;
    hasEnoughTokens: boolean;
    canPurchasePackage: boolean;
  }>;
  incrementMessageCount: () => Promise<void>;
  claimFaucet: () => Promise<void>;
  disconnect: () => Promise<boolean>;
}