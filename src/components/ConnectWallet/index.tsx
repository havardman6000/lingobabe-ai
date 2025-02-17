'use client'

import { Button } from '../ui/button'
import { useWeb3 } from '../providers/web3-provider'

export function ConnectWallet() {
  const { address, connect, disconnect, isConnected } = useWeb3()

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-4 bg-white shadow-lg rounded-lg p-4">
      {isConnected ? (
        <div className="flex items-center gap-4">
          <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-md border border-green-300">
            {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
          </span>
          <Button variant="destructive" onClick={disconnect}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          variant="default"
          onClick={connect}
          className="bg-blue-500 text-white shadow-md hover:bg-blue-600"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  )
}

// src/components/ConnectWallet/index.tsx