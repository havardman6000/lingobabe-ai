// src/services/messageStore.ts

// Define the interface inline to fix the immediate TypeScript errors
interface MessageStats {
  messagesUsed: number;
  messagesRemaining: number;
  packagesPurchased: number;
  lastPurchaseTimestamp?: number;
  lastUpdated?: number;
}

class MessageStore {
  private STORAGE_PREFIX = 'lingobabe_messages_';
  private GLOBAL_STATS_KEY = 'lingobabe_messages_global';
  private MESSAGES_PER_PACKAGE = 50;

  private getStorageKey(address: string): string {
    if (!address) return this.GLOBAL_STATS_KEY;
    return `${this.STORAGE_PREFIX}${address.toLowerCase()}`;
  }

  private getInitialStats(): MessageStats {
    return {
      messagesRemaining: this.MESSAGES_PER_PACKAGE,
      messagesUsed: 0,
      packagesPurchased: 0,
      lastUpdated: Date.now()
    };
  }

  getStats(address: string): MessageStats {
    if (typeof window === 'undefined') return this.getInitialStats();
    
    try {
      // First try to get address-specific stats
      const addressKey = this.getStorageKey(address);
      let stored = localStorage.getItem(addressKey);
      
      // If no address-specific stats, try global stats
      if (!stored && address) {
        stored = localStorage.getItem(this.GLOBAL_STATS_KEY);
        
        // If found global stats, copy them to address-specific storage
        if (stored) {
          localStorage.setItem(addressKey, stored);
        }
      }
      
      if (stored) {
        try {
          const parsedStats = JSON.parse(stored);
          // Validate the stats object has required properties
          if (this.isValidStats(parsedStats)) {
            return parsedStats;
          }
        } catch (e) {
          console.warn('Error parsing stored stats', e);
        }
      }
      
      // If no valid stats found, initialize with defaults
      const initial = this.getInitialStats();
      this.saveStats(address, initial);
      return initial;
    } catch (error) {
      console.error('Error retrieving stats', error);
      return this.getInitialStats();
    }
  }

  private isValidStats(stats: any): stats is MessageStats {
    return (
      typeof stats === 'object' &&
      stats !== null &&
      'messagesRemaining' in stats &&
      'messagesUsed' in stats &&
      typeof stats.messagesRemaining === 'number' &&
      typeof stats.messagesUsed === 'number'
    );
  }

  private saveStats(address: string, stats: MessageStats) {
    if (typeof window === 'undefined') return;
    
    try {
      // Ensure we have a timestamp
      const statsWithTimestamp = {
        ...stats,
        lastUpdated: stats.lastUpdated || Date.now()
      };
      
      const statsJson = JSON.stringify(statsWithTimestamp);
      
      // Save to address-specific storage if address is provided
      if (address) {
        localStorage.setItem(this.getStorageKey(address), statsJson);
      }
      
      // Always save to global storage for persistence across sessions
      localStorage.setItem(this.GLOBAL_STATS_KEY, statsJson);
      
      // Dispatch an event to notify other components of the update
      this.notifyStatsUpdated(statsWithTimestamp);
    } catch (error) {
      console.error('Error saving stats', error);
    }
  }

  private notifyStatsUpdated(stats: MessageStats) {
    if (typeof window === 'undefined') return;
    
    // Dispatch custom event
    const event = new CustomEvent('messageStatsUpdated', { 
      detail: stats,
      bubbles: true
    });
    window.dispatchEvent(event);
    
    // Create storage event for cross-tab communication
    this.triggerStorageEvent(this.GLOBAL_STATS_KEY, JSON.stringify(stats));
  }

  private triggerStorageEvent(key: string, value: string) {
    // This helps synchronize stats across multiple tabs
    try {
      const originalValue = localStorage.getItem(key);
      localStorage.setItem(key, value);
      
      // Create a synthetic storage event
      const event = new StorageEvent('storage', {
        key: key,
        oldValue: originalValue,
        newValue: value,
        storageArea: localStorage
      });
      
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error triggering storage event', error);
    }
  }

  async purchasePackage(address: string): Promise<MessageStats> {
    if (!address) throw new Error('No wallet address provided');
    
    try {
      const stats = this.getStats(address);
      
      // Update local stats
      const updatedStats = {
        ...stats,
        messagesRemaining: stats.messagesRemaining + this.MESSAGES_PER_PACKAGE,
        packagesPurchased: stats.packagesPurchased + 1,
        lastPurchaseTimestamp: Date.now(),
        lastUpdated: Date.now()
      };

      this.saveStats(address, updatedStats);
      return updatedStats;
    } catch (error) {
      console.error('Error purchasing package', error);
      throw error;
    }
  }

  async useMessage(address: string): Promise<MessageStats | null> {
    if (!address) return null;
    
    try {
      const stats = this.getStats(address);
      
      if (stats.messagesRemaining <= 0) {
        return null;
      }

      // Update local stats
      const updatedStats = {
        ...stats,
        messagesRemaining: stats.messagesRemaining - 1,
        messagesUsed: stats.messagesUsed + 1,
        lastUpdated: Date.now()
      };

      this.saveStats(address, updatedStats);
      return updatedStats;
    } catch (error) {
      console.error('Error using message', error);
      return null;
    }
  }

  // New method to sync with blockchain data after reconnecting
  async syncWithBlockchain(address: string): Promise<MessageStats | null> {
    if (!address || !window.tokenManager?.initialized) return null;
    
    try {
      // Get local stats first
      const localStats = this.getStats(address);
      
      // Then try to get blockchain stats
      const allowance = await window.tokenManager.checkTokenAllowance();
      
      if (!allowance || typeof allowance.messagesRemaining !== 'number') {
        return localStats;
      }
      
      // If blockchain has more messages, use blockchain data
      // If local has more messages, keep local data (could be from purchases not yet synced)
      const messagesRemaining = Math.max(
        localStats.messagesRemaining, 
        allowance.messagesRemaining
      );
      
      // Calculate packages purchased based on usage
      const estimatedPackagesPurchased = Math.max(
        localStats.packagesPurchased,
        Math.ceil((messagesRemaining + localStats.messagesUsed) / this.MESSAGES_PER_PACKAGE)
      );
      
      const syncedStats = {
        ...localStats,
        messagesRemaining,
        packagesPurchased: estimatedPackagesPurchased,
        lastUpdated: Date.now()
      };
      
      this.saveStats(address, syncedStats);
      return syncedStats;
    } catch (error) {
      console.error('Failed to sync with blockchain:', error);
      return null;
    }
  }

  // Method to migrate global stats to an address when connecting
  migrateStatsToAddress(address: string): MessageStats {
    if (!address) return this.getInitialStats();
    
    try {
      // First try to get existing address stats
      const addressKey = this.getStorageKey(address);
      const addressStatsJson = localStorage.getItem(addressKey);
      
      // If address already has stats, return those
      if (addressStatsJson) {
        try {
          const addressStats = JSON.parse(addressStatsJson);
          if (this.isValidStats(addressStats)) {
            return addressStats;
          }
        } catch (e) {
          console.warn('Invalid address stats, trying global stats', e);
        }
      }
      
      // Try to get global stats
      const globalStatsJson = localStorage.getItem(this.GLOBAL_STATS_KEY);
      if (globalStatsJson) {
        try {
          const globalStats = JSON.parse(globalStatsJson);
          if (this.isValidStats(globalStats)) {
            // Copy global stats to address-specific storage
            this.saveStats(address, globalStats);
            return globalStats;
          }
        } catch (e) {
          console.warn('Invalid global stats', e);
        }
      }
      
      // If no valid stats found, initialize with defaults
      const initial = this.getInitialStats();
      this.saveStats(address, initial);
      return initial;
    } catch (error) {
      console.error('Error migrating stats', error);
      return this.getInitialStats();
    }
  }
}

export const messageStore = new MessageStore();