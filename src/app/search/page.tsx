import { searchTracks } from '@/lib/spotify';
import Image from 'next/image';
import Player from '@/components/Player';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const results = await searchTracks(searchParams.q);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">
        Hasil pencarian untuk "{searchParams.q}"
      </h1>

      <div className="grid gap-4">
        {results?.tracks?.items?.map((track: any) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="relative h-16 w-16">
              <Image
                src={track.album.images[0].url}
                alt={track.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div>
              <h3 className="text-white font-medium">{track.name}</h3>
              <p className="text-sm text-gray-400">
                {track.artists.map((a: any) => a.name).join(', ')}
              </p>
            </div>
            <div className="ml-auto text-sm text-gray-400">
              {Math.floor(track.duration_ms / 60000)}:
              {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(
                2,
                '0'
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Player */}
      {results?.tracks?.items?.[0] && <Player track={results.tracks.items[0]} />}
    </div>
  );
} 