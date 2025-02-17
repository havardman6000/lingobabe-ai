// src/lib/init.ts
import { tokenManager } from '@/services/tokenManager';
import type { TokenManagerInstance } from '@/types/tokenManager';
import Web3 from 'web3';

// Initialize TokenManager
if (typeof window !== 'undefined') {
  try {
    window.tokenManager = tokenManager;
    console.debug('TokenManager initialized globally');
  } catch (error) {
    console.error('Failed to initialize TokenManager:', error);
  }
}

// Export utility functions
export const isTokenManagerInitialized = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!window.tokenManager;
};

export const getTokenManager = (): TokenManagerInstance | null => {
  if (typeof window === 'undefined') return null;
  return window.tokenManager || null;
};

export const getEthereum = () => {
  if (typeof window === 'undefined') return null;
  return window.ethereum;
};

export const getWeb3 = (): typeof Web3 | null => {
  if (typeof window === 'undefined' || !window.Web3) return null;
  return window.Web3;
};

export { tokenManager };