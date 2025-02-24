"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import SurveyLayout from '../SurveyLayout';
import { useSurvey } from '@/context/SurveyContext';
import { useRouter } from 'next/navigation';

const DailyGoalPage = () => {
  const router = useRouter();
  const { surveyData, updateSurveyData } = useSurvey();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeOptions = [
    '5 MIN/DAY',
    '10 MIN/DAY',
    '15 MIN/DAY',
    '20 MIN/DAY',
    '30 MIN/DAY'
  ];

  const handleTimeSelect = (time: string) => {
    updateSurveyData({ dailyGoal: time });
    setError(null);
  };

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Almost there!</h3>
        <p className="text-gray-600">Saving your preferences...</p>
      </div>
    </div>
  );

  const handleSubmit = async () => {
    if (!surveyData.dailyGoal || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Save to localStorage first
      localStorage.setItem('lingobabe_survey_data', JSON.stringify(surveyData));
      
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit survey');
      }

      // Set completion flag and navigate
      localStorage.setItem('lingobabe_survey_completed', 'true');
      router.push('/welcome-survey/success');
      
    } catch (err: any) {
      console.error('Survey submission error:', err);
      setError(err.message || 'Failed to submit survey. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <SurveyLayout showBackButton showProgressBar currentStep={5}>
      {isSubmitting && <LoadingOverlay />}
      
      <div className="flex-1 flex flex-col md:flex-row items-center w-full px-4 min-h-0 md:px-20 md:pt-4">
        {/* Message Container */}
        <div className="w-full md:w-[45%] flex justify-center md:justify-end mb-2 md:mb-0 mt-[-20px] md:mt-0">
          <div className="w-[300px] h-[240px] md:w-[500px] md:h-[350px] relative">
            <Image
              src="/assets/image/onboarding msg_6.png"
              alt="What's your daily learning goal?"
              width={500}
              height={350}
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Options Container */}
        <div className="w-full md:w-[55%] flex justify-center md:justify-start md:pl-20">
          <div className="w-full max-w-[335px] md:max-w-[450px] flex flex-col gap-[6px] md:gap-3">
            {timeOptions.map((option) => (
              <button
                key={option}
                className={`w-full h-[38px] md:h-[48px] border-2 rounded-[5px] text-sm md:text-lg transition-colors px-2 ${
                  surveyData.dailyGoal === option
                    ? 'bg-[#00C853] text-white border-[#00C853]'
                    : 'border-[#00C853] text-[#00C853] hover:bg-[#00C853] hover:text-white'
                }`}
                onClick={() => handleTimeSelect(option)}
                disabled={isSubmitting}
              >
                {option}
              </button>
            ))}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="w-full px-4 md:px-[40px] mt-3 md:mt-6 mb-4 md:mb-10">
        <button
          onClick={handleSubmit}
          disabled={!surveyData.dailyGoal || isSubmitting}
          className={`w-full max-w-[400px] h-[50px] mx-auto bg-[#00C853] text-white rounded-[10px] flex items-center justify-center text-xl font-semibold disabled:opacity-50 md:max-w-full md:h-[60px] md:rounded-[10px] ${isSubmitting ? 'cursor-not-allowed' : 'hover:bg-[#00B548]'}`}
        >
          {isSubmitting ? 'Submitting...' : 'CONTINUE'}
        </button>
      </div>
    </SurveyLayout>
  );
};

export default DailyGoalPage;