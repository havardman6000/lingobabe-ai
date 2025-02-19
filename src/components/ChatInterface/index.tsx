// src/components/ChatInterface/index.tsx

'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChatMessageComponent } from './ChatMessage';
import { ChatOptions } from './ChatOptions';
import { ChatHeader } from './ChatHeader';
import { VideoPlayer } from './VideoPlayer';
import { ConfirmExitDialog } from '@/components/ConfirmExitDialog'; 
import { useChatStore } from '@/store/chatStore';
import { useWeb3 } from '@/components/providers/web3-provider';
import { characters, isValidCharacterId } from '@/data/characters';
import type { MessageContent, ChatMessage } from '@/types/chat';
import { MessageTrackerRef } from '@/components/LocalMessageTracker';
import { MessageStats } from '@/types/messageStore';
import { ChatCompletionPopup } from '../ChatCompletionPopup';
import  CharacterAccessControl from '../CharacterAccessControl';
export function ChatInterface() {
  // Core state management
  const { selectedCharacter, messages, happiness, currentScene, actions } = useChatStore();
  const { address } = useWeb3();
  const router = useRouter();
  const messageTracker = useRef<MessageTrackerRef>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Local UI state
  const [input, setInput] = useState('');
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [showUnsupportedMessage, setShowUnsupportedMessage] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  // Add state for exit confirmation dialog
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Access control state
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    // Check if input matches any option
    const matchesOption = currentSceneOptions.some(opt => {
      const primaryText = opt.chinese || opt.japanese || opt.korean || opt.spanish;
      return primaryText === e.target.value.trim();
    });
    
    setIsCustomInput(!matchesOption && e.target.value.trim() !== '');
  };
  
  // Message tracking state
  const [messageStats, setMessageStats] = useState<MessageStats>({
    messagesUsed: 0,
    messagesRemaining: 0,
    packagesPurchased: 0
  });

  const character = selectedCharacter && isValidCharacterId(selectedCharacter)
    ? characters[selectedCharacter]
    : null;

  const currentSceneOptions = character?.scenes[currentScene]?.options || [];
  const checkAccess = async () => {
    if (!window.tokenManager?.initialized || !address || !selectedCharacter) {
      setIsCheckingAccess(false);
      setHasAccess(false);
      return;
    }
  
    try {
      setIsCheckingAccess(true);
      
      // Check if completion is in progress
      const completionFlagKey = `completion_in_progress_${address.toLowerCase()}_${selectedCharacter}`;
      const isCompletionInProgress = localStorage.getItem(completionFlagKey) === 'true';
      
      if (isCompletionInProgress || showCompletionPopup) {
        // If completion is in progress, maintain current access state
        // to prevent the UI from flashing the access required screen
        setIsCheckingAccess(false);
        return;
      }
      
      // Regular access check flow
      const accessResult = await window.tokenManager.checkAccess(selectedCharacter);
      setHasAccess(accessResult.hasAccess);
      
      // If no access, ensure we clear any stale local storage data
      if (!accessResult.hasAccess) {
        const accessKey = `character_access_${address.toLowerCase()}_${selectedCharacter}`;
        localStorage.removeItem(accessKey);
      }
    } catch (error: any) {
      console.error('Failed to check access:', error);
      setError(error.message || 'Failed to verify access status');
      setHasAccess(false); // Default to no access on error
    } finally {
      setIsCheckingAccess(false);
    }
  };
  const showErrorMessage = (message: string) => {
    setError(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setError(null);
    }, 5000);
  };

  // Initialize token manager and check access
  // Listen for access status changes
  useEffect(() => {
    const handleAccessChange = (event: Event) => {
      const customEvent = event as CustomEvent<{characterId: string, hasAccess: boolean}>;
      if (customEvent.detail?.characterId === selectedCharacter) {
        setHasAccess(customEvent.detail.hasAccess);
      }
    };
    
    const handleChatCompleted = (event: Event) => {
      const customEvent = event as CustomEvent<{characterId: string}>;
      if (customEvent.detail?.characterId === selectedCharacter) {
        // Make sure access is revoked when chat is completed
        setHasAccess(false);
        // Also clear local storage
        if (address) {
          const accessKey = `character_access_${address.toLowerCase()}_${selectedCharacter}`;
          localStorage.removeItem(accessKey);
        }
      }
    };
  
    window.addEventListener('accessStatusChanged', handleAccessChange);
    window.addEventListener('chatCompleted', handleChatCompleted);
    
    return () => {
      window.removeEventListener('accessStatusChanged', handleAccessChange);
      window.removeEventListener('chatCompleted', handleChatCompleted);
    };
  }, [selectedCharacter, address]);

  const handleAccessGranted = () => {
    // Only update component state - the chat reset happens in the access control component
    setHasAccess(true);
    
    // If you need additional reset logic here:
    if (selectedCharacter) {
      // Get the initial scene for this character
      const initialScene = character?.scenes[1];
      if (initialScene && initialScene.initial) {
        // Reset to first message from character
        actions.reset();
        actions.selectCharacter(selectedCharacter);
      }
    }
  };

  // Audio playback management
  const createAudioElement = (audioBuffer: ArrayBuffer): HTMLAudioElement => {
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    return audio;
  };

  const playAudio = async (text: string) => {
    if (!text || audioPlaying) return;

    try {
      setAudioPlaying(true);

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language: character?.language || 'chinese'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const audioBuffer = await response.arrayBuffer();
      const audio = createAudioElement(audioBuffer);

      audio.onended = () => {
        setAudioPlaying(false);
        URL.revokeObjectURL(audio.src);
      };

      await audio.play();
    } catch (error) {
      console.error('Audio playback error:', error);
      setAudioPlaying(false);
      showErrorMessage('Failed to play audio. Please try again.');
    }
  };

  // Message handling
  const handleOptionSelect = async (text: string) => {
    setInput(text);
    setShowOptions(false);
  };

  const handlePlayAudio = async (text: string) => {
    if (audioPlaying) return;
    await playAudio(text);
  };
useEffect(() => {
    // If the popup is showing, ensure access check doesn't interfere
    if (showCompletionPopup && selectedCharacter && address) {
      // Create a temporary flag in localStorage to indicate completion in process
      const completionFlagKey = `completion_in_progress_${address.toLowerCase()}_${selectedCharacter}`;
      localStorage.setItem(completionFlagKey, 'true');
      
      // Cleanup when component unmounts or popup closes
      return () => {
        localStorage.removeItem(completionFlagKey);
      };
    }
  }, [showCompletionPopup, selectedCharacter, address]);
  
  // Then modify the checkAccess function to respect the completion flag

  useEffect(() => {
    // Use a function within the effect to avoid direct references
    const performAccessCheck = async () => {
      await checkAccess();
    };
    
    performAccessCheck();
    // Use refs for these dependencies to avoid re-renders
  }, [address, selectedCharacter]);
  const handleSend = async () => {
    if (!input.trim() || !selectedCharacter || !character || isTransitioning || !address) {
      showErrorMessage('Invalid input or connection state');
      return;

    }
    if (isCustomInput) {
      setShowUnsupportedMessage(true);
      setTimeout(() => setShowUnsupportedMessage(false), 4000);
      return;
    }    
  
    try {
      const selectedOption = currentSceneOptions.find(opt => {
        const primaryText = opt.chinese || opt.japanese || opt.korean || opt.spanish;
        return primaryText === input.trim();
      });
  
      if (!selectedOption) {
        showErrorMessage('Please select a valid response option');
        return;
      }
  
      // Add user message to the chat (this is local, not blockchain)
      const messageContent: MessageContent = {
        english: selectedOption.english,
        chinese: selectedOption.chinese,
        pinyin: selectedOption.pinyin,
        japanese: selectedOption.japanese,
        romaji: selectedOption.romaji,
        korean: selectedOption.korean,
        romanized: selectedOption.romanized,
        spanish: selectedOption.spanish,
        video: selectedOption.video
      };
  
      actions.addMessage({
        role: 'user',
        content: messageContent
      });
  
      // Update happiness locally, no blockchain needed here
      if (typeof selectedOption.points === 'number') {
        actions.updateHappiness(selectedCharacter, selectedOption.points);
        const happinessKey = `lingobabe_happiness_${address.toLowerCase()}_${selectedCharacter}`;
        const currentHappiness = happiness[selectedCharacter] || 50;
        const newHappiness = Math.min(100, Math.max(0, currentHappiness + selectedOption.points));
        localStorage.setItem(happinessKey, newHappiness.toString());
      }
  
      // Add assistant response if available
      if (selectedOption.response) {
        actions.addMessage({
          role: 'assistant',
          content: selectedOption.response
        });
  
        if (selectedOption.response.video) {
          setCurrentVideo(selectedOption.response.video);
        }
  
        const primaryText = selectedOption.response.chinese ||
                          selectedOption.response.japanese ||
                          selectedOption.response.korean ||
                          selectedOption.response.spanish;
        if (primaryText) {
          await playAudio(primaryText);
        }
      }
  
      // Progress to the next scene (local state change, no blockchain needed)
      if (currentScene >= 5) {
        setIsCompleted(true);
        if (window.tokenManager?.initialized && selectedCharacter) {
          try{
          const accessKey = `character_access_${address.toLowerCase()}_${selectedCharacter}`;
          const storedAccess = localStorage.getItem(accessKey);
          if (storedAccess) {
            try {
              const accessData = JSON.parse(storedAccess);
              accessData.completed = true;
              // Don't revoke access yet - this prevents the access screen from showing
              localStorage.setItem(accessKey, JSON.stringify(accessData));
            } catch (e) {
              console.error('Error updating access data:', e);
            }
          }
        } catch (completionError) {
          console.error('Error marking chat as completed:', completionError);
        }
      }
        // IMPORTANT: Mark chat as completed before showing end popup
        // if (selectedCharacter) {
        //   try {
        //     // Update local storage to mark completion
        //     const accessKey = `character_access_${address.toLowerCase()}_${selectedCharacter}`;
        //     const storedAccess = localStorage.getItem(accessKey);
        //     if (storedAccess) {
        //       try {
        //         const accessData = JSON.parse(storedAccess);
        //         accessData.completed = true;
        //         accessData.hasAccess = false; // Explicitly revoke access
        //         localStorage.setItem(accessKey, JSON.stringify(accessData));
        //       } catch (e) {
        //         console.error('Error updating access data:', e);
        //       }
        //     }
            
        //     // Don't call blockchain methods here, just update UI state
        //     setHasAccess(false);
            
        //     // Dispatch UI update events without blockchain calls
        //     window.dispatchEvent(new CustomEvent('accessStatusChanged', { 
        //       detail: { 
        //         characterId: selectedCharacter,
        //         hasAccess: false 
        //       } 
        //     }));
            
        //     window.dispatchEvent(new CustomEvent('chatCompleted', {
        //       detail: { characterId: selectedCharacter }
        //     }));
        //   } catch (completionError) {
        //     console.error('Error marking chat as completed:', completionError);
        //   }
        // }
        
        // Show completion popup instead of navigating
        setShowCompletionPopup(true);
        
        // Clean up local storage
        localStorage.removeItem(`scene_${selectedCharacter}_${address.toLowerCase()}`);
      } else {
        // Continue to next scene - DON'T end the chat
        setIsTransitioning(true);
      
        localStorage.setItem(`scene_${selectedCharacter}_${address.toLowerCase()}`,
          (currentScene + 1).toString()
        );
      
        setTimeout(() => {
          actions.setScene(currentScene + 1);
          setIsTransitioning(false);
        }, 1000);
      }
  
      setInput('');
      setShowOptions(false);
  
    } catch (error: any) {
      console.error('Chat error:', error);
      showErrorMessage(error.message || 'Failed to send message');
      setIsTransitioning(false);
      setInput('');
    }
  };
  
  // Handler for Back button in ChatHeader - shows confirmation dialog
  const handleBackClick = () => {
    setShowExitConfirmation(true);
    setPendingNavigation(`/chat/${character?.language}`);
  };

  // Handler for completing a chat - no confirmation needed since this is expected
  const handleEndChat = () => {
    // IMPORTANT: Never call blockchain methods here
    
    if (selectedCharacter && address) {
      // 1. Only update local storage - NO blockchain calls
      const accessKey = `character_access_${address.toLowerCase()}_${selectedCharacter}`;
      localStorage.removeItem(accessKey);
      
      // 2. Set local state
      setHasAccess(false);
      
      // 3. Show completion popup
      setShowCompletionPopup(true);
  
      // 4. Dispatch UI update events
      window.dispatchEvent(new CustomEvent('accessStatusChanged', { 
        detail: { 
          characterId: selectedCharacter,
          hasAccess: false 
        } 
      }));
      
      window.dispatchEvent(new CustomEvent('chatCompleted', {
        detail: { characterId: selectedCharacter }
      }));
    }
    
    // Critical: Don't navigate away here - let the popup handle navigation
  };

if (!hasAccess && selectedCharacter && !isCompleted && !showCompletionPopup) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Access Required</h1>
          <p className="text-gray-300 mb-6 text-center">
            You need to pay 10 LBAI tokens to chat with {character?.name || 'this character'}.
          </p>
          
          {/* Use either your updated CharacterAccessControl or the new EnhancedAccessControl */}
          <CharacterAccessControl
            characterId={selectedCharacter}
            onAccessGranted={handleAccessGranted}
            className="w-full"
          />
        </div>
      </div>
    );
  }
  

  // Handler for the return to selection screen - shows confirmation
  const handleReturnToSelection = () => {
    setShowExitConfirmation(true);
    setPendingNavigation(`/chat/${character?.language || ''}`);
  };

  // Confirm exit handlers
  const handleConfirmExit = () => {
    if (selectedCharacter && address) {
      // Immediately remove access in local storage
      const accessKey = `character_access_${address.toLowerCase()}_${selectedCharacter}`;
      localStorage.removeItem(accessKey);
      
      // Update UI by dispatching events
      window.dispatchEvent(new CustomEvent('accessStatusChanged', {
        detail: { 
          characterId: selectedCharacter,
          hasAccess: false
        }
      }));
      
      setHasAccess(false);
    }
    
    // Close dialog and navigate immediately
    setShowExitConfirmation(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };
  
  
  const handleStayInChat = () => {
    setShowExitConfirmation(false);
    setPendingNavigation(null);
  };

  // Render loading state
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-4 text-center">Access Required</h1>
          <p className="text-gray-300 mb-8 text-center">
            You need to pay 10 LBAI tokens to chat with {character?.name || 'this character'}.
          </p>
          
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => router.push(`/chat/${character?.language}/${selectedCharacter}`)}
              className="bg-green-600 hover:bg-green-700 text-white py-3"
            >
              Purchase Access
            </Button>
            
            <Button
              variant="outline"
              onClick={() => router.push(`/chat/${character?.language}`)}
              className="text-white border-gray-600 hover:bg-gray-700"
            >
              Return to CharacterSelection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render access control if user doesn't have access
  if (!hasAccess && selectedCharacter) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Access Required</h1>
            <p className="text-gray-300 mb-6">
              You need to pay 10 LBAI tokens to chat with {character?.name || 'this character'}.
            </p>
              
              <CharacterAccessControl
                characterId={selectedCharacter}
                onAccessGranted={handleAccessGranted}
                className="w-full"
              />
              
              <Button
                variant="outline"
                onClick={handleReturnToSelection}
                className="mt-6 text-white border-gray-600 hover:bg-gray-700"
              >
                Return to Character Selection
              </Button>
            </div>
          </div>
        </div>
    );
  }

  // Replace the entire return statement - no hooks inside the render method

  return (
    <Card style={{ backgroundColor: '#101827', color: 'white' }} className="flex flex-col h-screen">
      <ChatHeader
        characterName={character?.name || ''}
        happiness={happiness[selectedCharacter || ''] || 50}
        characterId={selectedCharacter || ''}
        onBack={handleBackClick} 
      />
  
      {showError && error && (
        <Alert variant="destructive" className="mx-4 mt-4" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
  
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Video player with accessibility improvements */}
        {currentVideo && (
          <div className="sticky top-0 z-30 w-full flex justify-center py-3" style={{ background: 'transparent' }}>
            <div className="max-w-xs aspect-video bg-transparent">
              <div className="overflow-hidden rounded-lg shadow-lg">
                <VideoPlayer 
                  src={currentVideo} 
                  className="w-full h-full object-cover" 
                  aria-Label={`Video from ${character?.name || 'tutor'}`}
                />
              </div>
            </div>
          </div>
        )}
      
        {/* Chat messages with improved scroll accessibility */}
        <div 
          className="flex-1 overflow-y-auto px-2 sm:px-4" 
          style={{ backgroundColor: '#101827' }}
          tabIndex={0}
          role="log"
          aria-label="Chat history"
          aria-live="polite"
        >
          <div className="w-full pt-4 pb-8">
            {messages.map((message, i) => (
              <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                <ChatMessageComponent
                  message={{
                    role: message.role as 'user' | 'assistant',
                    content: message.content,
                    timestamp: message.timestamp
                  }}
                  avatarSrc={character?.image}
                  onPlayAudio={handlePlayAudio}
                  audioPlaying={audioPlaying}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
  
      {/* Input area with accessibility improvements */}
      <div style={{ backgroundColor: '#1f2937' }} className="p-2 sm:p-3">
        <div className="relative">
          {showUnsupportedMessage && (
            <div className="absolute bottom-full left-0 w-full bg-gray-800 rounded-t-lg shadow-lg p-3 mb-2 text-white text-sm">
              Free chat is still under development. Please select from the available options.
              <button 
                className="absolute top-1 right-1 text-gray-400 hover:text-white"
                onClick={() => setShowUnsupportedMessage(false)}
                aria-label="Close message"
              >
                ×
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="options-button"
              aria-label="Show response options"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                className="h-5 w-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
  
            <div className="flex-1">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Type or select a message..."
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 min-h-[44px]"
                aria-label="Message input"
              />
            </div>
  
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTransitioning}
              className="send-button"
              aria-label="Send message"
            >
              <span className="hidden sm:inline">Send</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                className="h-5 w-5 sm:hidden" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
  
          {/* Options dropdown */}
          {showOptions && currentSceneOptions.length > 0 && (
            <div className="options-dropdown absolute bottom-full left-0 w-full bg-gray-800 rounded-t-lg shadow-lg p-3 z-20 max-h-60vh overflow-y-auto">
              <ChatOptions
                options={currentSceneOptions}
                onSelectOption={handleOptionSelect}
                onPlayAudio={handlePlayAudio}
                audioPlaying={audioPlaying}
              />
            </div>
          )}
        </div>
      </div>
  
      {/* Accessibility improvements for dialogs */}
      <ConfirmExitDialog
        open={showExitConfirmation}
        onClose={() => setShowExitConfirmation(false)}
        onConfirmExit={handleConfirmExit}
        onStayInChat={handleStayInChat}
      />
  
      {showCompletionPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="completion-title">
          <ChatCompletionPopup 
            language={character?.language}
            onClose={() => {
              // Now revoke access and navigate away
              if (selectedCharacter && address) {
                const accessKey = `character_access_${address.toLowerCase()}_${selectedCharacter}`;
                localStorage.removeItem(accessKey);
                
                setHasAccess(false);
                
                window.dispatchEvent(new CustomEvent('accessStatusChanged', {
                  detail: { 
                    characterId: selectedCharacter,
                    hasAccess: false 
                  }
                }));
              }
              
              setShowCompletionPopup(false);
              setIsCompleted(false); 
              router.push(`/chat/${character?.language}`);
            }}    
          />
        </div>
      )}
      <style jsx>{`
      .chat-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        max-height: 100vh;
        overflow: hidden;
      }

      .chat-header {
        flex-shrink: 0;
        padding: 8px;
        background-color: #1f2937;
      }

      .chat-body {
        flex-grow: 1;
        overflow-y: auto;
        padding: 12px;
        display: flex;
        flex-direction: column;
      }

      .chat-video-container {
       width: 100%;
    max-height: 25vh; /* Reduced for mobile */
    margin: 0 auto 8px;
      }

      .chat-messages {
        flex-grow: 1;
        overflow-y: auto;
        width: 100%;
      }

      .chat-input {
        flex-shrink: 0;
        padding: 8px;
        background-color: #1f2937;
      }

      .options-button {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 36px;
        min-height: 36px;
        padding: 6px;
        background-color: #374151;
        color: white;
        border-radius: 6px;
      }

      .send-button {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 36px;
        min-height: 36px;
        padding: 6px 12px;
        background-color: #10b981;
        color: white;
        border-radius: 6px;
        font-size: 14px;
      }

      .send-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .options-dropdown {
         position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    max-height: 50vh; /* Limit height on mobile */
    overflow-y: auto;
    z-index: 30;
      }

      @media (min-width: 640px) {
        .chat-header {
          padding: 12px 16px;
        }
        
        .chat-body {
          padding: 16px;
        }
        
        .chat-video-container {
    max-height: 40vh;
      max-width: 560px;      }

        .chat-input {
          padding: 12px 16px;
        }
        
        .options-button,
        .send-button {
          min-width: 44px;
          min-height: 44px;
        }
           .options-dropdown {
      max-height: 60vh;
    }
      }
    `}</style>
  </Card>
);
}
