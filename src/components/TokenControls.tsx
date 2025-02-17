// src/components/TokenControls.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TokenControlsProps {
  balance: string;
  messagesRemaining: number;
  onUpdate: () => void;
}

export const TokenControls: React.FC<TokenControlsProps> = ({
  balance,
  messagesRemaining,
  onUpdate
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const handlePurchasePackage = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Clear old transaction state if any
      setTransactionHash(null);
      
      const result = await window.tokenManager.purchaseMessagePackage();
      
      if (result.success) {
        setTransactionHash(result.hash);
        onUpdate();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to purchase message package');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimFaucet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Clear old transaction state if any
      setTransactionHash(null);
      
      const result = await window.tokenManager.claimFaucet();
      
      if (result.success) {
        setTransactionHash(result.hash);
        onUpdate();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to claim from faucet');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex items-center space-x-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {transactionHash && (
        <Alert className="mb-4">
          <AlertDescription>
            Transaction sent: {transactionHash.slice(0, 10)}...
          </AlertDescription>
        </Alert>
      )}

      <div className="text-green-400 text-sm bg-gray-900 p-2 rounded">
        Balance: {balance} LBAI
      </div>
      <div className="text-green-400 text-sm bg-gray-900 p-2 rounded">
        Messages Remaining: {messagesRemaining}/100
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handlePurchasePackage}
          disabled={isLoading || parseFloat(balance) < 50}
          className="bg-green-500 hover:bg-green-600"
        >
          {isLoading ? 'Processing...' : 'Purchase 100 Messages (50 LBAI)'}
        </Button>

        <Button
          onClick={handleClaimFaucet}
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? 'Claiming...' : 'Claim Faucet'}
        </Button>
      </div>
    </div>
  );
};
