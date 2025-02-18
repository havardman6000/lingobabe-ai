// src/types/messageStore.d.ts

export interface PendingUpdate {
    timestamp: number;
    type: 'increment';
  }
  
  export interface MessageStoreInterface {
    getMessageCount(address: string): Promise<number>;
    incrementMessageCount(address: string): Promise<boolean>;
    syncPendingUpdates(address: string): Promise<void>;
    getMessagesRemaining(address: string): Promise<number>;
    clearMessageCount(address: string): void;
  }
  export interface MessageStats {
    messagesRemaining: number;
    messagesUsed: number;
    packagesPurchased: number;
    lastPurchaseTimestamp?: number;
  }
  