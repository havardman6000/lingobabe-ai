// src/components/ChatInterface/index.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { characters } from '@/data/characters';
import { useChatStore } from '@/store/chatStore';
import { BackButton } from '@/components/BackButton';

export function ChatInterface() {
  const { selectedCharacter, messages, currentScene, actions } = useChatStore();
  const [happiness, setHappiness] = useState(50);
  
  const character = selectedCharacter ? characters[selectedCharacter] : null;
  const currentSceneData = character?.scenes?.[currentScene];
  const options = currentSceneData?.options || [];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 relative border-b border-gray-800">
        <div className="absolute left-4">
          <BackButton />
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-semibold text-white">{character?.name}</h1>
        </div>
        <div className="absolute right-4 bg-gray-800 rounded-full px-3 py-1 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
          <span className="text-white text-sm">Happiness: {happiness}</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {message.role === 'assistant' && (
              <img 
                src={character?.image} 
                alt={character?.name} 
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className={`rounded-lg p-4 max-w-[80%] space-y-1 ${
              message.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-800 text-white'
            }`}>
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {message.content.chinese || message.content.english}
              </p>
              {message.content.pinyin && (
                <p className="text-sm text-gray-300">{message.content.pinyin}</p>
              )}
              {message.content.english && message.content.chinese && (
                <p className="text-sm text-gray-300">{message.content.english}</p>
              )}
              {message.content.context && (
                <p className="text-sm italic text-gray-400">{message.content.context}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Type or select a message..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none"
          />
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
//src/components/ChatInterface/index.tsx