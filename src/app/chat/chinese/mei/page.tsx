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

  // Check access to this character
  useEffect(() => {
    const checkAccess = async () => {
      if (!window.tokenManager?.initialized || !address) {
        setIsCheckingAccess(false)
        return
      }

      try {
        setIsCheckingAccess(true)
        const accessResult = await window.tokenManager.checkAccess(tutorId)
        setHasAccess(accessResult.hasAccess)
      } catch (error: any) {
        console.error('Failed to check access:', error)
        setError(error.message || 'Failed to verify access status')
      } finally {
        setIsCheckingAccess(false)
      }
    }

    if (isConnected && !isInitializing) {
      checkAccess()
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

    window.addEventListener('accessStatusChanged', handleAccessChange)
    return () => {
      window.removeEventListener('accessStatusChanged', handleAccessChange)
    }
  }, [tutorId])

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
            <Button
              variant="outline"
              onClick={handleBack}
              className="text-white border-gray-600 hover:bg-gray-700"
            >
              Back to Character Selection
            </Button>
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