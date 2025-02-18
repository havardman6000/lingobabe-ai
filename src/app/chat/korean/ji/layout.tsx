// src/app/chat/chinese/mei/layout.tsx
'use client'

import { useWeb3 } from '@/components/providers/web3-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import EnhancedWalletConnector   from '@/components/EnhancedWalletConnector'

export default function JiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isConnected } = useWeb3()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  return (
    <div className="min-h-screen">
      {isConnected ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-gray-700">
            Please connect your wallet to continue...
          </div>
        </div>
      )}
    </div>
  )
}
// src/app/chat/korean/ji/layout.tsx
