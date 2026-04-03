import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type { TripEvent, EventFormData } from '../types';

const getEventsCollection = (tripId: string) =>
  collection(db, 'trips', tripId, 'events');

export const createEvent = async (
  tripId: string,
  eventData: EventFormData,
  order: number
): Promise<string> => {
  try {
    const docRef = await addDoc(getEventsCollection(tripId), {
      ...eventData,
      order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (
  tripId: string,
  eventId: string,
  updates: Partial<TripEvent>
): Promise<void> => {
  try {
    const eventRef = doc(db, 'trips', tripId, 'events', eventId);
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (
  tripId: string,
  eventId: string
): Promise<void> => {
  try {
    const eventRef = doc(db, 'trips', tripId, 'events', eventId);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

export const reorderEvents = async (
  tripId: string,
  events: TripEvent[]
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    events.forEach((event, index) => {
      const eventRef = doc(db, 'trips', tripId, 'events', event.id);
      batch.update(eventRef, {
        order: index,
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error reordering events:', error);
    throw error;
  }
};

export const subscribeToTripEvents = (
  tripId: string,
  callback: (events: TripEvent[]) => void
): (() => void) => {
  const q = query(getEventsCollection(tripId), orderBy('order', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const events: TripEvent[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        name: data.name,
        location: data.location ?? undefined,
        cost: data.cost ?? undefined,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime ?? undefined,
        timezone: data.timezone,
        transportationType: data.transportationType ?? undefined,
        order: data.order,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt,
      };
    });
    callback(events);
  });
};
