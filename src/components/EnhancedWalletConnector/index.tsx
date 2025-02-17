import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/components/providers/web3-provider';

export default function EnhancedWalletConnector() {
  const router = useRouter();
  const { isConnected, connect: providerConnect, disconnect: providerDisconnect } = useWeb3();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [walletInfo, setWalletInfo] = useState({
    address: '',
    balance: '0',
    messagesRemaining: 50
  });

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });
          
          if (accounts?.length > 0) {
            setWalletInfo(prev => ({
              ...prev,
              address: accounts[0]
            }));
          }
        } catch (error) {
          console.error('Connection check error:', error);
        }
      }
    };

    checkConnection();
  }, [isConnected]);

  const handleDisconnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDisconnecting) return;

    try {
      setIsDisconnecting(true);

      // Clear all local storage
      sessionStorage.clear();
      localStorage.clear();

      // Reset token manager state
      if (window.tokenManager) {
        try {
          await window.tokenManager.disconnect();
        } catch (error) {
          console.warn('Token manager disconnect warning:', error);
        }
      }

      // Call provider disconnect
      await providerDisconnect();

      // Reset component state
      setWalletInfo({
        address: '',
        balance: '0',
        messagesRemaining: 50
      });
      setShowDisconnect(false);

      // Immediate redirect without timeout
      window.location.href = '/';

    } catch (error) {
      console.error('Disconnect error:', error);
      // Force reload on error
      window.location.reload();
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleConnect = async () => {
    try {
      await providerConnect();
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet');
      setShowError(true);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-end gap-4">
        {showError && error && (
          <Alert variant="destructive" className="w-72">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          onClick={handleConnect}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-4">
      {showError && error && (
        <Alert variant="destructive" className="w-72">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className="flex items-center gap-4 bg-green-500/30 backdrop-blur-sm shadow-lg rounded-lg p-4 text-black"
        onClick={() => setShowDisconnect(!showDisconnect)}
      >
        <div className="bg-white/50 px-4 py-2 rounded-lg">
          <div className="text-sm">{walletInfo.messagesRemaining}/50 Messages</div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium">
            {`${walletInfo.address.substring(0, 6)}...${walletInfo.address.substring(walletInfo.address.length - 4)}`}
          </span>
        </div>

        {showDisconnect && (
          <Button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            variant="destructive"
            className="ml-2"
          >
            {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
          </Button>
        )}
      </div>
    </div>
  );
}