    // src/components/BackButton.tsx
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/language-selector');
  };

  return (
    <Button onClick={handleBack} className="bg-blue-500 text-white shadow-md hover:bg-blue-600">
      Back to Language Selector
    </Button>
  );
}
