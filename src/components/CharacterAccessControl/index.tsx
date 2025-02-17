// src/components/CharacterAccessControl/index.tsx
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/components/providers/web3-provider';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AccessStatus } from '@/types/accessStatus';

interface CharacterAccessControlProps {
  characterId: string;
  onAccessGranted: () => void;
  className?: string;
}

const CharacterAccessControl: React.FC<CharacterAccessControlProps> = ({
  characterId,
  onAccessGranted,
  className = ''
}) => {
  const { address, balance } = useWeb3();
  const [isChecking, setIsChecking] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessCost, setAccessCost] = useState(10);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check if user has access to this character
  useEffect(() => {
    const checkAccess = async () => {
      if (!window.tokenManager?.initialized || !address || !characterId) {
        setIsChecking(false);
        return;
      }

      try {
        setIsChecking(true);
        const accessResult = await window.tokenManager.checkAccess(characterId);
        
        if (accessResult.hasAccess) {
          setHasAccess(true);
          // Automatically proceed if access is granted
          onAccessGranted();
        }
        
        // Get access cost
        const cost = window.tokenManager.getAccessCost();
        setAccessCost(cost);
      } catch (error: any) {
        console.error('Error checking access:', error);
        setError(error.message || 'Failed to check access status');
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [address, characterId, onAccessGranted]);

  // Listen for access status changes
  useEffect(() => {
    const handleAccessChange = (event: Event) => {
      const customEvent = event as CustomEvent<AccessStatus>;
      if (customEvent.detail?.characterId === characterId) {
        setHasAccess(customEvent.detail.hasAccess);
        if (customEvent.detail.hasAccess) {
          setShowSuccessMessage(true);
          setTimeout(() => {
            onAccessGranted();
          }, 2000);
        }
      }
    };

    window.addEventListener('accessStatusChanged', handleAccessChange);
    return () => {
      window.removeEventListener('accessStatusChanged', handleAccessChange);
    };
  }, [characterId, onAccessGranted]);

  const handlePayForAccess = async () => {
    if (!window.tokenManager?.initialized || !address) {
      setError('Wallet not connected properly');
      return;
    }

    setError(null);
    setIsPaying(true);

    try {
      const result = await window.tokenManager.payForAccess(characterId);
      
      if (result.success) {
        setHasAccess(true);
        setShowSuccessMessage(true);
        setTimeout(() => {
          onAccessGranted();
        }, 2000);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to complete payment');
    } finally {
      setIsPaying(false);
    }
  };

  // If already has access or still checking, show appropriate UI
  if (isChecking) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <div className="animate-pulse text-gray-400">Checking access...</div>
      </div>
    );
  }

  if (hasAccess) {
    if (showSuccessMessage) {
      return (
        <div className={`bg-green-900/70 p-6 rounded-lg shadow-xl max-w-md mx-auto ${className}`}>
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">Access Granted!</h2>
            <p className="text-green-200">Starting your chat experience...</p>
          </div>
        </div>
      );
    }
    return null; // Access granted, no need to show anything
  }

  // Otherwise show payment UI
  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-xl max-w-md mx-auto ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Pay to Access Chat
      </h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="text-center mb-6">
        <p className="text-gray-300 mb-2">
          This chat requires a one-time payment of <span className="font-bold text-green-400">{accessCost} LBAI</span> tokens.
        </p>
        <p className="text-gray-400 text-sm mb-4">
          Once paid, you'll have access to this chat until completion.
        </p>
        
        <div className="bg-gray-700 p-3 rounded mb-4">
          <p className="text-sm text-gray-300">Your balance: <span className="font-bold text-green-400">{balance} LBAI</span></p>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button
          onClick={handlePayForAccess}
          disabled={isPaying || parseFloat(balance || '0') < accessCost}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
        >
          {isPaying ? 'Processing Payment...' : `Pay ${accessCost} LBAI to Start Chat`}
        </Button>
        
        {parseFloat(balance || '0') < accessCost && (
          <Alert className="mt-2 bg-blue-900 border-blue-700 text-blue-100">
            <AlertDescription>
              You need more LBAI tokens. Visit the faucet to claim tokens.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default CharacterAccessControl;