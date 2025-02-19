// src/types/chat.ts
export type SupportedLanguage = 'chinese' | 'japanese' | 'korean' | 'spanish';
export type ChatRole = 'user' | 'assistant';

export type CharacterId = 
  | 'mei' | 'ting' | 'xue'  // Chinese
  | 'aoi' | 'aya' | 'misa'  // Japanese
  | 'ji' | 'min' | 'sua'    // Korean
  | 'isabella' | 'sofia' | 'valentina';  // Spanish

  export interface LanguageFields {
    primary: keyof MessageContent;
    pronunciation: keyof MessageContent | null;
  }

  export interface BaseMessageContent {
    english: string;
    chinese: string | undefined;
    pinyin: string | undefined;
    japanese: string | undefined;
    romaji: string | undefined;
    korean: string | undefined;
    romanized: string | undefined;
    spanish: string | undefined;
    context?: string;
    video?: string;
  }

  export interface MessageContent {
    // Common fields
    english: string;
    context?: string;
    video?: string;
    
    // Language-specific fields
    chinese?: string;
    pinyin?: string;
    
    japanese?: string;
    romaji?: string;
    
    korean?: string;
    romanized?: string;
    
    spanish?: string;
  }
export interface ChatMessage {
  role: ChatRole;
  content: MessageContent;
  timestamp?: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: MessageContent;
  timestamp?: number;
}
export type MessageInput = Omit<Message, 'timestamp'>;

export interface ChatOption {
  // Common fields
  id?: string;     // Add this optional id field
  english: string;
  video?: string;
  points?: number;
  
  // Language-specific fields
  chinese?: string;
  pinyin?: string;
  
  japanese?: string;
  romaji?: string;
  
  korean?: string;
  romanized?: string;
  
  spanish?: string;
  
  response?: MessageContent;
}

export interface Scene {
  initial: MessageContent;
  options: ChatOption[];
  video?: string;
  transition?: string;
}
export interface BaseCharacter {
  id: CharacterId;
  name: string;
  description: string;
  image: string;
  language: SupportedLanguage;
  scenes: Record<number, Scene>;
}

export interface ChatOptionsProps {
  options: ChatOption[];
  onSelectOption: (text: string) => void;
  onPlayAudio: (text: string) => void;
  audioPlaying: boolean;
}

export interface ChatMessageProps {
  message: ChatMessage;
  avatarSrc?: string;
  onPlayAudio: (text: string) => void;
  audioPlaying: boolean;
}

export interface ChatState {
  selectedCharacter: CharacterId | null;
  currentScene: number;
  messages: ChatMessage[];
  happiness: Record<CharacterId, number>;
  actions: {
    selectCharacter: (characterId: CharacterId) => void;
    addMessage: (message: Omit<ChatMessage, "timestamp">) => void;
    updateHappiness: (characterId: CharacterId, points: number) => void;
    setScene: (scene: number) => void;
    reset: () => void;
  };
}

export interface ChatHeaderProps {
  characterName: string;
  happiness: number;
  onBack: () => void;
}

export interface ChineseCharacter extends BaseCharacter {
  language: 'chinese';
  chineseName: string;
}

export interface JapaneseCharacter extends BaseCharacter {
  language: 'japanese';
  japaneseName: string;
}

export interface KoreanCharacter extends BaseCharacter {
  language: 'korean';
  koreanName: string;
}

export interface SpanishCharacter extends BaseCharacter {
  language: 'spanish';
  spanishName: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  language: SupportedLanguage;
  image: string;
  scenes: Record<number, Scene>;
  
  // Native language names
  chineseName?: string;
  japaneseName?: string;
  koreanName?: string;
  spanishName?: string;
}



export interface Scene {
  initial: MessageContent;
  options: ChatOption[];
  video?: string;
  transition?: string;
}

export interface Option {
  [key: string]: string | number | MessageContent | undefined;
  chinese?: string;
  pinyin?: string;
  japanese?: string;
  romaji?: string;
  korean?: string;
  romanized?: string;
  spanish?: string;
  english: string;
  points: number;
  response: MessageContent;
  video?: string;
}

export type Characters = Record<CharacterId, Character>;



export interface ChatResult {
  type: 'success' | 'error';
  content?: {
    message: MessageContent;
    response?: MessageContent;
    points: number;
    nextScene?: number;
    video?: string;
  };
  error?: string;
}