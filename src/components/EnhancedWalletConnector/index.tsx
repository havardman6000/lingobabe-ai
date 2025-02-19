// src/components/EnhancedWalletConnector/index.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/components/providers/web3-provider';
import { useTokenManager } from '@/components/providers/TokenManagerContext';

export default function EnhancedWalletConnector() {
  const router = useRouter();
  const { isConnected, connect: providerConnect, disconnect: providerDisconnect, address, balance } = useWeb3();
  const { refreshData } = useTokenManager();
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleDisconnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      sessionStorage.clear();
      localStorage.clear();

      if (window.tokenManager) {
        try {
          await window.tokenManager.disconnect();
        } catch (error) {
          console.warn('Token manager disconnect warning:', error);
        }
      }

      await providerDisconnect();
      window.location.href = '/';
    } catch (error) {
      console.error('Disconnect error:', error);
      window.location.reload();
    }
  };

  const handleConnect = async () => {
    try {
      await providerConnect();
      await refreshData();
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet');
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="wallet-connector">
      {showError && error && (
        <div className="wallet-error">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      
      {!isConnected ? (
        <Button
          onClick={handleConnect}
          className="connect-button"
          aria-label="Connect Wallet"
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="inline sm:hidden">Connect</span>
          </span>
        </Button>
      ) : (
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="address-button"
            aria-haspopup="menu"
            aria-expanded={showMenu}
          >
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="address-text">
                {address ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}` : ''}
              </span>
              
              <div className="balance hidden sm:flex items-center ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-green-400">{Number(balance).toFixed(1)} LBAI</span>
              </div>
            </div>
          </button>

          {showMenu && (
            <div 
              className="dropdown-menu"
              role="menu"
            >
              <Button
                onClick={handleDisconnect}
                variant="ghost"
                className="disconnect-button"
                role="menuitem"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 00-1 1v6a1 1 0 002 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Disconnect
              </Button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .wallet-connector {
          position: fixed;
          top: 8px;
          right: 8px;
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        
        .wallet-error {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          width: 240px;
          max-width: 90vw;
        }
        
        .connect-button {
          background: linear-gradient(to right, rgba(59, 130, 246, 0.8), rgba(79, 70, 229, 0.8));
          padding: 6px 10px;
          border-radius: 9999px;
          font-size: 13px;
          min-height: 36px;
          min-width: 36px;
          backdrop-filter: blur(4px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .address-button {
          background: rgba(79, 70, 229, 0.2);
          backdrop-filter: blur(4px);
          padding: 4px 8px;
          border-radius: 9999px;
          font-size: 12px;
          min-height: 36px;
          min-width: 36px;
          color: white;
        }
        
        .address-text {
          max-width: 70px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 4px;
          background-color: #1f2937;
          border-radius: 8px;
          width: 160px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        
        .disconnect-button {
          width: 100%;
          justify-content: flex-start;
          color: #f87171;
          padding: 8px 12px;
          height: auto;
          min-height: 44px;
          text-align: left;
        }
        
        .disconnect-button:hover {
          background-color: #374151;
        }
        
        @media (min-width: 640px) {
          .wallet-connector {
            top: 16px;
            right: 16px;
          }
          
          .connect-button {
            padding: 8px 16px;
            font-size: 14px;
            min-height: 44px;
          }
          
          .address-button {
            padding: 6px 12px;
            font-size: 14px;
            min-height: 44px;
          }
          
          .address-text {
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}