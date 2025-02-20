"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ContinueButton from '../ContinueButton';
import SurveyLayout from '../SurveyLayout';
import { useSurvey } from '@/context/SurveyContext';
import { useRouter } from 'next/navigation';

const DailyGoalPage = () => {
  const router = useRouter();
  const { surveyData, updateSurveyData } = useSurvey();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timeOptions = [
    '5 MIN/DAY',
    '10 MIN/DAY',
    '15 MIN/DAY',
    '20 MIN/DAY',
    '30 MIN/DAY'
  ];

  const handleTimeSelect = (time: string) => {
    updateSurveyData({ dailyGoal: time });
    setSubmitStatus('idle');
    setErrorMessage(null);
  };

  const handleContinue = async () => {
    if (!surveyData.dailyGoal || isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitStatus('loading');
    
    // Always save to localStorage as backup
    try {
      localStorage.setItem('lingobabe_survey_data', JSON.stringify(surveyData));
      console.log('Survey data saved to localStorage:', surveyData);
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
    
    try {
      // Attempt to submit to the API
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
        cache: 'no-store',
      });

      const result = await response.json();
      console.log('Response from API:', result);

      // Check the Google response for detailed errors
      if (result.googleResponse) {
        try {
          const googleData = typeof result.googleResponse === 'string' 
            ? JSON.parse(result.googleResponse) 
            : result.googleResponse;
            
          console.log('Google response details:', googleData);
          
          // If Google reports an error but our API returned 200, handle it
          if (googleData.status === 'error' && response.ok) {
            setErrorMessage(`Google Form error: ${googleData.message || 'Unknown error'}`);
            setSubmitStatus('error');
            setIsSubmitting(false);
            return;
          }
        } catch (e) {
          console.warn('Could not parse Google response', e);
        }
      }

      if (response.ok) {
        // Success case
        setSubmitStatus('success');
        // Navigate with a small delay for better UX
        setTimeout(() => router.push('/welcome-survey/success'), 800);
      } else {
        // Error from our API
        setSubmitStatus('error');
        setErrorMessage(result.message || 'Failed to submit your response');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Submission error:', err);
      
      // Fallback to success path with localStorage saved data
      setSubmitStatus('success');
      setErrorMessage(null);
      // Still navigate to success but with a message in console
      console.warn('Continuing to success page with locally saved data only');
      setTimeout(() => router.push('/success'), 800);
    }
  };

  return (
    <SurveyLayout showBackButton showProgressBar currentStep={5}>
      <div className="flex-1 flex flex-col md:flex-row items-center md:items-start w-full px-4 min-h-0 md:px-20 md:pt-4 h-full">
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
            
            {submitStatus === 'error' && errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                <p className="font-medium">Submission failed</p>
                <p>{errorMessage}</p>
                <p className="mt-1 text-xs">Your data has been saved locally.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Continue Button Container */}
      <div className="w-full px-4 md:px-[40px] mt-3 md:mt-6 mb-4 md:mb-10">
        <ContinueButton 
          onClick={handleContinue} 
          disabled={!surveyData.dailyGoal || isSubmitting}
          isLoading={isSubmitting}
        />
      </div>
    </SurveyLayout>
  );
};

export default DailyGoalPage;