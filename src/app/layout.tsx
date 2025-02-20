// src/app/layout.tsx (modified)
import { Web3Provider } from '@/components/providers/web3-provider';
import { TokenManagerProvider } from '@/components/providers/TokenManagerContext';
import { SurveyProvider } from '@/context/SurveyContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body>
        <Web3Provider>
          <TokenManagerProvider>
            <SurveyProvider>
              <div className="min-h-screen relative">
                {children}
              </div>
            </SurveyProvider>
          </TokenManagerProvider>
        </Web3Provider>
      </body>
    </html>
  );
}