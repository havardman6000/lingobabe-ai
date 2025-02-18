// src/app/language-selector/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedWalletConnector from '@/components/EnhancedWalletConnector';

const languages = [
  {
    id: 'chinese',
    name: 'Chinese',
    description: '中文',
    imageUrl: '/tutors/chinese.png'
  },
  {
    id: 'japanese',
    name: 'Japanese',
    description: '日本語',
    imageUrl: '/tutors/japanese.png'
  },
  {
    id: 'korean',
    name: 'Korean',
    description: '한국어',
    imageUrl: '/tutors/korean.png'
  },
  {
    id: 'spanish',
    name: 'Spanish',
    description: 'Español',
    imageUrl: '/tutors/spanish.png'
  }
];

export default function LanguageSelection() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLanguageSelect = async (languageId: string) => {
    try {
      // Check if MetaMask exists
      if (!window.ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      // Get current connection status
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      }) as string[];

      if (!accounts || accounts.length === 0) {
        setError('Please connect to MetaMask!');
        return;
      }

      // Verify network
      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });

      if (chainId !== '0x279f') {
        setError('Please connect to Monad network!');
        return;
      }

      // If all checks pass, set selected language and navigate
      setSelectedLanguage(languageId);
      
      // Navigate to language selection page
      router.push(`/chat/${languageId}`);

    } catch (error) {
      console.error('Language selection error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#bde9e9] flex flex-col items-center justify-center p-8 relative">
      <div className="fixed top-4 right-4 z-50">
        <EnhancedWalletConnector />
      </div>

      {error && (
        <Alert variant="destructive" className="fixed top-20 left-1/2 transform -translate-x-1/2 w-96 z-50">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div
        className="fixed top-[6%] left-[-13.5%] h-full w-[30%] bg-cover bg-no-repeat z-40"
        style={{ backgroundImage: 'url(/tutors/Tree.png)' }}
      />
      
      <h1 className="text-7xl font-bold text-white mb-12 text-center">
        Pick a <br /><span className="text-8xl">Language</span>
      </h1>
      
      <div className="flex-grow overflow-y-auto w-full max-w-4xl">
        <div className="grid grid-cols-1 gap-8">
          {languages.map((language) => (
            <div
              key={language.id}
              onClick={() => handleLanguageSelect(language.id)}
              className={`relative rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col
                ${selectedLanguage === language.id ? 'ring-2 ring-green-500' : ''}`}
            >
              <img 
                src={language.imageUrl} 
                alt={language.name} 
                className="w-full object-contain rounded-t-2xl"
              />
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}