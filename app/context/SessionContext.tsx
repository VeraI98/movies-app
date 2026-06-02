'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createGuestSession } from '@/app/lib/moviedb';

const SESSION_KEY = 'moviedb_guest_session_id';
const SESSION_EXPIRY_KEY = 'moviedb_guest_session_expiry';

interface SessionContextType {
  guestSessionId: string;
}

const SessionContext = createContext<SessionContextType>({
  guestSessionId: '',
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [guestSessionId, setGuestSessionId] = useState('');

  useEffect(() => {
    async function initSession() {
      const savedId = localStorage.getItem(SESSION_KEY);
      const savedExpiry = localStorage.getItem(SESSION_EXPIRY_KEY);
      const isValid =
        savedId &&
        savedExpiry &&
        new Date(savedExpiry) > new Date();


      if (isValid && savedId) {
        setGuestSessionId(savedId);
      } else {
        try {
          const newId = await createGuestSession();

          localStorage.setItem(SESSION_KEY, newId);
          const expiry = new Date();
          expiry.setHours(expiry.getHours() + 24);
          localStorage.setItem(SESSION_EXPIRY_KEY, expiry.toISOString());

          setGuestSessionId(newId);
        } catch (error) {
          console.error('Failed to create guest session:', error);
        }
      }
    }

    initSession();
  }, []);

  return (
    <SessionContext.Provider value={{ guestSessionId }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}