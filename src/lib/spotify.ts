import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const SPOTIFY_API = 'https://api.spotify.com/v1';

async function getAccessToken() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    console.error('No access token found in session:', session);
  }
  return session?.accessToken;
}

async function spotifyApi(endpoint: string, options: RequestInit = {}) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.error('No access token available');
    return null;
  }

  try {
    const response = await fetch(`${SPOTIFY_API}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spotify API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        endpoint
      });
      return null;
    }

    if (response.status === 204) return true;
    return response.json();
  } catch (error) {
    console.error('Spotify API Request Error:', error);
    return null;
  }
}

export async function getProfile() {
  return spotifyApi('/me');
}

export async function getPlaylists() {
  try {
    const response = await spotifyApi('/me/playlists?limit=50');
    console.log('Playlists response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return null;
  }
}

export async function getTopTracks() {
  return spotifyApi('/me/top/tracks?limit=20&time_range=short_term');
}

export async function getRecentlyPlayed() {
  return spotifyApi('/me/player/recently-played?limit=20');
}

export async function getCurrentlyPlaying() {
  return spotifyApi('/me/player/currently-playing');
}

export async function searchTracks(query: string) {
  return spotifyApi(`/search?q=${encodeURIComponent(query)}&type=track&limit=20`);
}

export async function getLyrics(trackName: string, artistName: string) {
  try {
    const response = await fetch(`/api/lyrics?track=${trackName}&artist=${artistName}`);
    const data = await response.json();
    return data.lyrics;
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return null;
  }
}

export async function playTrack(trackUri: string, deviceId: string) {
  try {
    const response = await spotifyApi(`/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: [trackUri],
        position_ms: 0, // Mulai dari awal lagu
      }),
    });
    console.log('Play track response:', response);
    return response;
  } catch (error) {
    console.error('Error playing track:', error);
    throw error;
  }
} 