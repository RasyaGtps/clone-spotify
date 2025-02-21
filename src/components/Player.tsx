'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PlayerProps {
  track: any;
}

export default function Player({ track }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14">
            <Image
              src={track?.album?.images[0]?.url || '/default-album.png'}
              alt={track?.name || 'Track'}
              fill
              className="object-cover rounded"
            />
          </div>
          <div>
            <h4 className="text-white font-medium">{track?.name}</h4>
            <p className="text-sm text-gray-400">{track?.artists?.[0]?.name}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 6v12l10-6z" />
              </svg>
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white rounded-full p-2 hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <svg className="h-6 w-6" fill="black" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="black" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button className="text-gray-400 hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 18V6l10 6z" />
              </svg>
            </button>
          </div>
          <div className="w-96 bg-gray-600 rounded-full h-1">
            <div
              className="bg-white h-1 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 