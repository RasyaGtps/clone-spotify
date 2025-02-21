/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.scdn.co',        // untuk gambar track/album
      'mosaic.scdn.co',   // untuk gambar playlist
      'platform-lookaside.fbsbx.com', // untuk profile picture
      'seeded-session-images.scdn.co',
      'blend-playlist-covers.spotifycdn.com',
      'daily-mix.scdn.co',
      't.scdn.co',
      'image-cdn-ak.spotifycdn.com', // tambahan untuk CDN baru Spotify
      'image-cdn-fa.spotifycdn.com'  // tambahan untuk CDN alternatif
    ],
  },
}

module.exports = nextConfig 