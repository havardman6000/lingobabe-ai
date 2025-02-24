// Check the current scenes data structure in src/data/scenes.ts
import { characters } from '@/data/characters';

// Debug function to validate chat options
export const validateChatOptions = (characterId: string, currentScene: number) => {
  // Get character data
  const character = characters[characterId];
  if (!character) {
    console.error('Character not found:', characterId);
    return false;
  }

  // Get scene data
  const scene = character.scenes[currentScene];
  if (!scene) {
    console.error('Scene not found:', currentScene);
    return false;
  }

  // Check options
  if (!scene.options || scene.options.length === 0) {
    console.error('No options found for scene:', currentScene);
    return false;
  }

  // Log valid options for debugging
  console.log('Valid options found:', scene.options);
  return true;
};