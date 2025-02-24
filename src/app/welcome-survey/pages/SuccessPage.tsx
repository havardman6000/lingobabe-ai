"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import SurveyLayout from '../SurveyLayout';
import { useRouter } from 'next/navigation';

const SuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Ensure completion flag is set
    if (localStorage.getItem('lingobabe_survey_completed') !== 'true') {
      localStorage.setItem('lingobabe_survey_completed', 'true');
    }

    // Auto-progress to benefits after 2 seconds
    const timer = setTimeout(() => {
      router.push('/welcome-survey/benefits');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SurveyLayout>
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 min-h-0">
        <div className="relative w-[300px] h-[240px] md:w-[300px] md:h-[400px]">
          <Image
            src="/assets/image/onboarding_msg tp_1.png"
            alt="Awesome! Can't wait to get you speak like a Mr International!"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
        
        <div className="mt-8 text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Taking you to the next step...</p>
        </div>
      </div>
    </SurveyLayout>
  );
};

export default SuccessPage;
//src/app/welcome-survey/pages/SuccessPage.tsx