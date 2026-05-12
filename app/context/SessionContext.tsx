'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createGuestSession } from '@/app/lib/moviedb';

interface SessionContextType {
  guestSessionId: string;
}

const SessionContext = createContext<SessionContextType>({
  guestSessionId: '',
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [guestSessionId, setGuestSessionId] = useState('');

  useEffect(() => {
    createGuestSession().then(setGuestSessionId).catch(console.error);
  }, []);

  return <SessionContext.Provider value={{ guestSessionId }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
