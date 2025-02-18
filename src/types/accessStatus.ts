// src/types/accessStatus.ts

export interface AccessStatus {
    hasAccess: boolean;
    characterId: string;
    accessGranted: number; // Timestamp when access was granted
    completed?: boolean;
  }
  
  export interface AccessEvent extends CustomEvent {
    detail: AccessStatus;
  }
  
  export interface ChatCompletedEvent extends CustomEvent {
    detail: {
      characterId: string;
    };
  }