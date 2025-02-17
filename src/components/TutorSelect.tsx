import { useRouter } from 'next/navigation'
import { useWeb3 } from '../components/providers/web3-provider'
import { useChatStore } from '@/store/chatStore'
import { characters } from '@/data/characters'
import { SupportedLanguage, Character } from '@/types/chat'

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
  const { isConnected, connect } = useWeb3()
  const { actions } = useChatStore()

  const filteredTutors = Object.values(characters).filter(
    tutor => tutor.language === language
  )

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTutors.map((tutor) => (
        <div
          key={tutor.id}
          onClick={() => handleTutorSelect(tutor.id)}
          className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
          style={{ height: '300px' }}
        >
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
  )
}