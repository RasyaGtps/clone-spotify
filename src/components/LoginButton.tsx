'use client';

import { signIn } from 'next-auth/react';

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn('spotify')}
      className="rounded-full bg-[#1DB954] px-8 py-3 text-white font-bold hover:bg-[#1ed760] transition-colors"
    >
      Login dengan Spotify
    </button>
  );
} 