import { useState } from 'react';
import type { FormEvent } from 'react';
import type { TripEvent, EventFormData, EventType, TransportationType } from '../types';
import { getTimezones, getCurrentTimezone } from '../utilities/dateUtils';

interface EventFormModalProps {
  event?: TripEvent;
  onSubmit: (data: EventFormData) => void;
  onClose: () => void;
  onDelete?: () => void;
  isSubmitting: boolean;
}

const EVENT_TYPE_OPTIONS: { value: EventType; label: string; icon: string }[] = [
  { value: 'activity', label: 'Activity', icon: '🎯' },
  { value: 'meal', label: 'Meal', icon: '🍽️' },
  { value: 'transportation', label: 'Transportation', icon: '🚗' },
  { value: 'lodging', label: 'Lodging', icon: '🏨' },
];

export const EventFormModal = ({
  event,
  onSubmit,
  onClose,
  onDelete,
  isSubmitting,
}: EventFormModalProps) => {
  const [type, setType] = useState<EventType>(event?.type ?? 'activity');
  const [name, setName] = useState(event?.name ?? '');
  const [location, setLocation] = useState(event?.location ?? '');
  const [cost, setCost] = useState(event?.cost?.toString() ?? '');
  const [startDateTime, setStartDateTime] = useState(
    event?.startDateTime ?? ''
  );
  const [endDateTime, setEndDateTime] = useState(event?.endDateTime ?? '');
  const [timezone, setTimezone] = useState(
    event?.timezone ?? getCurrentTimezone()
  );
  const [transportationType, setTransportationType] = useState<TransportationType>(
    event?.transportationType ?? 'daily'
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const timezones = getTimezones();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      name,
      location: location || undefined,
      cost: cost ? parseFloat(cost) : undefined,
      startDateTime,
      endDateTime: endDateTime || undefined,
      timezone,
      transportationType: type === 'transportation' ? transportationType : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-emerald-800">
            {event ? 'Edit Event' : 'Add Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {EVENT_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    type === option.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-xs text-gray-600">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {type === 'transportation' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transportation Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTransportationType('major')}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    transportationType === 'major'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">✈️</div>
                  <div className="text-xs text-gray-600">Major Transit</div>
                  <div className="text-xs text-gray-400">Flights, trains</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTransportationType('daily')}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    transportationType === 'daily'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">🚕</div>
                  <div className="text-xs text-gray-600">Daily Transit</div>
                  <div className="text-xs text-gray-400">Taxi, bus, metro</div>
                </button>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="eventName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="eventName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                type === 'activity'
                  ? 'Visit Eiffel Tower'
                  : type === 'meal'
                    ? 'Dinner at Le Cinq'
                    : type === 'transportation'
                      ? 'Flight to Paris'
                      : 'Hotel Le Marais'
              }
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location (optional)
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="123 Main St, Paris, France"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="cost"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cost (optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                id="cost"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDateTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date & Time
              </label>
              <input
                id="startDateTime"
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="endDateTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date & Time
              </label>
              <input
                id="endDateTime"
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                min={startDateTime}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Timezone
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {isSubmitting ? 'Saving...' : event ? 'Save Changes' : 'Add Event'}
            </button>
          </div>

          {event && onDelete && (
            <div className="pt-2">
              {showDeleteConfirm ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Confirm Delete
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full text-red-600 hover:text-red-700 py-2 text-sm"
                >
                  Delete this event
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
