// src/app/chat/spanish/page.tsx
'use client'

import { BackButton } from '@/components/BackButton'
import { TutorSelect } from '@/components/TutorSelect'
import { useWeb3 } from '@/components/providers/web3-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SpanishTutorPage() {
  const { isConnected } = useWeb3()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push('/language-selector')
    }
  }, [isConnected, router])

  if (!isConnected) {
    return null
  }
  const disabledTutors = ['Sofia', 'Valentina']; // List of disabled tutors

  return (
    <main className="min-h-screen bg-gradient-to-r from-yellow-50 to-orange-100 py-12">
       <div className="fixed top-4 left-4 z-50">
        <BackButton />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Spanish Tutor
          </h1>
          <p className="text-2xl text-gray-600">
            Select a tutor to begin your Spanish learning journey
          </p>
        </div>
        <TutorSelect language="spanish"disabledTutors={disabledTutors}  />
      </div>
    </main>
  )
}