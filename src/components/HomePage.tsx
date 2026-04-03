import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTrips } from '../hooks/useTrips';
import { signOut } from '../services/authService';
import { createTrip } from '../services/tripService';
import type { TripFormData } from '../types';
import { formatDateRange } from '../utilities/dateUtils';
import { TripFormModal } from './TripFormModal';

export const HomePage = () => {
  const { user } = useAuth();
  const { trips, loading, error } = useTrips();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreateTrip = async (formData: TripFormData) => {
    if (!user) return;

    try {
      setCreateError(null);
      setCreating(true);
      const tripId = await createTrip(formData, user.id);
      setShowModal(false);
      navigate(`/trip/${tripId}`);
    } catch (error) {
      console.error('Failed to create trip:', error);
      setCreateError('Could not create trip. Check Firestore rules and try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="bg-emerald-700 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Trippin&apos;</h1>
          <div className="flex items-center gap-4">
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.displayName}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                {user?.displayName?.charAt(0) ?? 'U'}
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="text-emerald-200 hover:text-white text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            Failed to load trips. Ensure Firestore rules are published for authenticated users.
          </div>
        )}

        {createError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            {createError}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-emerald-800">Your Trips</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            + New Trip
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-emerald-700">
            Loading your trips...
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">✈️</div>
            <h3 className="text-xl text-gray-600 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first trip to start planning!
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {trips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => navigate(`/trip/${trip.id}`)}
                className="bg-white rounded-xl shadow-md overflow-hidden text-left hover:shadow-lg transition-shadow"
              >
                <div
                  className="h-32 bg-emerald-200"
                  style={
                    trip.imageUrl
                      ? {
                          backgroundImage: `url(${trip.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : undefined
                  }
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-emerald-800">
                    {trip.name}
                  </h3>
                  <p className="text-gray-600">{trip.destination}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <TripFormModal
          onSubmit={handleCreateTrip}
          onClose={() => setShowModal(false)}
          isSubmitting={creating}
        />
      )}
    </div>
  );
};
