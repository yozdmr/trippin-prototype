import { useState } from 'react';
import type { FormEvent } from 'react';
import type { TripFormData } from '../types';

interface TripFormModalProps {
  onSubmit: (data: TripFormData) => void;
  onClose: () => void;
  isSubmitting: boolean;
  initialData?: Partial<TripFormData>;
}

export const TripFormModal = ({
  onSubmit,
  onClose,
  isSubmitting,
  initialData,
}: TripFormModalProps) => {
  const [name, setName] = useState(initialData?.name ?? '');
  const [destination, setDestination] = useState(initialData?.destination ?? '');
  const [startDate, setStartDate] = useState(initialData?.startDate ?? '');
  const [endDate, setEndDate] = useState(initialData?.endDate ?? '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, destination, startDate, endDate });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-emerald-800">
            {initialData ? 'Edit Trip' : 'Create New Trip'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="tripName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Trip Name
            </label>
            <input
              id="tripName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Summer Vacation 2024"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Destination
            </label>
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Paris, France"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                min={startDate}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
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
              {isSubmitting
                ? 'Creating...'
                : initialData
                  ? 'Save Changes'
                  : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
