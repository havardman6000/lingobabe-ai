// /src/types/ethereum.d.ts

export interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

export interface ProviderRpcError extends Error {
  code: number;
  data?: unknown;
}

export interface EthereumProvider {
  currentProvider?: any;
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (params: any) => void) => void;
  removeListener: (event: string, callback: (params: any) => void) => void;
  selectedAddress?: string | null;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    tokenManager?: any;
    Web3?: any;
  }
}

export {};