// src/services/chatService.ts
import { characters } from '@/data/characters';
import type { Scene, Character } from '@/types/chat';

class ChatService {
  getCharacter(characterId: string): Character | undefined {
    return characters[characterId as keyof typeof characters];
  }

  getScene(characterId: string, sceneId: number): Scene | undefined {
    return this.getCharacter(characterId)?.scenes[sceneId];
  }

  async processMessage(message: string, characterId: string, sceneId: number) {
    const scene = this.getScene(characterId, sceneId);
    if (!scene) {
      throw new Error('Invalid scene');
    }

    const matchedOption = scene.options.find(option =>
      option.chinese?.includes(message) ||
      message.includes(option.chinese || '') ||
      option.japanese?.includes(message) ||
      message.includes(option.japanese || '') ||
      option.korean?.includes(message) ||
      message.includes(option.korean || '') ||
      option.spanish?.includes(message) ||
      message.includes(option.spanish || '') ||
      option.english.toLowerCase().includes(message.toLowerCase())
    );

    if (matchedOption) {
      return {
        type: 'success' as const,
        content: {
          message: matchedOption,
          response: matchedOption.response,
          points: matchedOption.points,
          nextScene: sceneId + 1,
          video: matchedOption.video
        }
      };
    }

    // Return a default message when no match is found
    return {
      type: 'success' as const,
      content: {
        message: {
          english: 'Free chat is still under production. Please stick to the lesson for now.',
          context: '',
          video: undefined
        },
        response: undefined,
        points: 0,
        nextScene: sceneId,
        video: undefined
      }
    };
  }

  async generateAudio(text: string, language: string) {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) throw new Error('Audio generation failed');

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Audio generation error:', error);
      return null;
    }
  }
}

export default new ChatService();