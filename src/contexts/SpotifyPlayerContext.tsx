'use client';

import { createContext, useContext, useState } from 'react';

interface SpotifyPlayerContextType {
  deviceId: string;
  setDeviceId: (id: string) => void;
  player: any;
  setPlayer: (player: any) => void;
}

const SpotifyPlayerContext = createContext<SpotifyPlayerContextType>({
  deviceId: '',
  setDeviceId: () => {},
  player: null,
  setPlayer: () => {},
});

export function SpotifyPlayerProvider({ children }: { children: React.ReactNode }) {
  const [deviceId, setDeviceId] = useState('');
  const [player, setPlayer] = useState<any>(null);

  return (
    <SpotifyPlayerContext.Provider value={{ deviceId, setDeviceId, player, setPlayer }}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
}

export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext); 