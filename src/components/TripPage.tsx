import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { updateTrip } from '../services/tripService';
import type { Trip, TripEvent, EventFormData } from '../types';
import { formatDateRange } from '../utilities/dateUtils';
import { Timeline } from './Timeline';
import { EventFormModal } from './EventFormModal';
import { AddEventButton } from './AddEventButton';
import { createEvent, updateEvent, deleteEvent, reorderEvents } from '../services/eventService';

export const TripPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { events, loading: eventsLoading, error: eventsError } = useEvents(tripId);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripLoading, setTripLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TripEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tripName, setTripName] = useState('');
  const [tripError, setTripError] = useState<string | null>(null);
  const [eventActionError, setEventActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;

    const tripRef = doc(db, 'trips', tripId);
    const unsubscribe = onSnapshot(
      tripRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setTrip({
            id: snapshot.id,
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
          });
          setTripName(data.name);
          setTripError(null);
        }
        setTripLoading(false);
      },
      (error) => {
        console.error('Failed to load trip:', error);
        setTripError('Could not load trip. Check Firestore rules and sign-in status.');
        setTripLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tripId]);

  const handleCreateEvent = async (eventData: EventFormData) => {
    if (!tripId) return;

    try {
      setEventActionError(null);
      setIsSubmitting(true);
      const order = events.length;
      await createEvent(tripId, eventData, order);
      setShowEventModal(false);
    } catch (error) {
      console.error('Failed to create event:', error);
      setEventActionError('Could not add event. Check Firestore rules and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEvent = async (eventData: EventFormData) => {
    if (!tripId || !editingEvent) return;

    try {
      setEventActionError(null);
      setIsSubmitting(true);
      await updateEvent(tripId, editingEvent.id, eventData);
      setEditingEvent(null);
    } catch (error) {
      console.error('Failed to update event:', error);
      setEventActionError('Could not update event. Check Firestore rules and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!tripId) return;

    try {
      setEventActionError(null);
      await deleteEvent(tripId, eventId);
      setEditingEvent(null);
    } catch (error) {
      console.error('Failed to delete event:', error);
      setEventActionError('Could not delete event. Check Firestore rules and try again.');
    }
  };

  const handleReorderEvents = async (reorderedEvents: TripEvent[]) => {
    if (!tripId) return;

    try {
      await reorderEvents(tripId, reorderedEvents);
    } catch (error) {
      console.error('Failed to reorder events:', error);
    }
  };

  const handleUpdateTripName = async () => {
    if (!tripId || !tripName.trim()) return;

    try {
      await updateTrip(tripId, { name: tripName.trim() });
      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to update trip name:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tripId) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await updateTrip(tripId, { imageUrl: reader.result as string });
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-emerald-700 text-lg">Loading trip...</div>
      </div>
    );
  }

  if (tripError) {
    return (
      <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-center">
          {tripError}
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-emerald-600 hover:text-emerald-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center">
        <div className="text-gray-600 text-lg mb-4">Trip not found</div>
        <button
          onClick={() => navigate('/')}
          className="text-emerald-600 hover:text-emerald-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col">
      <header
        className="relative bg-emerald-700 text-white"
        style={
          trip.imageUrl
            ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${trip.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white flex items-center gap-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <div className="absolute top-4 right-4">
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.displayName}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center border-2 border-white">
              {user?.displayName?.charAt(0) ?? 'U'}
            </div>
          )}
        </div>

        <div className="pt-16 pb-8 px-4 text-center">
          {isEditingName ? (
            <div className="flex items-center justify-center gap-2">
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="text-2xl font-bold text-center bg-white/20 border-none rounded px-2 py-1 text-white placeholder-white/60"
                autoFocus
                onBlur={handleUpdateTripName}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateTripName()}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-2xl font-bold hover:opacity-80"
            >
              {trip.name}
            </button>
          )}
          <p className="text-white/80 mt-1">{trip.destination}</p>
          <p className="text-white/60 text-sm mt-1">
            {formatDateRange(trip.startDate, trip.endDate)}
          </p>

          <label className="mt-4 inline-block cursor-pointer text-sm text-white/70 hover:text-white">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {trip.imageUrl ? 'Change cover photo' : 'Add cover photo'}
          </label>
        </div>
      </header>

      <main className="flex-1 relative pb-24">
        {eventsError && (
          <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            Failed to load events. Ensure you have permission for this trip.
          </div>
        )}

        {eventActionError && (
          <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            {eventActionError}
          </div>
        )}

        {eventsLoading ? (
          <div className="text-center py-12 text-emerald-700">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📅</div>
            <p className="text-gray-500">
              No events yet. Add your first activity!
            </p>
          </div>
        ) : (
          <Timeline
            events={events}
            onEditEvent={setEditingEvent}
            onReorder={handleReorderEvents}
          />
        )}
      </main>

      <AddEventButton onClick={() => setShowEventModal(true)} />

      {showEventModal && (
        <EventFormModal
          onSubmit={handleCreateEvent}
          onClose={() => setShowEventModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {editingEvent && (
        <EventFormModal
          event={editingEvent}
          onSubmit={handleUpdateEvent}
          onClose={() => setEditingEvent(null)}
          onDelete={() => handleDeleteEvent(editingEvent.id)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};
