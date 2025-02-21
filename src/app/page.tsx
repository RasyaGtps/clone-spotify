import { getPlaylists, getProfile, getTopTracks, getRecentlyPlayed } from '@/lib/spotify';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import LoginButton from '@/components/LoginButton';
import Search from '@/components/Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import Player from '@/components/Player';
import { Suspense } from 'react';
import LogoutButton from '@/components/LogoutButton';
import type { SpotifyPlaylist, SpotifyTrack, SpotifyRecentlyPlayed } from '@/types/spotify';
import Image from 'next/image';
import SpotifyPlayer from '@/components/SpotifyPlayer';
import TrackCard from '@/components/TrackCard';

async function getData() {
  try {
    const [playlists, profile, topTracks, recentlyPlayed] = await Promise.all([
      getPlaylists(),
      getProfile(),
      getTopTracks(),
      getRecentlyPlayed()
    ]);
    
    console.log('Fetched data:', {
      playlists: playlists?.items?.length,
      profile: profile?.display_name,
      topTracks: topTracks?.items?.length,
      recentlyPlayed: recentlyPlayed?.items?.length
    });
    
    return { playlists, profile, topTracks, recentlyPlayed };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { playlists: [], profile: null, topTracks: [], recentlyPlayed: [] };
  }
}

function LoadingCard() {
  return (
    <div className="bg-[#181818] p-4 rounded-lg animate-pulse">
      <div className="aspect-square mb-4 bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-700 rounded mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-2/3"></div>
    </div>
  );
}

function LoadingSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log('Session:', {
    accessToken: session?.accessToken ? 'exists' : 'missing',
    error: session?.error,
    user: session?.user
  });

  if (!session?.accessToken) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <LoginButton />
      </div>
    );
  }

  const { playlists, profile, topTracks, recentlyPlayed } = await getData();

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-black p-6 flex flex-col gap-6">
        <div className="space-y-6">
          <div className="text-[#1DB954] text-3xl">
            <FontAwesomeIcon icon={faSpotify} />
          </div>
          
          <nav className="space-y-4">
            <Search />
            <a href="#" className="flex items-center text-white gap-4 hover:text-white">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z"/>
              </svg>
              Beranda
            </a>
            <a href="#" className="flex items-center text-gray-400 gap-4 hover:text-white">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"/>
              </svg>
              Cari
            </a>
          </nav>
        </div>

        <div className="bg-[#121212] rounded-lg p-4 flex-1">
          <div className="text-white font-bold mb-4">Pustaka</div>
          <div className="space-y-4">
            {playlists?.items?.slice(0, 5).map((playlist: SpotifyPlaylist) => (
              <a 
                key={playlist.id}
                href="#" 
                className="flex items-center text-gray-400 gap-4 hover:text-white"
              >
                <div className="bg-gray-800 p-2 rounded">
                  <FontAwesomeIcon icon={faSpotify} className="h-4 w-4" />
                </div>
                {playlist.name}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <LogoutButton />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] overflow-auto">
        <div className="p-8">
          <Suspense fallback={<div className="h-8 w-64 bg-gray-700 rounded animate-pulse"></div>}>
            <h1 className="text-2xl font-bold text-white mb-6">
              {profile ? `Selamat datang kembali, ${profile.display_name}` : 'Selamat datang kembali'}
            </h1>
          </Suspense>
          
          {/* Recently Played */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Baru Saja Diputar</h2>
            <Suspense fallback={<LoadingSection />}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recentlyPlayed?.items?.length > 0 ? (
                  recentlyPlayed.items.slice(0, 4).map((item: SpotifyRecentlyPlayed) => (
                    <TrackCard key={item.track.id} track={item.track} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-400">
                    <p>Belum ada lagu yang diputar</p>
                  </div>
                )}
              </div>
            </Suspense>
          </section>

          {/* Top Tracks */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Lagu Top Kamu</h2>
            <Suspense fallback={<LoadingSection />}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {topTracks?.items?.length > 0 ? (
                  topTracks.items.slice(0, 4).map((track: SpotifyTrack) => (
                    <TrackCard key={track.id} track={track} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-400">
                    <p>Belum ada lagu top</p>
                  </div>
                )}
              </div>
            </Suspense>
          </section>

          {/* Playlists */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Playlist Kamu</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {playlists?.items?.length > 0 ? (
                playlists.items.map((playlist: SpotifyPlaylist) => (
                  <div 
                    key={playlist.id} 
                    className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer"
                  >
                    <div className="relative aspect-square mb-4">
                      <Image
                        src={playlist?.images?.[0]?.url || '/default-playlist.png'}
                        alt={playlist?.name || 'Playlist'}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <h3 className="text-white font-bold truncate">{playlist?.name || 'Untitled Playlist'}</h3>
                    <p className="text-gray-400 text-sm mt-1 truncate">
                      {playlist?.description || 'No description'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400">
                  <p>Tidak ada playlist yang ditemukan</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Player */}
      <SpotifyPlayer />
    </div>
  );
}
