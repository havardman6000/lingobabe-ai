// src/types/global.d.ts

import type { TokenManagerInstance } from './tokenManager';
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
      selectedAddress?: string | null;
    };
    Web3?: typeof Web3;
    tokenManager?: TokenManagerInstance;
  }
}

export {};