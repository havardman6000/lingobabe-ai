'use client';

import { useWeb3 } from '@/components/providers/web3-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import  EnhancedWalletConnector  from '@/components/EnhancedWalletConnector';

export default function TingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected } = useWeb3();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <EnhancedWalletConnector />
      {children}
    </div>
  );
}