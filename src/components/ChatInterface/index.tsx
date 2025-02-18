// src/components/ChatInterface/index.tsx
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
import { useChatStore } from '@/store/chatStore';
import { useWeb3 } from '@/components/providers/web3-provider';
import { characters, isValidCharacterId } from '@/data/characters';
import type { MessageContent, ChatMessage } from '@/types/chat';
import Web3 from 'web3';
import { MessageTrackerRef } from '@/components/LocalMessageTracker';
import { MessageStats } from '@/types/messageStore';
import CharacterAccessControl from '@/components/CharacterAccessControl';

export function ChatInterface() {
  // Core state management
  const { selectedCharacter, messages, happiness, currentScene, actions } = useChatStore();
  const { address } = useWeb3();
  const router = useRouter();
  const messageTracker = useRef<MessageTrackerRef>(null);

  // Local UI state
  const [input, setInput] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  // Access control state
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

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

  const showErrorMessage = (message: string) => {
    setError(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setError(null);
    }, 5000);
  };

  // Initialize token manager and check access
  useEffect(() => {
    const initialize = async () => {
      if (!window.ethereum || !address) {
        setIsCheckingAccess(false);
        return;
      }

      try {
        // Initialize token manager if needed
        if (window.tokenManager && !window.tokenManager.initialized) {
          const web3 = new Web3(window.ethereum);
          await window.tokenManager.initialize(web3);
        }

        // Check access if we have a selected character
        if (selectedCharacter && window.tokenManager?.initialized) {
          const accessResult = await window.tokenManager.checkAccess(selectedCharacter);
          setHasAccess(accessResult.hasAccess);
        }
      } catch (error) {
        console.error('Initialization error:', error);
        showErrorMessage('Failed to connect to wallet or verify access.');
      } finally {
        setIsCheckingAccess(false);
      }
    };

    initialize();
  }, [address, selectedCharacter]);

  // Listen for access status changes
  useEffect(() => {
    const handleAccessChange = (event: Event) => {
      const customEvent = event as CustomEvent<{characterId: string, hasAccess: boolean}>;
      if (customEvent.detail?.characterId === selectedCharacter) {
        setHasAccess(customEvent.detail.hasAccess);
      }
    };
    
    window.addEventListener('accessStatusChanged', handleAccessChange);
    return () => {
      window.removeEventListener('accessStatusChanged', handleAccessChange);
    };
  }, [selectedCharacter]);

  const handleAccessGranted = () => {
    setHasAccess(true);
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

  const handleSend = async () => {
    if (!input.trim() || !selectedCharacter || !character || isTransitioning || !address) {
      showErrorMessage('Invalid input or connection state');
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
  
      if (typeof selectedOption.points === 'number') {
        actions.updateHappiness(selectedCharacter, selectedOption.points);
  
        const happinessKey = `lingobabe_happiness_${address.toLowerCase()}_${selectedCharacter}`;
        const currentHappiness = happiness[selectedCharacter] || 50;
        const newHappiness = Math.min(100, Math.max(0, currentHappiness + selectedOption.points));
        localStorage.setItem(happinessKey, newHappiness.toString());
      }

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
  
      if (currentScene < 5) {
        setIsTransitioning(true);
  
        localStorage.setItem(`scene_${selectedCharacter}_${address.toLowerCase()}`,
          (currentScene + 1).toString()
        );
  
        setTimeout(() => {
          actions.setScene(currentScene + 1);
          setIsTransitioning(false);
        }, 1000);
      } else {
        setShowEndPopup(true);
        // Clear access since chat is completed
        if (window.tokenManager?.initialized) {
          window.tokenManager.markChatCompleted(selectedCharacter);
        }
        localStorage.removeItem(`scene_${selectedCharacter}_${address.toLowerCase()}`);
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

  const handleReturnToSelection = () => {
    router.push(`/chat/${character?.language || ''}`);
  };

  // Render loading state
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Verifying access...</div>
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
              Return to Selection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card style={{ backgroundColor: '#101827', color: 'white' }} className="flex flex-col h-screen">
      <ChatHeader
        characterName={character?.name || ''}
        happiness={happiness[selectedCharacter || ''] || 50}
        onBack={() => router.push(`/chat/${character?.language}`)}
      />

      {showError && error && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div style={{ backgroundColor: '#101827' }} className="flex-1 flex flex-col items-center justify-center relative p-4 space-y-4">
        {currentVideo && (
          <div className="max-w-xs max-h-64 w-full aspect-video bg-black z-10">
            <VideoPlayer src={currentVideo} className="w-full h-full object-cover" />
          </div>
        )}

        <div style={{ backgroundColor: '#101827' }} className="flex-1 overflow-y-auto w-full mt-4 pb-8">
          {messages.map((message, i) => (
            <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <ChatMessageComponent
                key={i}
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

      <div style={{ backgroundColor: '#1f2937' }} className="p-4">
        <div className="relative">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowOptions(!showOptions)}
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded"
            >
              Show Options
            </Button>

            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type or select a message..."
                className="w-full bg-gray-700 text-white"
                readOnly
              />
            </div>

            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTransitioning}
              className="bg-green-600 hover:bg-green-700 text-white px-6"
            >
              Send
            </Button>
          </div>

          {showOptions && currentSceneOptions.length > 0 && (
            <div className="absolute bottom-full left-0 w-full bg-gray-800 rounded-t-lg shadow-lg p-4">
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

      {showEndPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Conversation Ended</h2>
            <p className="mb-4">Thank you for participating!</p>
            <Button
              onClick={() => {
                setShowEndPopup(false);
                router.push(`/chat/${character?.language}`);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Back to Tutors
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}