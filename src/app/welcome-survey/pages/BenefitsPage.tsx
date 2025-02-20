import React from 'react';
import Image from 'next/image';
import ContinueButton from '../ContinueButton';
import SurveyLayout from '../SurveyLayout';
import { useRouter } from 'next/navigation';

const BenefitsPage = () => {
  const router = useRouter();
  const benefits = [
    {
      icon: '⭐',
      title: 'CONVERSE WITH CONFIDENCE',
      description: 'Hold smooth, engaging conversations and effortlessly spark attraction. No more awkward silences—just natural, confident flow.'
    },
    {
      icon: '🗣️',
      title: 'SPEAK LIKE A LOCAL',
      description: 'Go beyond vocabulary—master phrases, slang, and expressions that make you sound authentic, not like a textbook.'
    },
    {
      icon: '🔥',
      title: 'MASTER THE ART OF CHARM',
      description: 'Learn to flirt, tease, and banter effortlessly. Impress women with your wit, humor, and charismatic presence.'
    }
  ];
const handleContinue = () => {
    // Mark survey as completed
    localStorage.setItem('lingobabe_survey_completed', 'true');
    // Navigate to language selector
    router.push('/language-selector');
  };
  return (
    <SurveyLayout>
      <div className="flex-1 flex flex-col items-center w-full px-4 md:px-20 pt-2 md:pt-4 min-h-0">
        {/* Title Section */}
        <div className="text-center mb-2 md:mb-6">
          <h1 className="text-xl md:text-4xl font-bold font-league-spartan text-[#000000]">MASTER THE ART OF CHARM</h1>
          <h2 className="text-base md:text-2xl text-[#00C853] font-league-spartan mt-1">IN DIFFERENT LANGUAGES!</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-center w-full max-w-[1200px] gap-4 md:gap-12">
          {/* Left Image Container */}
          <div className="w-full md:w-[45%] flex justify-center">
            <div className="w-[300px] h-[200px] md:w-[500px] md:h-[350px] relative">
              <Image
                src="/assets/image/onboarding_msg tp_2.png"
                alt="Here's what you can achieve in 3 months or less!"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Right Image Container (Benefits) */}
          <div className="w-full md:w-[55%] flex justify-center md:justify-start">
            <div className="w-[300px] h-[250px] md:w-[500px] md:h-[350px] relative">
              <Image
                src="/assets/image/onboarding_msg tp_2.1.png"
                alt="Benefits description"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button Container */}
      <div className="w-full px-4 md:px-[40px] mt-3 md:mt-8 mb-4 md:mb-10">
        <ContinueButton onClick={() => {}} nextPage='/language-selector'/>
      </div>
    </SurveyLayout>
  );
};

export default BenefitsPage; 