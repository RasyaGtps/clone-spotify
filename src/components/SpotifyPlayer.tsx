'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import { useSpotifyPlayer } from '@/contexts/SpotifyPlayerContext';
import Image from 'next/image';
import Link from 'next/link';

export default function SpotifyPlayer() {
  const { data: session } = useSession();
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const { setDeviceId, setPlayer: setGlobalPlayer } = useSpotifyPlayer();

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
        setGlobalPlayer(player);
        
        // Set this device as active
        fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: false,
          }),
        });
      });

      player.addListener('player_state_changed', (state: any) => {
        if (!state) return;
        console.log('Player State:', state);
        setCurrentTrack(state.track_window.current_track);
        setIsPlaying(!state.paused);
      });

      player.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize:', message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error('Failed to authenticate:', message);
      });

      player.addListener('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account:', message);
      });

      player.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      });
    };
  }, [session, setDeviceId, setGlobalPlayer]);

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

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] h-[90px]" />
    );
  }

  return (
    <>
      <Script src="https://sdk.scdn.co/spotify-player.js" strategy="afterInteractive" />
      
      <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] px-4 py-3">
        <div className="flex items-center justify-center max-w-screen-xl mx-auto">
          <p className="text-gray-400 text-sm">
            Pemutaran langsung memerlukan{' '}
            <Link 
              href="https://www.spotify.com/premium/" 
              target="_blank"
              className="text-white hover:underline"
            >
              Spotify Premium
            </Link>
            . Klik lagu untuk membuka di aplikasi Spotify.
          </p>
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