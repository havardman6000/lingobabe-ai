import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/components/providers/web3-provider';
import { messageStore } from '@/services/messageStore';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const MessageMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { address } = useWeb3();
  const [stats, setStats] = useState(() => 
    address ? messageStore.getStats(address) : null
  );

  // Load saved message count on mount and when address changes
  useEffect(() => {
    if (address) {
      const savedStats = messageStore.getStats(address);
      setStats(savedStats);
    }
  }, [address]);

  const handlePurchase = async () => {
    if (!address || !window.tokenManager) {
      setError('Please connect your wallet');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      // Purchase through contract
      await window.tokenManager.purchaseMessagePackage();
      
      // Update local storage and state
      const newStats = await messageStore.purchasePackage(address);
      setStats(newStats);
      setSuccess('Successfully purchased 50 messages!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to purchase messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaucet = async () => {
    if (!address || !window.tokenManager) {
      setError('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await window.tokenManager.claimFaucet();
      setSuccess('Successfully claimed LBAI tokens!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to claim from faucet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div 
        className="min-w-[200px] bg-gray-800 p-4 rounded-lg cursor-pointer flex justify-between items-center hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white text-lg font-medium">
          {stats?.messagesRemaining || 0}/50 Messages
        </span>
        <span className="ml-2 text-lg">{isOpen ? '▼' : '▲'}</span>
      </div>

      {isOpen && (
        <div className="absolute bottom-full left-0 w-[300px] mb-2 bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50">
          {error && (
            <Alert variant="destructive" className="m-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="m-2 bg-green-500 text-white">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <Button
            onClick={handleFaucet}
            disabled={isLoading}
            className="w-full p-4 text-left hover:bg-gray-700 text-white border-b border-gray-700 text-lg font-medium"
          >
            🪙 Claim LBAI Tokens
          </Button>
          
          <Button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full p-4 text-left hover:bg-gray-700 text-white text-lg font-medium"
          >
            💬 Buy 50 Messages (50 LBAI)
          </Button>

          <div className="p-4 bg-gray-900 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Messages purchased will persist across sessions.
              Each package contains 50 messages.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};