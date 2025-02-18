// src/components/EnhancedMessageTracker/types.ts

export interface MessageTrackerRef {
    decrementMessages: () => Promise<boolean>;
    getMessagesRemaining: () => number;
    refreshAllowance: () => Promise<void>;
  }
  
  export interface MessageTrackerProps {
    className?: string;
    onUpdate?: (messagesRemaining: number) => void;
  }