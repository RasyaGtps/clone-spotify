'use client';

import Image from 'next/image';
import { SpotifyTrack } from '@/types/spotify';
import { playTrack } from '@/lib/spotify';

interface TrackCardProps {
  track: SpotifyTrack;
  deviceId?: string;
}

export default function TrackCard({ track, deviceId }: TrackCardProps) {
  const handlePlay = async () => {
    if (!deviceId) return;
    await playTrack(`spotify:track:${track.id}`, deviceId);
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
      <h3 className="text-white font-bold truncate">{track?.name || 'Unknown Track'}</h3>
      <p className="text-gray-400 text-sm mt-1 truncate">
        {track?.artists?.map((a) => a.name).join(', ') || 'Unknown Artist'}
      </p>
    </div>
  );
} 