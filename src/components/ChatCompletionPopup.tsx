// src/components/ChatCompletionPopup.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ChatCompletionPopupProps {
  language?: string;
  onClose?: () => void;
}

export function ChatCompletionPopup({ language = 'chinese', onClose }: ChatCompletionPopupProps) {
    const router = useRouter();
    
    const handleBackToTutors = () => {
      if (onClose) onClose();
      router.push(`/chat/${language}`);
    };
  
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
            {/* Add accessible title element with id */}
            <h2 id="completion-title" className="text-3xl font-bold text-white mb-4 sr-only">Chat Completed</h2>
            
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 aria-hidden="true" className="text-3xl font-bold text-white mb-4">Chat Completed!</h2>
            <p className="text-gray-300 mb-8">
              Thank you for participating in this conversation. We hope you enjoyed the experience!
            </p>
            
            <Button
              onClick={handleBackToTutors}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-8 rounded-full text-lg shadow-lg"
            >
              Back to Tutors
            </Button>
          </div>
        </div>
      );
    }
// src/components/ChatCompletionPopup.tsx