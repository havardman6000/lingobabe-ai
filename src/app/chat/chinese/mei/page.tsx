// src/app/chat/chinese/mei/page.tsx (similar changes needed for other tutor pages)

// MeiChatPage.tsx
'use client'

import { ChatInterface } from '@/components/ChatInterface'
import { useWeb3 } from '@/components/providers/web3-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useChatStore } from '@/store/chatStore'
import CharacterAccessControl from '@/components/CharacterAccessControl'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function MeiChatPage() {
  const { isConnected, address } = useWeb3()
  const router = useRouter()
  const { selectedCharacter, actions } = useChatStore()
  const tutorId = 'mei'
  const [isInitializing, setIsInitializing] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeChat = async () => {
      if (!isConnected) {
        router.push('/')
        return
      }

      try {
        if (!selectedCharacter || selectedCharacter !== tutorId) {
          console.log('Initializing chat with tutor:', tutorId)
          actions.reset()
          actions.selectCharacter(tutorId)
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
      } finally {
        setIsInitializing(false)
      }
    }

    initializeChat()
  }, [isConnected, selectedCharacter, tutorId, actions, router])

  // Check access to this character - ALWAYS assume no access by default
  useEffect(() => {
    const checkAccess = async () => {
      if (!window.tokenManager?.initialized || !address) {
        setIsCheckingAccess(false)
        setHasAccess(false) // Default to no access
        return
      }

      try {
        setIsCheckingAccess(true)
        const accessResult = await window.tokenManager.checkAccess(tutorId)
        setHasAccess(accessResult.hasAccess)
        
        // If no access according to the check, also clear any possibly stale local storage data
        if (!accessResult.hasAccess) {
          const accessKey = `character_access_${address.toLowerCase()}_${tutorId}`;
          localStorage.removeItem(accessKey);
        }
      } catch (error: any) {
        console.error('Failed to check access:', error)
        setError(error.message || 'Failed to verify access status')
        setHasAccess(false) // Default to no access on error
      } finally {
        setIsCheckingAccess(false)
      }
    }

    if (isConnected && !isInitializing) {
      checkAccess()
    } else {
      // Always default to no access until explicitly verified
      setHasAccess(false)
    }
  }, [isConnected, isInitializing, address, tutorId])

  // Listen for access status changes
  useEffect(() => {
    const handleAccessChange = (event: Event) => {
      const customEvent = event as CustomEvent<{characterId: string, hasAccess: boolean}>
      if (customEvent.detail?.characterId === tutorId) {
        setHasAccess(customEvent.detail.hasAccess)
      }
    }

    const handleChatCompleted = (event: Event) => {
      const customEvent = event as CustomEvent<{characterId: string}>
      if (customEvent.detail?.characterId === tutorId) {
        // Make sure access is revoked when chat is completed
        setHasAccess(false)
        // Also clear local storage
        if (address) {
          const accessKey = `character_access_${address.toLowerCase()}_${tutorId}`;
          localStorage.removeItem(accessKey);
        }
      }
    }

    window.addEventListener('accessStatusChanged', handleAccessChange)
    window.addEventListener('chatCompleted', handleChatCompleted)
    
    return () => {
      window.removeEventListener('accessStatusChanged', handleAccessChange)
      window.removeEventListener('chatCompleted', handleChatCompleted)
    }
  }, [tutorId, address])

  const handleAccessGranted = () => {
    setHasAccess(true)
  }

  const handleBack = () => {
    router.push('/chat/chinese')
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Please connect your wallet to continue</div>
      </div>
    )
  }

  if (isInitializing || isCheckingAccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">
          {isInitializing ? 'Initializing...' : 'Checking access...'}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={handleBack} className="w-full">
            Back to Character Selection
          </Button>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Access Required</h1>
            <p className="text-gray-300">
              You need to pay 10 LBAI tokens to access this chat.
            </p>
          </div>
          
          <CharacterAccessControl
            characterId={tutorId}
            onAccessGranted={handleAccessGranted}
            className="w-full"
          />
          
          <div className="mt-6 text-center">
           
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <ChatInterface />
    </div>
  )
}