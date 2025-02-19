// src/store/chatStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import chatService from '@/services/chatService';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: {
    english: string;
    chinese?: string;
    pinyin?: string;
    japanese?: string;
    romaji?: string;
    korean?: string;
    romanized?: string;
    spanish?: string;
    context?: string;
    video?: string;
  };
  timestamp: number;
}

interface ChatState {
  selectedCharacter: string | null;
  currentScene: number;
  messages: Message[];
  happiness: Record<string, number>;
  actions: {
    selectCharacter: (characterId: string) => void;
    addMessage: (message: Omit<Message, 'timestamp'>) => void;
    updateHappiness: (characterId: string, points: number) => void;
    setScene: (scene: number) => void;
    reset: () => void;
    resetChat: () => void;
  };
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      selectedCharacter: null,
      currentScene: 1,
      messages: [],
      happiness: {},
      actions: {
        selectCharacter: (characterId) => {
          const scene = chatService.getScene(characterId, 1);
          if (scene) {
            set({
              selectedCharacter: characterId,
              currentScene: 1,
              messages: [{
                role: 'assistant',
                content: {
                  // Chinese fields
                  chinese: scene.initial.chinese,
                  pinyin: scene.initial.pinyin,
                  
                  // Japanese fields
                  japanese: scene.initial.japanese,
                  romaji: scene.initial.romaji,
                  
                  // Korean fields
                  korean: scene.initial.korean,
                  romanized: scene.initial.romanized,
                  
                  // Spanish field
                  spanish: scene.initial.spanish,
                  
                  // Common fields
                  english: scene.initial.english,
                  context: scene.initial.context,
                  video: scene.initial.video
                },
                timestamp: Date.now()
              }],
              happiness: { ...get().happiness, [characterId]: 50 }
            });
          }
        },
        addMessage: (message) => 
          set((state) => ({
            messages: [...state.messages, { ...message, timestamp: Date.now() }]
          })),
        updateHappiness: (characterId, points) =>
          set((state) => ({
            happiness: {
              ...state.happiness,
              [characterId]: Math.min(100, Math.max(0, (state.happiness[characterId] || 50) + points))
            }
          })),
        setScene: (scene) => 
          set({ currentScene: scene }),
        reset: () => 
          set({
            selectedCharacter: null,
            currentScene: 1,
            messages: [],
            happiness: {}
          }),
        resetChat: () => 
          set({
            selectedCharacter: null,
            currentScene: 1,
            messages: [],
            happiness: {}
          })
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        selectedCharacter: state.selectedCharacter,
        currentScene: state.currentScene,
        messages: state.messages,
        happiness: state.happiness
      })
    }
  )
);