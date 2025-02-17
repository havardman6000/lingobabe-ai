// src/types/window.d.ts
import { TokenManagerInstance } from "./tokenManager";
import { EthereumProvider } from "./ethereum";
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    Web3?: typeof Web3;
    tokenManager?: TokenManagerInstance;
  }
}

export {};

// src/types/ethereum.d.ts
export interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

export interface ProviderRpcError extends Error {
  code: number;
  data?: unknown;
}

export interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: RequestArguments) => Promise<unknown>;
  on: (eventName: string, handler: (params: any) => void) => void;
  removeListener: (eventName: string, handler: (params: any) => void) => void;
  selectedAddress?: string | null;
}

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
  incrementMessageCount: () => Promise<void>;
  claimFaucet: () => Promise<void>;
  disconnect: () => Promise<boolean>;
}

// src/lib/init.ts (updated)
import { tokenManager } from '@/services/tokenManager';
import type { TokenManagerInstance } from '@/types/tokenManager';
import Web3 from 'web3';

if (typeof window !== 'undefined') {
  try {
    window.tokenManager = tokenManager;
    console.debug('TokenManager initialized globally');
  } catch (error) {
    console.error('Failed to initialize TokenManager:', error);
  }
}

export const isTokenManagerInitialized = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!window.tokenManager;
};

export const getTokenManager = (): TokenManagerInstance | null => {
  if (typeof window === 'undefined') return null;
  return window.tokenManager || null;
};

export const getEthereum = (): any => {
  if (typeof window === 'undefined') return null;
  return window.ethereum;
};

export const getWeb3 = (): typeof Web3 | null => {
  if (typeof window === 'undefined' || !window.Web3) return null;
  return window.Web3;
};

export { tokenManager };
