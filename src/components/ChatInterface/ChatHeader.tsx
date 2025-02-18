// src/components/ChatInterface/ChatHeader.tsx
import { useState } from 'react';
import { useWeb3 } from '@/components/providers/web3-provider';
import { Button } from '@/components/ui/button';
import { ConfirmExitDialog } from '@/components/ConfirmExitDialog';
import { useRouter } from 'next/navigation';
import { characters } from '@/data/characters'; // Import your characters data

export function ChatHeader({ 
  characterName, 
  happiness, 
  characterId,
  onBack 
}: { 
  characterName: string, 
  happiness: number, 
  characterId: string,
  onBack: () => void 
}) {
  const { address } = useWeb3();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const router = useRouter();

  // Get the character's language from your characters data
  const getLanguagePath = () => {
    if (characterId && characters[characterId as keyof typeof characters]) {
      return `/chat/${characters[characterId as keyof typeof characters].language}`;
    }
    // Fallback to chinese if we can't determine the language
    return '/chat/chinese';
  };

  const handleBackClick = () => {
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    // Mark chat as completed in local storage only
    if (window.tokenManager && characterId) {
      window.tokenManager.markChatCompleted(characterId);
    }
    
    // Return to the language-specific character selection page
    router.push(getLanguagePath());
    setShowExitDialog(false);
  };

  const handleStayInChat = () => {
    setShowExitDialog(false);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <Button
          onClick={handleBackClick}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          Back
        </Button>
        <h1 className="text-lg text-white font-semibold">
          {characterName}
        </h1>
        <div className="flex gap-4">
          {/* Happiness meter */}
        </div>
      </div>

      <ConfirmExitDialog
        open={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        onConfirmExit={handleConfirmExit}
        onStayInChat={handleStayInChat}
      />
    </>
  );
}