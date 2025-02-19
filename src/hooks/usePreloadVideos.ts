// src/hooks/usePreloadVideos.ts
import { useEffect, useState } from 'react';

type VideoStatus = 'loading' | 'loaded' | 'error';

interface VideoPreloadStatus {
  [url: string]: VideoStatus;
}

/**
 * Hook to preload videos efficiently
 * @param videoUrls Array of video URLs to preload
 * @returns Object with status of each video preload
 */
export function usePreloadVideos(videoUrls: string[]): {
  status: VideoPreloadStatus;
  allLoaded: boolean;
  anyError: boolean;
} {
  const [status, setStatus] = useState<VideoPreloadStatus>({});
  const [allLoaded, setAllLoaded] = useState(false);
  const [anyError, setAnyError] = useState(false);

  useEffect(() => {
    if (!videoUrls.length) return;
    
    // Initialize status for all videos
    const initialStatus: VideoPreloadStatus = {};
    videoUrls.forEach(url => {
      initialStatus[url] = 'loading';
    });
    setStatus(initialStatus);
    
    // Preload each video
    const videoElements: HTMLVideoElement[] = [];
    const preloadVideo = (url: string, index: number) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      video.src = url;
      videoElements[index] = video;
      
      video.addEventListener('loadeddata', () => {
        setStatus(prev => ({
          ...prev,
          [url]: 'loaded'
        }));
      });
      
      video.addEventListener('error', () => {
        setStatus(prev => ({
          ...prev,
          [url]: 'error'
        }));
        console.warn(`Failed to preload video: ${url}`);
      });
      
      // Start preloading
      video.load();
    };
    
    // Start preloading all videos
    videoUrls.forEach((url, index) => {
      preloadVideo(url, index);
    });
    
    // Cleanup
    return () => {
      videoElements.forEach(video => {
        video.src = '';
        video.load();
      });
    };
  }, [videoUrls.join(',')]); // Join URLs for stable dependency array
  
  // Update allLoaded and anyError states
  useEffect(() => {
    const urls = Object.keys(status);
    if (!urls.length) return;
    
    const loaded = urls.every(url => status[url] === 'loaded');
    setAllLoaded(loaded);
    
    const hasError = urls.some(url => status[url] === 'error');
    setAnyError(hasError);
  }, [status]);
  
  return { status, allLoaded, anyError };
}