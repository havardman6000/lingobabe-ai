// src/components/providers/web3-provider.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Web3 from 'web3';
import { useRouter } from 'next/navigation';

interface Web3ContextType {
  address: string | null;
  balance: string;
  messagesRemaining: number;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [messagesRemaining, setMessagesRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const router = useRouter();

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = async () => {
      const hasMetaMask = typeof window !== 'undefined' && !!window.ethereum?.isMetaMask;
      setIsMetaMaskInstalled(hasMetaMask);
      setIsLoading(false);
    };
    checkMetaMask();
  }, []);

  const validateConnection = async (): Promise<boolean> => {
    if (!window.ethereum) return false;
    try {
      // Request accounts to ensure we have up-to-date access
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      }) as string[];

      if (!accounts || accounts.length === 0) return false;

      // Verify we're on the correct network
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      return chainId === '0x279f';
    } catch (error) {
      console.error('Connection validation error:', error);
      return false;
    }
  };

  const switchToMonadTestnet = async () => {
    if (!window.ethereum) throw new Error('MetaMask not found');

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x279f' }]
      });
    } catch (switchError: any) {
      // This error code means the chain hasn't been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x279f',
              chainName: 'Monad Testnet',
              nativeCurrency: {
                name: 'MONAD',
                symbol: 'TMON',
                decimals: 18
              },
              rpcUrls: ['https://testnet-rpc2.monad.xyz/52227f026fa8fac9e2014c58fbf5643369b3bfc6'],
              blockExplorerUrls: ['https://testnet.monadexplorer.com/']
            }]
          });
        } catch (addError) {
          throw new Error('Failed to add Monad network to MetaMask');
        }
      } else {
        throw switchError;
      }
    }
  };

  const updateUserInfo = useCallback(async (userAddress: string) => {
    if (!window.ethereum || !window.tokenManager) return;

    try {
      const web3 = new Web3(window.ethereum);
      await window.tokenManager.initialize(web3);

      const [newBalance, allowance] = await Promise.all([
        window.tokenManager.getBalance(userAddress),
        window.tokenManager.checkTokenAllowance()
      ]);

      setBalance(newBalance);
      setMessagesRemaining(allowance.messagesRemaining);

      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('userAddress', userAddress);
    } catch (error: any) {
      console.error('Error updating user info:', error);
      setError(error.message || 'Failed to update user info');
    }
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    setIsLoading(true);
  
    try {
      console.log('Connecting to Web3Provider...');
      if (!isMetaMaskInstalled) {
        throw new Error('Please install MetaMask to continue');
      }
  
      // First switch to the correct network
      await switchToMonadTestnet();
      console.log('Switched to Monad Testnet.');
  
      // Then request account access - this triggers the MetaMask popup
      const accounts = await window.ethereum?.request({
        method: 'eth_requestAccounts'
      }) as string[];
  
      if (!accounts || accounts.length === 0) {
        throw new Error('Please connect your MetaMask wallet');
      }
  
      // Verify connection was successful
      const isValid = await validateConnection();
      if (!isValid) {
        throw new Error('Failed to connect to Monad network');
      }
  
      setAddress(accounts[0]);
      await updateUserInfo(accounts[0]);
      console.log('Web3Provider connected successfully.');
  
      // Ensure we don't redirect to home after successful connection
      const currentPath = window.location.pathname;
      if (currentPath === '/') {
        router.push('/language-selector');
      }
    } catch (error: any) {
      console.error('Connection error in Web3Provider:', error);
      setError(error.message || 'Failed to connect wallet');
      setAddress(null);
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('userAddress');
    } finally {
      console.log('Web3Provider connection process complete.');
      setIsLoading(false);
    }
  }, [isMetaMaskInstalled, router, updateUserInfo]);
  
  // Inside disconnect function in web3-provider.tsx

// Inside disconnect function in web3-provider.tsx

const disconnect = useCallback(async () => {
  try {
    // Clear all storage immediately
    sessionStorage.clear();
    localStorage.clear();

    // Clear state
    setAddress(null);
    setBalance('0');
    setMessagesRemaining(0);
    setError(null);

    // Clear token manager state
    if (window.tokenManager) {
      window.tokenManager.initialized = false;
    }

    // Revoke MetaMask permissions
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }]
        });
      } catch (error) {
        console.log('Permission revoke error:', error);
      }
    }

    // Force disconnect
    if (window.ethereum?.selectedAddress) {
      await window.ethereum.request({
        method: 'eth_accounts'
      });
    }

    // Redirect to language selector
    window.location.href = '/language-selector';
  } catch (error) {
    console.error('Disconnect error:', error);
    // Even on error, redirect to language selector
    window.location.href = '/language-selector';
  }
}, []);


  useEffect(() => {
    const checkConnection = async () => {
      const wasConnected = localStorage.getItem('walletConnected');
      const storedAddress = localStorage.getItem('userAddress');

      if (wasConnected === 'true' && storedAddress && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          }) as string[];

          if (accounts && accounts[0]) {
            setAddress(accounts[0]);
            await updateUserInfo(accounts[0]);
          } else {
            await disconnect();
          }
        } catch (error) {
          console.error('Connection check error:', error);
          await disconnect();
        }
      }
      setIsLoading(false);
    };

    checkConnection();
  }, [disconnect, updateUserInfo]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        await disconnect();
      } else if (accounts[0] !== address) {
        setAddress(accounts[0]);
        await updateUserInfo(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [address, disconnect, updateUserInfo]);

  const value = {
    address,
    balance,
    messagesRemaining,
    isConnected: !!address && !isLoading,
    isLoading,
    error,
    connect,
    disconnect
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

// src/app/language-selector/page.tsx
export default function LanguageSelection() {
  const router = useRouter();
  const { isConnected, isLoading } = useWeb3();
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  // Prevent redirect if loading or connected
  useEffect(() => {
    if (!isLoading && !isConnected) {
      router.replace('/');
    }
  }, [isLoading, isConnected, router]);

  const handleLanguageSelect = async (languageId: string) => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      // Verify connection
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      }) as string[];

      if (!accounts || accounts.length === 0) {
        setError('Please connect your wallet!');
        return;
      }

      // Verify network
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      if (chainId !== '0x279f') {
        setError('Please connect to Monad network!');
        return;
      }

      setSelectedLanguage(languageId);
      router.push(`/chat/${languageId}`);

    } catch (error) {
      console.error('Language selection error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Your language selection UI goes here */}
      {error && <div>{error}</div>}
      {/* Example buttons for language selection */}
      <button onClick={() => handleLanguageSelect('en')}>English</button>
      <button onClick={() => handleLanguageSelect('es')}>Spanish</button>
    </div>
  );
}
// src/components/providers/web3-provider.tsx 