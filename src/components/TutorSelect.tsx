// src/components/TutorSelect.tsx
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useWeb3 } from '../components/providers/web3-provider'
import { useChatStore } from '@/store/chatStore'
import { characters } from '@/data/characters'
import { SupportedLanguage, Character } from '@/types/chat'
import { AccessStatus } from '@/types/accessStatus'

interface TutorSelectProps {
  language: SupportedLanguage;
}

const getLocalizedName = (tutor: Character) => {
  switch (tutor.language) {
    case 'japanese':
      return tutor.japaneseName;
    case 'korean':
      return tutor.koreanName;
    case 'spanish':
      return tutor.spanishName;
    default:
      return tutor.chineseName;
  }
};

export function TutorSelect({ language }: TutorSelectProps) {
  const router = useRouter()
  const { isConnected, connect, address } = useWeb3()
  const { actions } = useChatStore()
  const [accessStatuses, setAccessStatuses] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  const filteredTutors = Object.values(characters).filter(
    tutor => tutor.language === language
  )

  // Load access status for all tutors
  useEffect(() => {
    const loadAccessStatuses = async () => {
      if (!window.tokenManager?.initialized || !address) {
        setIsLoading(false);
        return;
      }

      try {
        const statuses: Record<string, boolean> = {};
        
        for (const tutor of filteredTutors) {
          const accessResult = await window.tokenManager.checkAccess(tutor.id);
          statuses[tutor.id] = accessResult.hasAccess;
        }

        setAccessStatuses(statuses);
      } catch (err) {
        console.error('Error loading access statuses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected && address) {
      loadAccessStatuses();
    } else {
      setIsLoading(false);
    }
  }, [filteredTutors, isConnected, address]);

  // Listen for access status changes
  useEffect(() => {
    const handleAccessChange = (event: Event) => {
      const customEvent = event as CustomEvent<AccessStatus>;
      if (customEvent.detail?.characterId) {
        setAccessStatuses(prev => ({
          ...prev,
          [customEvent.detail.characterId]: customEvent.detail.hasAccess
        }));
      }
    };

    const handleChatCompleted = (event: Event) => {
      const customEvent = event as CustomEvent<{characterId: string}>;
      if (customEvent.detail?.characterId) {
        setAccessStatuses(prev => ({
          ...prev,
          [customEvent.detail.characterId]: false
        }));
      }
    };

    window.addEventListener('accessStatusChanged', handleAccessChange);
    window.addEventListener('chatCompleted', handleChatCompleted);

    return () => {
      window.removeEventListener('accessStatusChanged', handleAccessChange);
      window.removeEventListener('chatCompleted', handleChatCompleted);
    };
  }, []);

  const handleTutorSelect = async (tutorId: string) => {
    if (!isConnected) {
      try {
        await connect()
      } catch (error) {
        console.error('Failed to connect wallet:', error)
        return
      }
    }

    actions.selectCharacter(tutorId)
    router.push(`/chat/${language}/${tutorId}`)
  }

  const getAccessBadge = (tutorId: string) => {
    if (isLoading) return null;
    
    if (accessStatuses[tutorId]) {
      return (
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10">
          Access Granted
        </div>
      );
    } else {
      return (
        <div className="absolute top-3 right-3 bg-gray-600 text-white text-xs px-2 py-1 rounded-full z-10 flex items-center gap-1">
          <span>10 LBAI</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-11a3 3 0 100 6 3 3 0 000-6z" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="text-center mb-8 py-2 bg-white/30 backdrop-blur-sm rounded-lg">
          <p className="animate-pulse text-gray-700">Loading access information...</p>
        </div>
      )}
      
      <div className="text-center mb-8 py-3 px-4 bg-white/60 backdrop-blur-sm rounded-lg inline-block mx-auto">
        <div className="flex items-center mb-2 text-sm text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-2 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Each tutor requires a one-time payment of 10 LBAI</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.map((tutor) => (
          <div
            key={tutor.id}
            onClick={() => handleTutorSelect(tutor.id)}
            className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
            style={{ height: '300px' }}
          >
            {getAccessBadge(tutor.id)}
            
            <img
              src={tutor.image}
              alt={tutor.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 hover:bg-opacity-30 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">
                {tutor.name} <span className="opacity-90">({getLocalizedName(tutor)})</span>
              </h3>
              <p className="text-white text-opacity-90">
                {tutor.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}