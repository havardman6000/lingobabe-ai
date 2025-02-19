import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  className?: string;
  ariaLabel?: string;

}

export const VideoPlayer = ({ 
  src, 
  className = "w-full h-full object-cover",
  ariaLabel = "Chat video" 
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => {
      console.error('Video failed to load:', src);
    };

    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('error', handleError);
    };
  }, [src]);

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        aria-label={ariaLabel}
      >
        <p>Your browser doesn't support HTML5 video.</p>
      </video>

      <style jsx>{`
        .video-container {
          width: 100%;
          max-width: 100%;
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
          border-radius: 8px;
          background-color: #000;
        }

        video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          max-height: 30vh;
        }

        @media (min-width: 640px) {
          .video-container {
            max-width: 480px;
            margin: 0 auto;
          }

          video {
            max-height: 40vh;
          }
        }
      `}</style>
    </div>
  );
}