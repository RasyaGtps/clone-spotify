import { NextResponse } from 'next/server';
import { getTopTracks, getPlaylists, getProfile } from '@/lib/spotify';

export async function GET(request: Request) {
  try {
    const [topTracks, playlists, profile] = await Promise.all([
      getTopTracks(),
      getPlaylists(),
      getProfile(),
    ]);

    return NextResponse.json({
      topTracks,
      playlists,
      profile,
    });
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
} 