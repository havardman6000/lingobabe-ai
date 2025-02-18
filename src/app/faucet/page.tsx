// src/app/faucet/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function FaucetPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleClaimFaucet = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!window.tokenManager || !window.tokenManager.initialized) {
        throw new Error('Token manager not initialized');
      }
      
      await window.tokenManager.claimFaucet();
      setSuccess(true);
      setTimeout(() => {
        router.push('/language-selector');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to claim from faucet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-rose-100 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Claim LBAI Tokens
        </h1>
        
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">
            Get 100 LBAI tokens to start chatting with your favorite tutors!
          </p>
          <div className="text-lg font-semibold text-gray-800 mb-2">
            What you'll get:
          </div>
          <ul className="text-gray-600 space-y-2 mb-6">
            <li>• 100 LBAI Tokens</li>
            <li>• Enough for 2 chat packages</li>
            <li>• Start learning immediately</li>
          </ul>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              Successfully claimed tokens! Redirecting...
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleClaimFaucet}
            disabled={isLoading || success}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-medium"
          >
            {isLoading ? 'Claiming...' : 'Claim Tokens'}
          </Button>
          
          <Button
            onClick={() => router.push('/language-selector')}
            variant="outline"
            className="w-full"
          >
            Back to Languages
          </Button>
        </div>
      </div>
    </div>
  );
}