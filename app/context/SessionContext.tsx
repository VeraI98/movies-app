'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createGuestSession } from '@/app/lib/moviedb';

const SESSION_KEY = 'moviedb_guest_session_id';
const SESSION_EXPIRY_KEY = 'moviedb_guest_session_expiry';
interface SessionContextType {
  guestSessionId: string;
  sessionError: string | null;
  ratings: Record<number, number>;
  saveRating: (id: number, value: number) => void;
}
const SessionContext = createContext<SessionContextType>({
  guestSessionId: '',
  sessionError: null,
  ratings: {},
  saveRating: () => {},
});
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [guestSessionId, setGuestSessionId] = useState('');
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  useEffect(() => {
    let active = true;
    async function initSession() {
      try {
        let savedId: string | null = null;
        let savedExpiry: string | null = null;
        try {
          savedId = localStorage.getItem(SESSION_KEY);
          savedExpiry = localStorage.getItem(SESSION_EXPIRY_KEY);
        } catch {
          /* Browsing still works when storage is blocked. */
        }
        const session =
          savedId && savedExpiry && new Date(savedExpiry) > new Date()
            ? { id: savedId, expiresAt: savedExpiry }
            : await createGuestSession();
        const { id } = session;
        if (!active) return;
        setGuestSessionId(id);
        if (id !== savedId) {
          try {
            localStorage.setItem(SESSION_KEY, id);
            localStorage.setItem(SESSION_EXPIRY_KEY, new Date(session.expiresAt).toISOString());
          } catch {
            /* Keep the session in memory. */
          }
        }
      } catch {
        if (active)
          setSessionError('Ratings are unavailable. Reload the page to try connecting again.');
      }
    }
    void initSession();
    return () => {
      active = false;
    };
  }, []);
  function saveRating(id: number, value: number) {
    setRatings((previous) => ({ ...previous, [id]: value }));
  }
  return (
    <SessionContext.Provider value={{ guestSessionId, sessionError, ratings, saveRating }}>
      {children}
    </SessionContext.Provider>
  );
}
export function useSession() {
  return useContext(SessionContext);
}
