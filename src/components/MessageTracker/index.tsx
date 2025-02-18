import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/components/providers/web3-provider';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MessageTrackerComponent = () => {
  const { isConnected, address } = useWeb3();
  const [messageCount, setMessageCount] = useState(0);
  const [error, setError] = useState('');
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => {
    if (isConnected && address) {
      loadMessageCount();
    } else {
      setMessageCount(0);
    }
  }, [isConnected, address]);

  const loadMessageCount = async () => {
    try {
      if (!window.tokenManager || !window.ethereum) {
        throw new Error('Web3 not initialized');
      }

      // Get message count from smart contract
      const contractCount = await window.tokenManager.getMessageCount();
      
      // Get local message count
      const localCount = localStorage.getItem(`messageCount_${address}`) || '0';
      
      // Use the higher count to ensure accuracy
      const finalCount = Math.max(parseInt(localCount), contractCount);
      
      setMessageCount(finalCount);
      localStorage.setItem(`messageCount_${address}`, finalCount.toString());

    } catch (error) {
      console.error('Error loading message count:', error);
      setError('Failed to load message count');
    }
  };

  const incrementMessageCount = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet');
      return false;
    }

    try {
      if (messageCount >= 50) {
        setError('You have reached your message limit');
        return false;
      }

      // Update local count immediately for responsive UI
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      localStorage.setItem(`messageCount_${address}`, newCount.toString());

      // Update blockchain state
      try {
        await window.tokenManager.incrementMessageCount();
        setSyncStatus('Synced with blockchain');
      } catch (error) {
        console.error('Blockchain sync error:', error);
        setSyncStatus('Local changes only - will sync later');
      }

      return true;
    } catch (error) {
      console.error('Error incrementing message count:', error);
      setError('Failed to update message count');
      return false;
    }
  };

  const getMessagesRemaining = () => {
    return 50 - messageCount;
  };

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
        <div className="text-white">
          <div>Messages Used: {messageCount}/50</div>
          <div>Messages Remaining: {getMessagesRemaining()}</div>
        </div>
        {syncStatus && (
          <div className="text-sm text-gray-400">
            {syncStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageTrackerComponent;
//src/components/MessageTracker/index.tsx