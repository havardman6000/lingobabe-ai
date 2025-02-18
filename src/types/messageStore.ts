// src/types/messageStore.ts

/**
 * Interface for message usage statistics
 * Used for tracking message counts across components
 */
export interface MessageStats {
  /** Number of messages that have been used */
  messagesUsed: number;
  
  /** Number of messages still available to use */
  messagesRemaining: number;
  
  /** Number of message packages purchased */
  packagesPurchased: number;
  
  /** Timestamp of the last package purchase (optional) */
  lastPurchaseTimestamp?: number;
  
  /** Timestamp when stats were last updated (optional) */
  lastUpdated?: number;
}