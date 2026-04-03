import { useEffect, useState } from 'react';
import type { Trip } from '../types';
import { subscribeToUserTrips } from '../services/tripService';
import { useAuth } from './useAuth';

interface UseTripsReturn {
  trips: Trip[];
  loading: boolean;
  error: Error | null;
}

export const useTrips = (): UseTripsReturn => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setTrips([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const unsubscribe = subscribeToUserTrips(user.id, (trips) => {
        setTrips(trips);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load trips'));
      setLoading(false);
    }
  }, [user]);

  return { trips, loading, error };
};
