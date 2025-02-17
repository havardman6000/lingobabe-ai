// src/components/WalletConnectStatus/index.tsx
import React from 'react';
import { useWeb3 } from '@/components/providers/web3-provider';
import { Button } from '@/components/ui/button';

const WalletConnectStatus = () => {
  const { isConnected, address, balance, messagesRemaining, disconnect } = useWeb3();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-4 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-4">
      <div className="bg-white/50 px-4 py-2 rounded-lg">
        <div className="text-sm">{`${balance} LBAI`}</div>
        <div className="text-sm">{`Messages: ${messagesRemaining}/50`}</div>
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-lg">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm font-medium">
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
        </span>
      </div>

      <Button 
        variant="destructive"
        onClick={disconnect}
        className="ml-2"
      >
        Disconnect
      </Button>
    </div>
  );
};

export default WalletConnectStatus;