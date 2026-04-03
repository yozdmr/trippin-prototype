import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TripEvent } from '../types';
import { formatDateTime, formatCurrency } from '../utilities/dateUtils';

interface TimelineEventProps {
  event: TripEvent;
  onEdit: () => void;
}

const getEventStyles = (event: TripEvent): { bg: string; border: string; dot: string } => {
  switch (event.type) {
    case 'meal':
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        dot: 'bg-orange-500',
      };
    case 'transportation':
      if (event.transportationType === 'major') {
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          dot: 'bg-purple-500',
        };
      }
      return {
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        dot: 'bg-sky-500',
      };
    case 'lodging':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'activity':
    default:
      return {
        bg: 'bg-white',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
  }
};

const getEventIcon = (event: TripEvent): string => {
  switch (event.type) {
    case 'meal':
      return '🍽️';
    case 'transportation':
      return event.transportationType === 'major' ? '✈️' : '🚕';
    case 'lodging':
      return '🏨';
    case 'activity':
    default:
      return '🎯';
  }
};

export const TimelineEvent = ({ event, onEdit }: TimelineEventProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const styles = getEventStyles(event);
  const icon = getEventIcon(event);
  const isMajorTransport = event.type === 'transportation' && event.transportationType === 'major';
  const isDailyTransport = event.type === 'transportation' && event.transportationType === 'daily';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex items-start gap-4 ${isDailyTransport ? 'pl-4' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className={`relative z-10 flex-shrink-0 ${
          isDailyTransport ? 'w-8 h-8' : 'w-12 h-12'
        } ${
          styles.dot
        } rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md`}
      >
        <span className={isDailyTransport ? 'text-sm' : 'text-xl'}>{icon}</span>
      </div>

      <button
        onClick={onEdit}
        className={`flex-1 ${styles.bg} border ${styles.border} rounded-lg shadow-sm hover:shadow-md transition-shadow text-left ${
          isMajorTransport ? 'p-4' : isDailyTransport ? 'p-2' : 'p-3'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-gray-800 truncate ${
                isDailyTransport ? 'text-sm' : ''
              }`}
            >
              {event.name}
            </h3>

            {event.location && !isDailyTransport && (
              <p className="text-sm text-gray-500 truncate mt-0.5">
                📍 {event.location}
              </p>
            )}

            <p
              className={`text-gray-500 mt-1 ${
                isDailyTransport ? 'text-xs' : 'text-sm'
              }`}
            >
              {formatDateTime(event.startDateTime)}
              {event.endDateTime && ` - ${formatDateTime(event.endDateTime)}`}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>

            {event.cost !== undefined && event.cost > 0 && !isDailyTransport && (
              <span className="text-xs font-medium text-emerald-600">
                {formatCurrency(event.cost)}
              </span>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};
