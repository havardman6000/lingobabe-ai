'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '@/components/providers/web3-provider';
import { MessagePackagePurchase } from '@/components/MessagePackagePurchase';
import { Button } from '@/components/ui/button';

export default function PurchagePage() {
  const router = useRouter();
  const { isConnected, connect } = useWeb3();

  useEffect(() => {
    // Redirect to home if not connected
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Please Connect Your Wallet</h1>
          <Button onClick={connect}>Connect Wallet</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Purchase Message Packages
        </h1>
        
        <MessagePackagePurchase />

        <div className="mt-8 text-center">
          <Button 
            variant="outline"
            onClick={() => router.back()}
            className="text-white"
          >
            Back to Chat
          </Button>
        </div>
      </div>
    </div>
  );
}