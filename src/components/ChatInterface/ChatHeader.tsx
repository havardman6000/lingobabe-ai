// src/components/ChatInterface/ChatHeader.tsx
import { useWeb3 } from '@/components/providers/web3-provider';
import { Button } from '@/components/ui/button';

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

  const handleSafeBack = () => {
    // Only update the local state and storage - NO blockchain calls
    if (characterId && address) {
      const accessKey = `character_access_${address.toLowerCase()}_${characterId}`;
      localStorage.removeItem(accessKey);
      
      // Manually dispatch events to update UI without calling blockchain
      window.dispatchEvent(new CustomEvent('chatCancelled', {
        detail: { characterId }
      }));
    }
    
    // Just navigate back
    onBack();
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800">
      <Button
        onClick={handleSafeBack}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
      >
        Back
      </Button>
      <h1 className="text-lg text-white font-semibold">
        {characterName}
      </h1>
      <div className="flex gap-4">
      </div>
    </div>
  );
}