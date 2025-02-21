import { NextResponse } from 'next/server';
import lyricsFinder from 'lyrics-finder';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const track = searchParams.get('track');
  const artist = searchParams.get('artist');

  if (!track || !artist) {
    return NextResponse.json(
      { error: 'Missing track or artist parameter' },
      { status: 400 }
    );
  }

  try {
    const lyrics = await lyricsFinder(artist, track) || 'Lirik tidak ditemukan';
    return NextResponse.json({ lyrics });
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lyrics' },
      { status: 500 }
    );
  }
} 