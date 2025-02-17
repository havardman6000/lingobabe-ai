'use client'

// src/app/chat/layout.tsx
import { useWeb3 } from '@/components/providers/web3-provider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import EnhancedWalletConnector from '@/components/EnhancedWalletConnector';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isConnected } = useWeb3()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only redirect if we're not already on the home page
    if (!isConnected && pathname !== '/') {
      router.push('/')
    }
  }, [isConnected, router, pathname])

  if (!isConnected) {
    return null
  }

  return (
    <main className="min-h-screen">
      {children}
    </main>
  )
}
// src/app/chat/layout.tsx