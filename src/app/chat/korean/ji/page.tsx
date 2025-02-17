'use client'

import  {ChatInterface}  from '@/components/ChatInterface'
import { useWeb3 } from '@/components/providers/web3-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useChatStore } from '@/store/chatStore'

export default function JiChatPage() {
  const { isConnected } = useWeb3()
  const router = useRouter()
  const { selectedCharacter, actions } = useChatStore()
  const tutorId = 'ji' // Hardcoded tutor ID for ji

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
      return
    }

    if (!selectedCharacter || selectedCharacter !== tutorId) {
      console.log('Initializing chat with tutor:', tutorId)
      actions.reset()
      actions.selectCharacter(tutorId)
    }
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
//src/app/chat/korean/ji/page.tsx