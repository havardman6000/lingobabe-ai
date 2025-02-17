// src/services/messageStore.ts

interface MessageStats {
  messagesRemaining: number;
  messagesUsed: number;
  packagesPurchased: number;
  lastPurchaseTimestamp?: number;
}

class MessageStore {
  private STORAGE_PREFIX = 'lingobabe_messages_';

  private getStorageKey(address: string): string {
    return `${this.STORAGE_PREFIX}${address.toLowerCase()}`;
  }

  private getInitialStats(): MessageStats {
    return {
      messagesRemaining: 0,
      messagesUsed: 0,
      packagesPurchased: 0
    };
  }

  getStats(address: string): MessageStats {
    if (!address) return this.getInitialStats();

    const stored = localStorage.getItem(this.getStorageKey(address));
    if (!stored) {
      const initial = this.getInitialStats();
      this.saveStats(address, initial);
      return initial;
    }

    return JSON.parse(stored);
  }

  private saveStats(address: string, stats: MessageStats) {
    if (!address) return;
    localStorage.setItem(this.getStorageKey(address), JSON.stringify(stats));
  }

  async purchasePackage(address: string): Promise<MessageStats> {
    const stats = this.getStats(address);
    
    stats.messagesRemaining += 50;
    stats.packagesPurchased += 1;
    stats.lastPurchaseTimestamp = Date.now();

    this.saveStats(address, stats);
    return stats;
  }

  async useMessage(address: string): Promise<MessageStats | null> {
    const stats = this.getStats(address);
    
    if (stats.messagesRemaining <= 0) {
      return null;
    }

    stats.messagesRemaining -= 1;
    stats.messagesUsed += 1;

    this.saveStats(address, stats);
    return stats;
  }
}

export const messageStore = new MessageStore();