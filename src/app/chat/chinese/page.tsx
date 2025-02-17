// src/app/chat/chinese/page.tsx
'use client';

import { useWeb3 } from '@/components/providers/web3-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DynamicBar from '@/components/DynamicBar';

export default function DateSelectionPage() {
  const { isConnected } = useWeb3();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  if (!isConnected) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-pink-50 to-rose-100 py-12">
      <div
        className="fixed top-[6%] left-[-13.5%] h-full w-[30%] bg-cover bg-no-repeat z-40"
        style={{ backgroundImage: 'url(/tutors/Tree.png)' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            CHOOSE YOUR <br /> DATE
          </h1>
          <p className="text-lg text-gray-600">
            Select a date option to begin your journey
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <div
            className="date-card cursor-pointer"
            onClick={() => handleCardClick('/chat/chinese/mei')}
          >
            <img src="/tutors/mei_chinese.jpg" alt="fine_dining" className="w-full" />
            <div className="date-card-overlay">
              <h2 className="text-xl font-semibold">Fine Dining</h2>
              <p className="text-white">Mei</p>
            </div>
          </div>
          <div className="date-card">
            <img src="/images/networking-placeholder.jpg" alt="Networking" className="w-full" />
            <div className="date-card-overlay">
              <h2 className="text-xl font-semibold">Networking</h2>
              <p className="text-gray-600">Ting</p>
            </div>
          </div>
          <div className="date-card">
            <img src="/images/park-placeholder.jpg" alt="Park" className="w-full" />
            <div className="date-card-overlay">
              <h2 className="text-xl font-semibold">Park</h2>
              <p className="text-gray-600">Xue</p>
            </div>
          </div>
          <div className="date-card">
            <img src="/images/movie-placeholder.jpg" alt="Movie Date" className="w-full" />
            <div className="date-card-overlay">
              <h2 className="text-xl font-semibold">Movie Date</h2>
              <p className="text-gray-600">Mei Mei</p>
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
          background: rgba(135, 135, 135, 0.8);
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
        }

        .text-white {
          color: white;
        }

        .text-gray-600 {
          color: #666;
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
// src/app/chat/chinese/page.tsx