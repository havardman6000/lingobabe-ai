// src/app/chat/chinese/page.tsx
'use client';

import { useWeb3 } from '@/components/providers/web3-provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DynamicBar from '@/components/DynamicBar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AccessStatus } from '@/types/accessStatus';
import { BackButton } from '@/components/BackButton';
export default function DateSelectionPage() {
  const { isConnected, address } = useWeb3();
  const router = useRouter();
  const [accessStatuses, setAccessStatuses] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  // Load access status for all tutors
  useEffect(() => {
    const loadAccessStatuses = async () => {
      if (!window.tokenManager?.initialized || !address) {
        setIsLoading(false);
        return;
      }

      try {
        const tutorIds = ['mei', 'ting', 'xue'];
        const statuses: Record<string, boolean> = {};

        for (const tutorId of tutorIds) {
          const accessResult = await window.tokenManager.checkAccess(tutorId);
          statuses[tutorId] = accessResult.hasAccess;
        }

        setAccessStatuses(statuses);
      } catch (err) {
        console.error('Error loading access statuses:', err);
        setError('Failed to load access information');
      } finally {
        setIsLoading(false);
      }
    };

    loadAccessStatuses();
  }, [address]);

  // Listen for access status changes
  useEffect(() => {
    const handleAccessChange = (event: Event) => {
      const customEvent = event as CustomEvent<AccessStatus>;
      if (customEvent.detail?.characterId) {
        setAccessStatuses(prev => ({
          ...prev,
          [customEvent.detail.characterId]: customEvent.detail.hasAccess
        }));
      }
    };

    const handleChatCompleted = (event: Event) => {
      const customEvent = event as CustomEvent<{characterId: string}>;
      if (customEvent.detail?.characterId) {
        setAccessStatuses(prev => ({
          ...prev,
          [customEvent.detail.characterId]: false
        }));
      }
    };

    window.addEventListener('accessStatusChanged', handleAccessChange);
    window.addEventListener('chatCompleted', handleChatCompleted);

    return () => {
      window.removeEventListener('accessStatusChanged', handleAccessChange);
      window.removeEventListener('chatCompleted', handleChatCompleted);
    };
  }, []);

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  const getAccessBadge = (tutorId: string) => {
    if (isLoading) return null;
    
    if (accessStatuses[tutorId]) {
      return (
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10">
          Access Granted
        </div>
      );
    } else {
      return (
        <div className="absolute top-3 right-3 bg-gray-600 text-white text-xs px-2 py-1 rounded-full z-10 flex items-center gap-1">
          <span>10 LBAI</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-11a3 3 0 100 6 3 3 0 000-6z" />
          </svg>
        </div>
      );
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-pink-50 to-rose-100 py-12">
      <div className="fixed top-4 left-4 z-50">
        <BackButton />
      </div>
      <div
        className="fixed top-[6%] left-[-13.5%] h-full w-[30%] bg-cover bg-no-repeat z-40"
        style={{ backgroundImage: 'url(/tutors/Tree.png)' }}
      />

      {error && (
        <Alert variant="destructive" className="max-w-xl mx-auto mb-8">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            CHOOSE YOUR <br /> DATE
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Select a date option to begin your journey
          </p>
          {isLoading ? (
            <div className="animate-pulse text-gray-500">Loading access information...</div>
          ) : (
            <div className="text-sm text-gray-700 mb-6 bg-white/80 p-3 rounded-lg inline-block">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-2 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Each chat requires a one-time payment of 10 LBAI</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-2 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Access remains valid until the chat is completed</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <div
            className="date-card cursor-pointer relative"
            onClick={() => handleCardClick('/chat/chinese/mei')}
          >
            {getAccessBadge('mei')}
            <img src="/tutors/mei_chinese.jpg" alt="fine_dining" className="w-full" />
            <div className="date-card-overlay">
              <h2 className="text-xl font-semibold">Fine Dining</h2>
              <p className="text-white">Mei</p>
            </div>
          </div>
          
          <div 
            className="date-card cursor-pointer relative"
            onClick={() => handleCardClick('/chat/chinese/ting')}
          >
            {getAccessBadge('ting')}
            <img src="/images/networking-placeholder.jpg" alt="Networking" className="w-full" />
            <div className="date-card-overlay">
              <h2 className="text-xl font-semibold">Networking</h2>
              <p className="text-white">Ting</p>
            </div>
          </div>
          
          <div 
            className="date-card cursor-pointer relative"
            onClick={() => handleCardClick('/chat/chinese/xue')}
          >
            {getAccessBadge('xue')}
            <img src="/images/park-placeholder.jpg" alt="Park" className="w-full" />
            <div className="date-card-overlay">
              <h2 className="text-xl font-semibold">Park</h2>
              <p className="text-white">Xue</p>
            </div>
          </div>
          
          <div className="date-card relative">
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="bg-gray-900/80 p-4 rounded-lg text-center">
                <div className="text-gray-300 mb-2">Coming Soon</div>
                <Button disabled className="bg-gray-700 cursor-not-allowed">
                  Not Available
                </Button>
              </div>
            </div>
            <img src="/images/movie-placeholder.jpg" alt="Movie Date" className="w-full" />
            <div className="date-card-overlay">
              <h2 className="text-xl font-semibold">Movie Date</h2>
              <p className="text-gray-400">Available Soon</p>
            </div>
          </div>
        </div>
      </div>
      <DynamicBar />

      <style jsx>{`
        .date-card {
          position: relative;
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          min-height: 300px; /* Ensure a minimum height for each card */
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .date-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
        }

        .date-card img {
          width: 100%;
          height: auto;
          display: block;
        }

        .date-card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(35, 35, 35, 0.8);
          backdrop-filter: blur(2px);
          padding: 1rem;
          text-align: center;
          border-bottom-left-radius: 1rem;
          border-bottom-right-radius: 1rem;
        }

        .date-card-overlay h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: bold;
          color: white;
        }

        .date-card-overlay p {
          margin: 0.5rem 0 0;
          font-size: 0.9rem;
        }

        .text-white {
          color: white;
        }

        .text-gray-400 {
          color: #9ca3af;
        }

        h1 {
          font-family: 'Arial Black', Gadget, sans-serif; /* Adjust this to match the font in the images */
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          min-height: 650px; /* Ensure the grid container has enough height */
        }

        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}