'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Script from 'next/script';

interface SpotifyPlayerProps {
  trackUri?: string;
}

export default function SpotifyPlayer({ trackUri }: SpotifyPlayerProps) {
  const { data: session } = useSession();
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    if (!session?.accessToken) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(session.accessToken as string); },
        volume: 0.5
      });

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
        setPlayer(player);
      });

      player.addListener('player_state_changed', (state: any) => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setIsPlaying(!state.paused);
      });

      player.connect();
    };
  }, [session]);

  const togglePlay = async () => {
    if (!player) return;

    const state = await player.getCurrentState();
    if (!state) return;

    if (state.paused) {
      await player.resume();
    } else {
      await player.pause();
    }
    setIsPlaying(!state.paused);
  };

  return (
    <>
      <Script src="https://sdk.scdn.co/spotify-player.js" strategy="afterInteractive" />
      
      <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] px-4 py-3">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          {/* Track Info */}
          <div className="flex items-center gap-4">
            {currentTrack && (
              <>
                <img
                  src={currentTrack.album.images[0].url}
                  alt={currentTrack.name}
                  className="h-14 w-14 rounded"
                />
                <div>
                  <h4 className="text-white font-medium">{currentTrack.name}</h4>
                  <p className="text-sm text-gray-400">
                    {currentTrack.artists.map((a: any) => a.name).join(', ')}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => player?.previousTrack()}
              className="text-gray-400 hover:text-white"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 6v12l10-6z" />
              </svg>
            </button>
            
            <button
              onClick={togglePlay}
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

            <button
              onClick={() => player?.nextTrack()}
              className="text-gray-400 hover:text-white"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 18V6l10 6z" />
              </svg>
            </button>
          </div>

          {/* Volume Control */}
          <div className="w-32">
            <input
              type="range"
              min="0"
              max="100"
              className="w-full"
              onChange={(e) => player?.setVolume(Number(e.target.value) / 100)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Export deviceId untuk digunakan komponen lain
export const useSpotifyPlayer = () => {
  const [deviceId, setDeviceId] = useState<string>('');
  return { deviceId, setDeviceId };
}; 