// src/lib/init.ts
import { tokenManager } from '@/services/tokenManager';

// Add type declaration at the top of the file
declare global {
  interface Window {
    tokenManager: any; // Temporarily use 'any' to bypass modifier conflicts
  }
}

// Make tokenManager available globally
if (typeof window !== 'undefined') {
  window.tokenManager = tokenManager;
}

export { tokenManager };
// src/lib/utils.ts
// src/lib/utils.ts
export const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');
