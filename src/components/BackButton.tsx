// src/components/BackButton.tsx
import { useRouter } from 'next/navigation';
import { useWeb3 } from './providers/web3-provider';

export function BackButton({ characterId }: { characterId?: string }) {
  const router = useRouter();
  const { address } = useWeb3();
  
  const handleBack = () => {
    // Safety: Only update local storage if we have both characterId and address
    if (characterId && address) {
      const accessKey = `character_access_${address.toLowerCase()}_${characterId}`;
      localStorage.removeItem(accessKey);
    }
    
    router.push('/language-selector');
  };
  
  return (
    <button 
      onClick={handleBack} 
      className="flex items-center gap-2 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 hover:from-blue-600/90 hover:to-indigo-700/90 text-white rounded-full pl-3 pr-5 py-2.5 shadow-lg transition-all duration-300 backdrop-blur-sm min-w-[44px] min-h-[44px]"
      aria-label="Go back"
    >
      <div className="rounded-full bg-white/20 p-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </div>
      <span className="font-medium">Back</span>
    </button>
  );
}