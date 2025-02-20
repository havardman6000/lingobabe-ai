// src/components/pages/SuccessPage.tsx
import React from 'react';
import Image from 'next/image';
import ContinueButton from '../ContinueButton';
import SurveyLayout from '../SurveyLayout';

const SuccessPage = () => {
  return (
    <SurveyLayout>
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 min-h-0">
        {/* Message Container with Stars */}
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
      </div>

      {/* Continue Button Container */}
      <div className="w-full px-4 md:px-[40px] mt-3 md:mt-6 mb-4 md:mb-10">
        <ContinueButton onClick={() => {}} nextPage='/welcome-survey/benefits' />
      </div>
    </SurveyLayout>
  );
};

export default SuccessPage;