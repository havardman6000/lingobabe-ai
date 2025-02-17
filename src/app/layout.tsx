// src/app/layout.tsx
'use client';

import { Web3Provider } from '@/components/providers/web3-provider';
import  EnhancedWalletConnector from '@/components/EnhancedWalletConnector';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          <div className="min-h-screen relative">
            <div className="fixed top-4 right-4 z-[100]">
              <EnhancedWalletConnector />
            </div>
            {children}
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}