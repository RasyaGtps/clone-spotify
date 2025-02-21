'use client';

import Image from 'next/image';
import { SpotifyTrack } from '@/types/spotify';
import { playTrack } from '@/lib/spotify';
import { useSpotifyPlayer } from '@/contexts/SpotifyPlayerContext';

interface TrackCardProps {
  track: SpotifyTrack;
}

export default function TrackCard({ track }: TrackCardProps) {
  const { deviceId, player } = useSpotifyPlayer();

  const handlePlay = async () => {
    if (!deviceId) {
      console.log('No device ID available');
      return;
    }
    try {
      console.log('Playing track:', track.name, 'on device:', deviceId);
      await playTrack(`spotify:track:${track.id}`, deviceId);
      // Resume playback after setting the track
      if (player) {
        setTimeout(() => {
          player.resume();
        }, 300);
      }
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  return (
    <div 
      className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer"
      onClick={handlePlay}
    >
      <div className="relative aspect-square mb-4">
        <Image
          src={track?.album?.images?.[0]?.url || '/default-album.png'}
          alt={track?.name || 'Track'}
          fill
          className="object-cover rounded"
        />
      </div>
      <h3 className="text-white font-medium truncate">{track?.name || 'Unknown Track'}</h3>
      <p className="text-sm text-gray-400 truncate">
        {track?.artists?.map((a) => a.name).join(', ') || 'Unknown Artist'}
      </p>
    </div>
  );
} 