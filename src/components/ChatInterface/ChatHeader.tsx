import { useWeb3 } from '@/components/providers/web3-provider';
import { Button } from '@/components/ui/button';

export function ChatHeader({ characterName, happiness, onBack }: { characterName: string, happiness: number, onBack: () => void }) {
  const { balance, messagesRemaining } = useWeb3();

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800">
      <Button
        onClick={onBack}
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
//src/components/ChatInterface/ChatHeader.tsx