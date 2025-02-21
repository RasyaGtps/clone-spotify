'use client';

import Image from 'next/image';
import { SpotifyTrack } from '@/types/spotify';

interface TrackCardProps {
  track: SpotifyTrack;
}

export default function TrackCard({ track }: TrackCardProps) {
  const handlePlay = () => {
    // Buka di aplikasi Spotify
    window.open(track.external_urls.spotify, '_blank');
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