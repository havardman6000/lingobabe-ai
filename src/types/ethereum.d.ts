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
  isMetaMask?: boolean;
  request: (args: RequestArguments) => Promise<any>;
  on: (event: string, callback: (params: any) => void) => void;
  removeListener: (event: string, callback: (params: any) => void) => void;
  selectedAddress?: string | null;
  chainId?: string;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};