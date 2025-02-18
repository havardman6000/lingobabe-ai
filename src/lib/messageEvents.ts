// src/lib/messageEvents.ts
import { MessageStats } from '@/types/messageStore';

export const MessageEvents = {
  /**
   * Dispatches an event when message stats are updated
   */
  dispatchStatsUpdated: (stats: MessageStats) => {
    const event = new CustomEvent('messageStatsUpdated', {
      detail: stats,
      bubbles: true,
    });
    window.dispatchEvent(event);
  },

  /**
   * Dispatches an event when a message is used
   */
  dispatchMessageUsed: (remainingCount: number) => {
    const event = new CustomEvent('messageUsed', {
      detail: { remaining: remainingCount },
      bubbles: true,
    });
    window.dispatchEvent(event);
  },
  
  /**
   * Dispatches an event when a package is purchased
   */
  dispatchPackagePurchased: (newCount: number) => {
    const event = new CustomEvent('packagePurchased', {
      detail: { remaining: newCount },
      bubbles: true,
    });
    window.dispatchEvent(event);
  },
  
  /**
   * Triggers a refresh of all message trackers
   */
  dispatchRefreshTrackers: () => {
    const event = new Event('refreshMessageTrackers');
    window.dispatchEvent(event);
  }
};

/**
 * Helper to notify all components that local storage has changed
 * Some browsers don't trigger storage events for the same window
 */
export const notifyStorageChange = (key: string, value: string) => {
  // First update the actual storage
  localStorage.setItem(key, value);
  
  // Then create a synthetic event for the current window
  const event = new StorageEvent('storage', {
    key: key,
    newValue: value,
    storageArea: localStorage
  });
  
  window.dispatchEvent(event);
};