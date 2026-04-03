import { useEffect, useState } from 'react';
import type { TripEvent } from '../types';
import { subscribeToTripEvents } from '../services/eventService';

interface UseEventsReturn {
  events: TripEvent[];
  loading: boolean;
  error: Error | null;
}

export const useEvents = (tripId: string | undefined): UseEventsReturn => {
  const [events, setEvents] = useState<TripEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tripId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const unsubscribe = subscribeToTripEvents(tripId, (events) => {
        setEvents(events);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load events'));
      setLoading(false);
    }
  }, [tripId]);

  return { events, loading, error };
};
