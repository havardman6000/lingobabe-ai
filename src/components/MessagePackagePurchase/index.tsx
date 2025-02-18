import { useState } from 'react';
import { useWeb3 } from '@/components/providers/web3-provider';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMessageTracking } from '../../hooks/useMessageTracking';

export const MessagePackagePurchase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useWeb3();
  const { stats, purchasePackage } = useMessageTracking(address);

  const handlePurchase = async () => {
    if (!address || !window.tokenManager) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First check if user has enough LBAI tokens
      const balance = await window.tokenManager.getBalance(address);
      if (parseFloat(balance) < 50) {
        setError('Insufficient LBAI tokens. You need 50 LBAI to purchase a message package.');
        return;
      }

      // Purchase through smart contract
      await window.tokenManager.purchaseMessagePackage();

      // Update local message tracking
      await purchasePackage();
    } catch (err: any) {
      setError(err.message || 'Failed to purchase message package');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimFaucet = async () => {
    if (!address || !window.tokenManager) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await window.tokenManager.claimFaucet();
      // Update UI or trigger a refresh of the token balance
    } catch (err: any) {
      setError(err.message || 'Failed to claim from faucet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4 text-center">
        Purchase Message Package
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300">Current Messages:</p>
            <p className="text-lg text-white">{stats?.messagesRemaining || 0}/50 remaining</p>
          </div>
          <div>
            <p className="text-gray-300">Packages Purchased:</p>
            <p className="text-lg text-white">{stats?.packagesPurchased || 0}</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          {isLoading ? 'Processing...' : 'Purchase 50 Messages (50 LBAI)'}
        </Button>

        <Button
          onClick={handleClaimFaucet}
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-2"
        >
          {isLoading ? 'Claiming...' : 'Claim Tokens from Faucet'}
        </Button>

        <p className="text-sm text-gray-400 text-center">
          Each package contains 50 messages and costs 50 LBAI tokens
        </p>
      </div>
    </div>
  );
};
