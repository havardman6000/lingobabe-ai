// src/app/page.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/language-selector');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 to-green-300 flex flex-col items-center justify-center p-8 relative">
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
        <source src="/tutors/Lingobabe_landing.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-center">
        <button
          onClick={handleGetStarted}
          className="bg-green-500 text-white px-16 py-4 rounded-full text-xl font-semibold hover:bg-green-600 transition duration-300"
          style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#089e7d',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          GET STARTED
        </button>
      </div>
    </div>
  );
}