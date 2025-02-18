// src/components/EnhancedMessageTracker/index.tsx

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { MessageTrackerRef, MessageTrackerProps } from './types';

const EnhancedMessageTracker = forwardRef<MessageTrackerRef, MessageTrackerProps>(
  ({ className = '', onUpdate }, ref) => {
    const [messagesRemaining, setMessagesRemaining] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Load initial allowance
    useEffect(() => {
      const loadAllowance = async () => {
        if (!window.tokenManager?.initialized || !window.ethereum) return;
        
        try {
          const allowance = await window.tokenManager.checkTokenAllowance();
          setMessagesRemaining(allowance.messagesRemaining);
          onUpdate?.(allowance.messagesRemaining);
        } catch (error) {
          console.error('Failed to load allowance:', error);
        }
      };

      loadAllowance();
    }, [onUpdate]);

    const handlePurchasePackage = async () => {
      if (!window.tokenManager?.initialized || loading) return;

      setLoading(true);
      setError(null);

      try {
        await window.tokenManager.purchaseMessagePackage();
        const allowance = await window.tokenManager.checkTokenAllowance();
        setMessagesRemaining(allowance.messagesRemaining);
        onUpdate?.(allowance.messagesRemaining);
      } catch (error: any) {
        setError(error.message || 'Failed to purchase package');
      } finally {
        setLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      decrementMessages: async () => {
        if (messagesRemaining <= 0) {
          setError('No messages remaining');
          return false;
        }

        const newCount = messagesRemaining - 1;
        setMessagesRemaining(newCount);
        onUpdate?.(newCount);
        return true;
      },
      getMessagesRemaining: () => messagesRemaining,
      refreshAllowance: async () => {
        if (!window.tokenManager?.initialized) return;
        
        try {
          const allowance = await window.tokenManager.checkTokenAllowance();
          setMessagesRemaining(allowance.messagesRemaining);
          onUpdate?.(allowance.messagesRemaining);
        } catch (error) {
          console.error('Failed to refresh allowance:', error);
        }
      }
    }));

    return (
      <div className={`bg-gray-800 p-4 rounded-lg shadow-lg ${className}`}>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-white space-y-2">
          <div className="flex items-center justify-between">
            <span>Messages Remaining:</span>
            <span className="font-bold">{messagesRemaining}/50</span>
          </div>

          {messagesRemaining < 10 && (
            <Button
              onClick={handlePurchasePackage}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 mt-2"
            >
              {loading ? 'Purchasing...' : 'Purchase 50 Messages'}
            </Button>
          )}
        </div>
      </div>
    );
  }
);

EnhancedMessageTracker.displayName = 'EnhancedMessageTracker';

export default EnhancedMessageTracker;
//src/components/EnhancedMessageTracker/index.tsx