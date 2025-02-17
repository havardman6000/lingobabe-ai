// MeiChatPage.tsx

'use client'

import  {ChatInterface } from '@/components/ChatInterface'
import { useWeb3 } from '@/components/providers/web3-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useChatStore } from '@/store/chatStore'
import { tokenManager } from '@/services/tokenManager'

export default function MeiChatPage() {
  const { isConnected } = useWeb3()
  const router = useRouter()
  const { selectedCharacter, actions } = useChatStore()
  const tutorId = 'mei'

  useEffect(() => {
    const initializeChat = async () => {
      if (!isConnected) {
        router.push('/')
        return
      }

      try {
        const result = await tokenManager.checkTokenAllowance();
        if (result.messagesRemaining <= 0) {
          alert('You have run out of messages. Please purchase more.');
          router.push('/chat/chinese');
          return;
        }
      } catch (error) {
        console.error('Error checking tokens:', error);
        return;
      }

      if (!selectedCharacter || selectedCharacter !== tutorId) {
        console.log('Initializing chat with tutor:', tutorId)
        actions.reset()
        actions.selectCharacter(tutorId)
      }
    }

    initializeChat();
  }, [isConnected, selectedCharacter, tutorId, actions, router])

  if (!isConnected || !selectedCharacter) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <ChatInterface />
    </div>
  )
}
