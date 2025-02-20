// src/app/layout.tsx
import { Web3Provider } from '@/components/providers/web3-provider';
import { TokenManagerProvider } from '@/components/providers/TokenManagerContext';
import EnhancedWalletConnector from '@/components/EnhancedWalletConnector';
import './globals.css';
import MessageUsageDisplay from '@/components/MessageUsageDisplay';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        {/* Setting maximum-scale helps users with visual impairments to zoom in while maintaining usability */}
      </head>
      <body>
        <Web3Provider>
          <TokenManagerProvider>
            <div className="min-h-screen relative">
              <div className="fixed top-4 right-4 z-[100]">
                <EnhancedWalletConnector />
              </div>
              {children}
            </div>
          </TokenManagerProvider>
        </Web3Provider>
      </body>
    </html>
  );
}