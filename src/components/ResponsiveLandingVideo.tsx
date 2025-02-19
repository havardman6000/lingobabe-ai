// src/components/ResponsiveLandingVideo.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useMediaQuery } from '@/components/a11y/useMediaQuery';
import { usePreloadVideos } from '@/hooks/usePreloadVideos';

interface ResponsiveLandingVideoProps {
  desktopVideo: string;
  mobileVideo: string;
  fallbackImage?: string;
}

export const ResponsiveLandingVideo: React.FC<ResponsiveLandingVideoProps> = ({
  desktopVideo,
  mobileVideo,
  fallbackImage
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [currentSource, setCurrentSource] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Preload both videos immediately
  const { status: preloadStatus } = usePreloadVideos([desktopVideo, mobileVideo]);
  
  // Set the appropriate video source based on screen size
  useEffect(() => {
    const newSource = isMobile ? mobileVideo : desktopVideo;
    setCurrentSource(newSource);
    
    // If the video element exists, force a reload when source changes
    if (videoRef.current) {
      videoRef.current.load();
      
      // Try to play (browser might block autoplay)
      videoRef.current.play().catch(e => {
        console.warn('Autoplay may be prevented by browser settings:', e);
      });
    }
  }, [isMobile, mobileVideo, desktopVideo]);

  const isVideoLoaded = preloadStatus[currentSource] === 'loaded';
  const hasError = preloadStatus[currentSource] === 'error';

  return (
    <div className="video-wrapper" aria-hidden="true">
      {/* Fallback image shown until video is loaded */}
      {(!isVideoLoaded || hasError) && fallbackImage && (
        <div className="fallback-container">
          <img 
            src={fallbackImage} 
            alt="Background" 
            className="fallback-image"
          />
        </div>
      )}
      
      {/* Main video element */}
      <video 
        ref={videoRef}
        className={`background-video ${isVideoLoaded ? 'visible' : 'hidden'}`}
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src={currentSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <style jsx>{`
        .video-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.5s ease;
        }
        
        .background-video.hidden {
          opacity: 0;
        }
        
        .background-video.visible {
          opacity: 1;
        }

        .fallback-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .fallback-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};