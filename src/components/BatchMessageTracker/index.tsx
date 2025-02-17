import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '@/components/providers/web3-provider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface BatchMessageTrackerProps {
    onPurchase: () => void;
    className?: string;
  }
  
  export default function BatchMessageTracker({
    onPurchase,
    className = ""
  }: BatchMessageTrackerProps) {
    const { address } = useWeb3();
    const [messagesRemaining, setMessagesRemaining] = useState(50);
  
    // Load messages remaining
    useEffect(() => {
      const loadMessageCount = async () => {
        if (window.tokenManager && address) {
          try {
            const allowance = await window.tokenManager.checkTokenAllowance();
            setMessagesRemaining(allowance.messagesRemaining);
          } catch (error) {
            console.error('Failed to load message count:', error);
          }
        }
      };
  
      loadMessageCount();
    }, [address]);
  
    return (
      <div className={`bg-gray-800 p-4 rounded-lg shadow-lg ${className}`}>
        <div className="flex flex-col gap-2">
          <div className="text-sm text-gray-300">
            Messages Remaining: {messagesRemaining}
          </div>
          <Button
            onClick={onPurchase}
            className="bg-green-600 hover:bg-green-700 text-white w-full"
          >
            Get More Messages
          </Button>
        </div>
      </div>
    );
  }