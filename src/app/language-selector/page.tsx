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
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user has completed the survey
    const hasDoneSurvey = localStorage.getItem('lingobabe_survey_completed');
    
    // if (hasDoneSurvey !== 'true') {
    //   router.push('/welcome-survey');
    //   return;
    // }
    
    // Add a small delay to ensure everything is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // src/app/language-selector/page.tsx - update handleLanguageSelect function
const handleLanguageSelect = async (languageId: string) => {
  try {
    // Check if MetaMask exists
    if (!window.ethereum) {
      setError('Please install MetaMask!');
      return; // Just show error, don't redirect
    }

    // Get current connection status
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    }) as string[];

    if (!accounts || accounts.length === 0) {
      // Just show error message, don't redirect
      setError('Please connect your wallet first!');
      return;
    }

    // Verify network
    const chainId = await window.ethereum.request({ 
      method: 'eth_chainId' 
    });

    if (chainId !== '0x279f') {
      setError('Please connect to Monad network!');
      return; // Just show error, don't redirect
    }

    // If all checks pass, set selected language and navigate
    setSelectedLanguage(languageId);
    
    // Navigate to language selection page
    router.push(`/chat/${languageId}`);

  } catch (error) {
    console.error('Language selection error:', error);
    setError('An error occurred. Please try again.');
    // No redirect on error
  }
};

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#bde9e9] flex flex-col items-center justify-center">
        <div className="z-20 text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
          <h2 className="text-2xl text-white font-semibold">Loading your language options...</h2>
        </div>
        
        {/* Background image with reduced opacity */}
        <div
          className="fixed top-0 left-0 h-full w-full bg-cover bg-no-repeat z-10 opacity-25"
          style={{ backgroundImage: 'url(/tutors/Tree.png)' }}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#bde9e9] flex flex-col items-center justify-center p-4 sm:p-8 relative">
      <div className="fixed top-4 right-4 z-50">
        <EnhancedWalletConnector />
      </div>

      {/* Centered alert at top of page */}
      {error && (
  <div className="fixed inset-x-0 top-16 sm:top-20 flex justify-center items-center z-50 px-4 sm:px-6">
    <Alert 
      variant="destructive" 
      className="w-full max-w-sm sm:max-w-md animate-bounce shadow-lg border-2 border-red-300 bg-white/95" 
      role="alert"
    >
      <AlertDescription className="text-center font-semibold py-2">
        {error}
      </AlertDescription>
    </Alert>
  </div>
)}
      
      {/* Background image with reduced opacity for better contrast */}
      <div
        className="fixed top-0 left-0 h-full w-full bg-cover bg-no-repeat z-10 opacity-25 sm:opacity-50"
        style={{ backgroundImage: 'url(/tutors/Tree.png)' }}
        aria-hidden="true"
      />
      
      <h1 className="text-4xl sm:text-7xl font-bold text-white mb-6 sm:mb-12 text-center z-20">
        Pick a <br /><span className="text-5xl sm:text-8xl">Language</span>
      </h1>
      
      <div className="flex-grow overflow-y-auto w-full max-w-xl z-20">
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => handleLanguageSelect(language.id)}
              className={`relative rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 
                ${selectedLanguage === language.id ? 'ring-2 ring-green-500' : ''}`}
              aria-label={`Select ${language.name} language`}
            >
              <img 
                src={language.imageUrl} 
                alt={`${language.name} - ${language.description}`}
                className="w-full object-contain rounded-t-2xl"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}