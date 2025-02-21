'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="text-gray-400 hover:text-white text-sm"
    >
      Logout
    </button>
  );
} 