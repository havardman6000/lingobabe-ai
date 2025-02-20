// src/lib/requestUtils.ts
const cache = new Map();
const lastRequestTime = new Map();
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

export async function throttledRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const lastRequest = lastRequestTime.get(key) || 0;
  
  // Return cached data if available and request was recent
  if (cache.has(key) && now - lastRequest < MIN_REQUEST_INTERVAL) {
    return cache.get(key) as T;
  }
  
  // Wait if needed to respect rate limits
  const timeToWait = Math.max(0, MIN_REQUEST_INTERVAL - (now - lastRequest));
  if (timeToWait > 0) {
    await new Promise(resolve => setTimeout(resolve, timeToWait));
  }
  
  try {
    const result = await requestFn();
    cache.set(key, result);
    lastRequestTime.set(key, Date.now());
    return result;
  } catch (error: any) {
    // On 429, use cached data if available
    if (error.message?.includes('429') && cache.has(key)) {
      console.warn('Rate limited, using cached data for', key);
      return cache.get(key) as T;
    }
    throw error;
  }
}

export async function requestWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      if (!error.message?.includes('429') || retries === maxRetries - 1) {
        throw error;
      }
      
      retries++;
      const delay = Math.pow(2, retries) * 1000; // Exponential backoff
      console.warn(`Rate limited, retrying in ${delay}ms (attempt ${retries}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Maximum retries exceeded');
}