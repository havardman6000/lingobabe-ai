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
import { messageStore } from '@/services/messageStore';
import HappinessTracker from '../EnhancedHappinessTracker';
import { MessageMenu } from './MessageMenu';
import BatchMessageTracker from '@/components/BatchMessageTracker';
import Web3 from 'web3';


interface MessagingControlsProps {
  onSend: () => void;
  disabled: boolean;
  input: string;
  setInput: (input: string) => void;
}

interface MessageStatsProps {
  stats: {
    messagesRemaining: number;
  };
  onPurchase: () => void;
  className?: string;
}

const MessagingControls: React.FC<MessagingControlsProps> = ({ 
  onSend, 
  disabled, 
  input, 
  setInput 
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex items-center space-x-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-700 border-gray-600 text-white"
          onKeyDown={(e) => e.key === 'Enter' && !disabled && onSend()}
          disabled={disabled}
        />
        <Button
          onClick={onSend}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={disabled}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

const MessageStats: React.FC<MessageStatsProps> = ({ stats, onPurchase, className = "" }) => {
  return (
    <div className={`absolute top-4 right-4 z-50 flex items-center gap-4 ${className}`}>
      <div className="text-sm bg-gray-900 p-2 rounded flex items-center gap-2">
        <span className="text-green-400">{stats.messagesRemaining}/50 Messages</span>
        <Button
          onClick={onPurchase}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          Buy More
        </Button>
      </div>
    </div>
  );
};




interface MessageTracker {
  useMessage: () => Promise<boolean>;
  canSendMessage: () => boolean;
  currentApprovedCount: number;
}


export function ChatInterface() {
  // Core state management
  const { selectedCharacter, messages, happiness, currentScene, actions } = useChatStore();
  const { address } = useWeb3();
  const router = useRouter();

  // Local UI state
  const [input, setInput] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  // Message tracking state
  const [messageStats, setMessageStats] = useState(() => 
    address ? messageStore.getStats(address) : null
  );// Message stats management

  const messageTracker = useRef<MessageTracker | null>(null);

  useEffect(() => {
    const initializeTokenManager = async () => {
      if (window.ethereum && address && window.tokenManager) {
        try {
          const web3 = new Web3(window.ethereum);
          await window.tokenManager.initialize(web3);
          // Add debug logging
          console.log('TokenManager initialized successfully');
          
          // Test token allowance
          const allowance = await window.tokenManager.checkTokenAllowance();
          console.log('Token allowance:', allowance);
        } catch (error) {
          console.error('Failed to initialize TokenManager:', error);
          showErrorMessage('Failed to connect to wallet. Please try again.');
        }
      }
    };
  
    initializeTokenManager();
  }, [address]);

  const [canSendMessages, setCanSendMessages] = useState(true);
  const handleApprovalComplete = useCallback(() => {
    setCanSendMessages(true);
  }, []);
  // Character and scene data
  const character = selectedCharacter && isValidCharacterId(selectedCharacter)
    ? characters[selectedCharacter]
    : null;

  const currentSceneOptions = character?.scenes[currentScene]?.options || [];
  const [pendingMessages, setPendingMessages] = useState([]);
  const [isApproving, setIsApproving] = useState(false);


  const handleMessageApproval = useCallback(async () => {
    if (pendingMessages.length >= 10 || isApproving) {
      setIsApproving(true);
      try {
        await window.tokenManager.incrementMessageCount();
        setPendingMessages([]);
      } catch (error) {
        console.error('Message approval error:', error);
        showErrorMessage('Failed to approve messages');
      } finally {
        setIsApproving(false);
      }
    }
  }, [pendingMessages, isApproving]);

  useEffect(() => {
    if (pendingMessages.length >= 10) {
      handleMessageApproval();
    }
  }, [pendingMessages, handleMessageApproval]);


  // Error message display
  const showErrorMessage = (message: string) => {
    setError(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setError(null);
    }, 5000);
  };
  const handlePurchasePackage = async () => {
    if (!window.tokenManager || !address) {
      showErrorMessage('Wallet not connected');
      return;
    }
  
    try {
      await window.tokenManager.purchaseMessagePackage();
      const newStats = await messageStore.getStats(address);
      setMessageStats(newStats);
    } catch (error: any) {
      showErrorMessage(error.message || 'Failed to purchase package');
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
  };// Message handling
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
    
    if (!window.tokenManager?.initialized) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.tokenManager.initialize(web3);
      } catch (error) {
        showErrorMessage('Wallet connection error. Please reconnect.');
        return;
      }
    }
  
    try {
      // Check token allowance before proceeding
      const allowance = await window.tokenManager.checkTokenAllowance();
      console.log('Current allowance:', allowance); // Debug log
  
      if (!allowance.hasEnoughTokens) {
        showErrorMessage(`Insufficient tokens. Balance: ${allowance.balance} TLBAI`);
        return;
      }
  
      // Find matching option
      const selectedOption = currentSceneOptions.find(opt => {
        const primaryText = opt.chinese || opt.japanese || opt.korean || opt.spanish;
        return primaryText === input.trim();
      });
  
      if (!selectedOption) {
        showErrorMessage('Please select a valid response option');
        return;
      }
  
      // Increment message count first
      await window.tokenManager.incrementMessageCount();

      // Use message
      const newStats = await messageStore.useMessage(address);
      setMessageStats(newStats);

      // Prepare message content
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
      };// Add user message
      actions.addMessage({
        role: 'user',
        content: messageContent
      });

      // Handle happiness points
      if (typeof selectedOption.points === 'number') {
        actions.updateHappiness(selectedCharacter, selectedOption.points);
        
        // Save happiness to localStorage
        const happinessKey = `lingobabe_happiness_${address.toLowerCase()}_${selectedCharacter}`;
        const currentHappiness = happiness[selectedCharacter] || 50;
        const newHappiness = Math.min(100, Math.max(0, currentHappiness + selectedOption.points));
        localStorage.setItem(happinessKey, newHappiness.toString());
      }

      // Process character response
      if (selectedOption.response) {
        actions.addMessage({
          role: 'assistant',
          content: selectedOption.response
        });

        // Update video if present
        if (selectedOption.response.video) {
          setCurrentVideo(selectedOption.response.video);
        }

        // Play audio if available
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

      // Handle scene transitions
      if (currentScene < 5) {
        setIsTransitioning(true);
        
        // Save current scene state
        localStorage.setItem(`scene_${selectedCharacter}_${address.toLowerCase()}`, 
          (currentScene + 1).toString()
        );

        // Transition to next scene
        setTimeout(() => {
          actions.setScene(currentScene + 1);
          setIsTransitioning(false);
        }, 1000);
      } else {
        // End of conversation
        setShowEndPopup(true);
        
        // Clear scene state
        localStorage.removeItem(`scene_${selectedCharacter}_${address.toLowerCase()}`);
      }

      // Reset input
      setInput('');
      setShowOptions(false);

    } catch (error: any) {
      console.error('Chat error:', error);
      showErrorMessage(error.message || 'Failed to send message');
      
      // Attempt to recover state
      setIsTransitioning(false);
      setInput('');
    }
  };// Continue from previous code...

  const checkTokenStatus = async () => {
    if (!window.tokenManager || !address) return;
    
    try {
      const balance = await window.tokenManager.getBalance(address);
      const allowance = await window.tokenManager.checkTokenAllowance();
      console.log('Token Status:', {
        balance,
        allowance,
        initialized: window.tokenManager.initialized
      });
    } catch (error) {
      console.error('Token status check failed:', error);
    }
  };
  
  // Add this to your useEffect
  useEffect(() => {
    if (address) {
      checkTokenStatus();
    }
  }, [address]);
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
          readOnly // Make input read-only since we only use options
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

  <BatchMessageTracker
  onPurchase={handlePurchasePackage} // Use your existing purchase function
  className="fixed bottom-24 right-4"
/>
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