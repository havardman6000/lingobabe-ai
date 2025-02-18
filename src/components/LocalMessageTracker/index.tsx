import React, { forwardRef, useImperativeHandle, useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWeb3 } from '@/components/providers/web3-provider';

// Define the interface inline to fix the immediate TypeScript errors
interface MessageStats {
  messagesUsed: number;
  messagesRemaining: number;
  packagesPurchased: number;
  lastPurchaseTimestamp?: number;
  lastUpdated?: number;
}

export interface MessageTrackerRef {
  handleMessageSent: () => Promise<void>;
  canSendMessage: () => boolean;
  getCurrentCount: () => number;
  purchasePackage: () => Promise<void>;
}

interface MessageTrackerProps {
  onUpdate?: (stats: MessageStats) => void;
}

const LOCAL_STORAGE_PREFIX = 'lingobabe_messages_';

const LocalMessageTracker = forwardRef<MessageTrackerRef, MessageTrackerProps>((props, ref) => {
  const { address } = useWeb3();
  const [stats, setStats] = useState<MessageStats>({
    messagesUsed: 0,
    messagesRemaining: 50,
    packagesPurchased: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  // Use refs to prevent infinite update loops
  const statsRef = useRef(stats);
  const addressRef = useRef(address);

  // Update refs when state changes
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    addressRef.current = address;
  }, [address]);

  const getStorageKey = useCallback((userAddress: string) =>
    `${LOCAL_STORAGE_PREFIX}${userAddress.toLowerCase()}`, []);

  // Load initial stats - with proper persistence
  useEffect(() => {
    if (!address) return;

    const loadStats = () => {
      try {
        // First, check for address-specific stats
        const addressStatsKey = getStorageKey(address);
        let stored = localStorage.getItem(addressStatsKey);

        // If no address-specific stats, check for global stats
        if (!stored) {
          const globalStatsKey = `${LOCAL_STORAGE_PREFIX}global`;
          stored = localStorage.getItem(globalStatsKey);
        }

        if (stored) {
          try {
            const parsedStats = JSON.parse(stored);
            // Validate parsed data
            if (typeof parsedStats === 'object' &&
                'messagesRemaining' in parsedStats &&
                'messagesUsed' in parsedStats) {
              // Only update if stats actually changed to prevent loops
              setStats(currentStats => {
                if (currentStats.messagesRemaining !== parsedStats.messagesRemaining ||
                    currentStats.messagesUsed !== parsedStats.messagesUsed ||
                    currentStats.packagesPurchased !== parsedStats.packagesPurchased) {
                  // Save to address-specific storage to ensure persistence
                  localStorage.setItem(addressStatsKey, stored);

                  // Notify parent in a safe way (outside the render cycle)
                  if (props.onUpdate) {
                    setTimeout(() => props.onUpdate?.(parsedStats), 0);
                  }
                  return parsedStats;
                }
                return currentStats;
              });
              return;
            }
          } catch (parseError) {
            console.warn('Error parsing stored stats, using defaults', parseError);
          }
        }

        // Only initialize from contract if we haven't loaded valid stats
        initializeFromContractOrDefaults();
      } catch (error) {
        console.error('Error loading stats:', error);
        setError('Failed to load message stats');
        initializeFromContractOrDefaults();
      }
    };

    const initializeFromContractOrDefaults = () => {
      if (window.tokenManager?.initialized) {
        // Use setTimeout to break potential update cycles
        setTimeout(async () => {
          try {
            const allowance = await window.tokenManager.checkTokenAllowance();
            if (allowance && typeof allowance.messagesRemaining === 'number') {
              const contractStats = {
                messagesUsed: 0,
                messagesRemaining: allowance.messagesRemaining || 50,
                packagesPurchased: 0,
                lastUpdated: Date.now()
              };
              setStats(contractStats);
              // Save to both global and address-specific storage
              const statsJson = JSON.stringify(contractStats);
              localStorage.setItem(getStorageKey(address), statsJson);
              localStorage.setItem(`${LOCAL_STORAGE_PREFIX}global`, statsJson);

              if (props.onUpdate) {
                setTimeout(() => props.onUpdate?.(contractStats), 0);
              }
            } else {
              saveDefaultStats(address);
            }
          } catch (error) {
            console.error('Failed to initialize from contract:', error);
            saveDefaultStats(address);
          }
        }, 0);
      } else {
        saveDefaultStats(address);
      }
    };

    loadStats();
    // Don't include props in dependencies to avoid update loops
  }, [address, getStorageKey]);

  // Save stats to localStorage
  const saveStats = useCallback((newStats: MessageStats) => {
    const currentAddress = addressRef.current;

    // Add timestamp to track when stats were last updated
    const statsWithTimestamp = {
      ...newStats,
      lastUpdated: Date.now()
    };

    const statsJson = JSON.stringify(statsWithTimestamp);

    // Save to address-specific storage if address available
    if (currentAddress) {
      localStorage.setItem(getStorageKey(currentAddress), statsJson);
    }

    // Always save to global storage for persistence across sessions
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}global`, statsJson);

    setStats(statsWithTimestamp);

    // Call onUpdate through a timeout to avoid update loops
    if (props.onUpdate) {
      setTimeout(() => props.onUpdate?.(statsWithTimestamp), 0);
    }

    // Dispatch event to notify other components
    dispatchStatsChanged(statsWithTimestamp);
  }, [getStorageKey, props]);

  // Dispatch event for cross-component communication
  const dispatchStatsChanged = (updatedStats: MessageStats) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('messageStatsUpdated', {
        detail: updatedStats,
        bubbles: true
      });
      window.dispatchEvent(event);
    }
  };

  // Define the saveDefaultStats function
  const saveDefaultStats = useCallback((userAddress: string) => {
    const defaultStats = {
      messagesUsed: 0,
      messagesRemaining: 50,
      packagesPurchased: 0,
      lastUpdated: Date.now()
    };

    const statsJson = JSON.stringify(defaultStats);

    // Save to address-specific storage if address available
    if (userAddress) {
      localStorage.setItem(getStorageKey(userAddress), statsJson);
    }

    // Always save to global storage for persistence across sessions
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}global`, statsJson);

    setStats(defaultStats);

    // Call onUpdate through a timeout to avoid update loops
    if (props.onUpdate) {
      setTimeout(() => props.onUpdate?.(defaultStats), 0);
    }

    // Dispatch event to notify other components
    dispatchStatsChanged(defaultStats);
  }, [getStorageKey, props]);

  // Handle message purchases
  const handlePurchasePackage = useCallback(async () => {
    const currentAddress = addressRef.current;
    if (!window.ethereum || !window.tokenManager || !currentAddress || isPurchasing) return;

    setIsPurchasing(true);
    setError(null);

    try {
      // This will trigger the blockchain transaction
      await window.tokenManager.purchaseMessagePackage();

      // Update local stats after successful purchase
      const currentStats = statsRef.current;
      const newStats = {
        ...currentStats,
        messagesRemaining: currentStats.messagesRemaining + 50,
        packagesPurchased: (currentStats.packagesPurchased || 0) + 1
      };

      saveStats(newStats);
    } catch (error: any) {
      console.error('Purchase error:', error);
      setError(error.message || 'Failed to purchase message package');
    } finally {
      setIsPurchasing(false);
    }
  }, [saveStats, isPurchasing]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    handleMessageSent: async () => {
      try {
        const currentStats = statsRef.current;
        if (currentStats.messagesRemaining <= 0) {
          throw new Error('No messages remaining. Please purchase a new package.');
        }

        const newStats = {
          ...currentStats,
          messagesUsed: currentStats.messagesUsed + 1,
          messagesRemaining: currentStats.messagesRemaining - 1
        };

        saveStats(newStats);
      } catch (error: any) {
        console.error('Error handling message:', error);
        setError(error.message || 'Failed to track message');
        throw error;
      }
    },
    canSendMessage: () => {
      return statsRef.current.messagesRemaining > 0 && !isPurchasing;
    },
    getCurrentCount: () => {
      return statsRef.current.messagesUsed;
    },
    purchasePackage: handlePurchasePackage
  }), [saveStats, handlePurchasePackage, isPurchasing]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-white space-y-2">
        <div className="flex flex-col gap-1">
          <div>Messages Used: {stats.messagesUsed}</div>
          <div>Messages Remaining: <span className="text-orange-400">{stats.messagesRemaining}</span></div>
          <div>Packages Purchased: {stats.packagesPurchased}</div>
        </div>

        <Button
          onClick={handlePurchasePackage}
          disabled={isPurchasing}
          className="w-full bg-green-600 hover:bg-green-700 mt-2"
        >
          {isPurchasing ? 'Purchasing...' : 'Purchase Message Package'}
        </Button>
      </div>
    </div>
  );
});

LocalMessageTracker.displayName = 'LocalMessageTracker';

export default LocalMessageTracker;
