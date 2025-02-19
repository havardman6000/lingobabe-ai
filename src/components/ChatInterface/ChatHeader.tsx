// src/components/ChatInterface/ChatHeader.tsx
import { useWeb3 } from '@/components/providers/web3-provider';

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
      <button 
        onClick={handleSafeBack} 
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 hover:from-blue-600/90 hover:to-indigo-700/90 text-white rounded-full pl-3 pr-5 py-2 shadow-lg transition-all duration-300 backdrop-blur-sm"
      >
        <div className="rounded-full bg-white/20 p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="font-medium">Back</span>
      </button>
      <h1 className="text-lg text-white font-semibold">
        {characterName}
      </h1>
      <div className="flex gap-4">
        <div className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-sm text-white">Happiness: {happiness}</span>
        </div>
      </div>
    </div>
  );
}