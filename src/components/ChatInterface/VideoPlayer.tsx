import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  className?: string;
}

export const VideoPlayer = ({ src, className = "w-full h-full object-cover" }: VideoPlayerProps) => {
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
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className={className}
    />
  );
};
