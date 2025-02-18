import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/components/providers/web3-provider';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AccessStatus } from '@/types/accessStatus';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';

interface CharacterAccessControlProps {
  characterId: string;
  onAccessGranted: () => void;
  className?: string;
}
interface EnhancedAccessControlProps {
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
  const router = useRouter();

  const { actions } = useChatStore();

  // Check if user has access to this character - default to NO ACCESS
  useEffect(() => {
    const checkAccess = async () => {
      if (!window.tokenManager?.initialized || !address || !characterId) {
        setIsChecking(false);
        setHasAccess(false); // Default to no access
        return;
      }

      try {
        setIsChecking(true);
        const accessResult = await window.tokenManager.checkAccess(characterId);
        
        if (accessResult.hasAccess) {
          setHasAccess(true);
          // Automatically proceed if access is granted
          onAccessGranted();
        } else {
          // Ensure local storage is cleared if no access
          const accessKey = `character_access_${address.toLowerCase()}_${characterId}`;
          localStorage.removeItem(accessKey);
          setHasAccess(false);
        }
        
        // Get access cost
        const cost = window.tokenManager.getAccessCost();
        setAccessCost(cost);
      } catch (error: any) {
        console.error('Error checking access:', error);
        setError(error.message || 'Failed to check access status');
        setHasAccess(false); // Default to no access on error
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [address, characterId, onAccessGranted]);

  const refreshTokenBalance = async () => {
    if (!window.tokenManager?.initialized || !address) return;
    
    try {
      const newBalance = await window.tokenManager.getBalance(address);
      // Dispatch an event that the web3-provider can listen for
      window.dispatchEvent(new CustomEvent('balanceRefreshNeeded', {
        detail: { address }
      }));
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };
  // Listen for access status changes
  useEffect(() => {
    const handleAccessChange = (event: Event) => {
      const customEvent = event as CustomEvent<AccessStatus>;
      if (customEvent.detail?.characterId === characterId) {
        const newHasAccess = customEvent.detail.hasAccess === true;
        setHasAccess(newHasAccess);
        
        if (newHasAccess) {
          setShowSuccessMessage(true);
          setTimeout(() => {
            onAccessGranted();
          }, 2000);
        }
      }
    };
    
   
    
    const handleChatCompleted = (event: Event) => {
      const customEvent = event as CustomEvent<{characterId: string}>;
      if (customEvent.detail?.characterId === characterId && address) {
        setHasAccess(false);
        
        // Also clear local storage when chat is completed
        const accessKey = `character_access_${address.toLowerCase()}_${characterId}`;
        localStorage.removeItem(accessKey);
      }
    };

    window.addEventListener('accessStatusChanged', handleAccessChange);
    window.addEventListener('chatCompleted', handleChatCompleted);
    
    return () => {
      window.removeEventListener('accessStatusChanged', handleAccessChange);
      window.removeEventListener('chatCompleted', handleChatCompleted);
    };
  }, [characterId, onAccessGranted, address]);

  useEffect(() => {
    const checkReturnFromFaucet = () => {
      const returning = sessionStorage.getItem('returning_from_faucet');
      if (returning === 'true') {
        // Clear the flag
        sessionStorage.removeItem('returning_from_faucet');
        // Refresh the balance with a slight delay to ensure transaction is processed
        setTimeout(refreshBalance, 1000);
      }
    };
    
    checkReturnFromFaucet();
  }, []);

  const refreshBalance = async () => {
    if (!window.tokenManager?.initialized || !address) return;
    
    try {
      const newBalance = await window.tokenManager.getBalance(address);
      // Manually dispatch an event that other components can listen for
      window.dispatchEvent(new CustomEvent('balanceChanged', {
        detail: { address, balance: newBalance }
      }));
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };
  
  
  useEffect(() => {
    // This will run when component mounts or when user returns to this page
    const refreshOnFocus = () => refreshBalance();
    
    // Set up refresh on window focus (helps when returning from faucet)
    window.addEventListener('focus', refreshOnFocus);
    
    // Call once on mount
    refreshBalance();
    
    return () => {
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, [address]);



  
  const handlePayForAccess = async () => {
    if (!window.tokenManager?.initialized || !address) {
      setError('Wallet not connected properly');
      return;
    }

    setError(null);
    setIsPaying(true);

    try {
      actions.reset();
      actions.selectCharacter(characterId);
      // Double-check current access status
      const currentStatus = await window.tokenManager.checkAccess(characterId);
      if (currentStatus.hasAccess) {
        // Already has access, just proceed
        setHasAccess(true);
        setShowSuccessMessage(true);

        setTimeout(() => {
          onAccessGranted();
        }, 2000);
        return;
      }
      const currentBalance = await window.tokenManager.getBalance(address);
      if (parseFloat(currentBalance) < accessCost) {
        throw new Error(`Insufficient LBAI tokens. You need at least ${accessCost} LBAI to access this chat.`);
      }

      // Process payment
      const result = await window.tokenManager.payForAccess(characterId);
      
      if (result.success) {
        // Verify access was actually granted
        const verifyResult = await window.tokenManager.checkAccess(characterId); 
        if (verifyResult.hasAccess) {
          
          const accessKey = `character_access_${address.toLowerCase()}_${characterId}`;
          const accessData: AccessStatus = {
            hasAccess: true,
            characterId,
            accessGranted: Date.now(),
            completed: false
          };
          localStorage.setItem(accessKey, JSON.stringify(accessData));
          await refreshBalance();

          setHasAccess(true);
          setShowSuccessMessage(true);

          window.dispatchEvent(new CustomEvent('accessStatusChanged', {
            detail: accessData
          }));

          setTimeout(() => {
            onAccessGranted();
          }, 2000);
        } else {
          setError('Access verification failed. Please try again.');
        }
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
const handleReturnToSelection = () => {
  // Determine language from character ID
  const language = characterId.substring(0, 2) === 'me' ? 'chinese' : 
                  characterId.substring(0, 2) === 'ao' ? 'japanese' :
                  characterId.substring(0, 2) === 'ji' ? 'korean' : 'spanish';
  
  router.push(`/chat/${language}`);
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
        This chat requires a payment of <span className="font-bold text-green-400">{accessCost} LBAI</span> tokens.
        </p>
        <p className="text-gray-400 text-sm mb-4">
        Each new chat session requires a separate payment.
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
        <Button 
          onClick={handleReturnToSelection}
          variant="outline"
          className="w-full text-white border-gray-600 hover:bg-gray-700 mt-2"
          disabled={isPaying}
        >
          Return to Character Selection
        </Button>

        {parseFloat(balance || '0') < accessCost && (
          <Alert className="mt-2 bg-blue-900 border-blue-700 text-blue-100">
            <div className="flex flex-col space-y-3">
              <AlertDescription>
                You need more LBAI tokens. Visit the faucet to claim tokens.
              </AlertDescription>
              <Button 
        onClick={() => {
          // Set a flag that we're coming from this page
          sessionStorage.setItem('returning_from_faucet', 'true');
          router.push('/faucet');
        }}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
      >
        Visit Faucet
      </Button>
            </div>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default CharacterAccessControl;
// src/components/CharacterAccessControl/index.tsx