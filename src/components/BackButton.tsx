// src/components/BackButton.tsx
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
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
    <Button onClick={handleBack} className="bg-blue-500 text-white shadow-md hover:bg-blue-600">
      Back to Language Selector
    </Button>
  );
}
// src/components/BackButton.tsx