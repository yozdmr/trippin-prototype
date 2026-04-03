import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Trip, TripFormData } from '../types';

const TRIPS_COLLECTION = 'trips';

export const createTrip = async (
  tripData: TripFormData,
  userId: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, TRIPS_COLLECTION), {
      ...tripData,
      ownerId: userId,
      collaboratorIds: [],
      imageUrl: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
};

export const updateTrip = async (
  tripId: string,
  updates: Partial<Trip>
): Promise<void> => {
  try {
    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    await updateDoc(tripRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    throw error;
  }
};

export const deleteTrip = async (tripId: string): Promise<void> => {
  try {
    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    await deleteDoc(tripRef);
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
};

export const subscribeToUserTrips = (
  userId: string,
  callback: (trips: Trip[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const q = query(
    collection(db, TRIPS_COLLECTION),
    where('ownerId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const trips: Trip[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          destination: data.destination,
          startDate: data.startDate,
          endDate: data.endDate,
          imageUrl: data.imageUrl ?? undefined,
          ownerId: data.ownerId,
          collaboratorIds: data.collaboratorIds ?? [],
          createdAt: data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt,
        };
      });
      callback(trips);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    }
  );
};
